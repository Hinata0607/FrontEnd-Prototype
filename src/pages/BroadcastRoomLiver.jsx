import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import BroadcastRoomInner from '../components/broadcastRoom/BroadcastRoomInner';


const BroadcastRoomLiver = (props) => {

    const [socket, setSocket] = useState(null);
    const [audienceSocketId, setAudienceSocketId] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [isSockedIdUpdated, setIsSockedIdUpdated] = useState(false); // LiverWindow展開時に配信者socketIdが更新されたらtureとなる。(1度しか呼ばないため)
    const [roomInfo, setRoomInfo] = useState(null);
    const [newComerFlag, setNewComerFlag] = useState(false); // 参加者が増える度にtrueとfalseが入れ替わる参加検知state。これを元に配信者の設定しているミュート情報などがuseEffectにより発火する
    const [isMic, setIsMic] = useState(true);
    const [isVideo, setIsVideo] = useState(true);
    const { roomId } = useParams();
    const videoRef = useRef(null);

    useEffect(() => {
        if (socket && peerConnection) {
            // windowが別だとsocketIdも別(別クライアントとして認識されるため)なので、Liver展開時に配信情報の配信者socketIDを更新する。(一度だけ実行)
            if (!isSockedIdUpdated) {
                socket.emit(`updateLiverSocketId`, roomId);
                setIsSockedIdUpdated(true);
            };

            // 配信者に新たな参加者が来たことを通知(offerを促すcallを受け取る)
            socket.on('newAudience', async (audienceSocketId)  => {
                setAudienceSocketId(audienceSocketId);
                console.log(`New audience joined with socket ID: ${audienceSocketId}`);
                // オファーを作成して新たな参加者に送信する
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit('offerToNewAudience', audienceSocketId, peerConnection.localDescription);
            });

            // 配信者からのアンサーを受け取る
            socket.on('answer', async (answer, audienceSocketId) => {
                console.log("Received answer from sender with socket ID:", audienceSocketId);
                // アンサーを自身のピア接続に設定
                await peerConnection.setRemoteDescription(answer);
                console.log("Remote description set successfully.");
                setNewComerFlag((prev) => !prev);
                // これ以降、ピア接続を介してデータの送受信が可能
            });

            // 参加者からのICEを受け取る
            socket.on('iceFromAudience', (ICE, audienceSocketId) => {
                console.log("ICE received!");
                peerConnection.addIceCandidate(ICE);
            });

            // 配信windowを閉じる要求を受け取った場合、閉じる。
            socket.on('closeWindow', ()=> {
                window.close();
            });

            // ルームの情報が更新されたり作成されたら受け取り、stateで管理
            socket.on('roomInfo', (roomInfo) => {
                setRoomInfo(roomInfo);
            })
        }
        return () => {
            // リスナーを解除
            if (socket) {
                socket.off('newAudience');
                socket.off('answer');
                socket.off('iceFromAudience');
                socket.off('roomInfo');
            }
        };
    }, [socket, peerConnection]); // eslint-disable-line react-hooks/exhaustive-deps

    if (peerConnection) {
        // 配信者にICE送信
        peerConnection.onicecandidate = (e) => {
            const ice = e.candidate;
            socket.emit("iceFromPeer", ice, audienceSocketId);
        };
    }

    if (peerConnection) {
        // 接続のステータス
        peerConnection.onconnectionstatechange = () => {
            console.log(peerConnection.connectionState);
        };
    }

    useEffect(() => { // 配信者がマイクやカメラの設定を切り替えた場合、全視聴者に対してミュートもしくは解除、動画共有の開始や停止の切り替えを行う
        const handleDevice = async () => {
            if (peerConnection && videoRef.current && socket) {
                // すべての送信者に新しいオーディオトラックを設定
                peerConnection.getSenders().forEach(sender => {
                    if (sender && sender.track && sender.track.kind === 'audio') {
                        sender.track.enabled = isMic;
                        socket.emit('isMute', roomId, isMic);// 配信者がマイクの設定を変更したことを通知する(これは参加者側のレイアウト調節のため)
                    } else if (sender && sender.track && sender.track.kind === 'video') {
                        sender.track.enabled = isVideo;
                        socket.emit('isShare', roomId, isVideo); // 配信者が動画の共有設定を変更したことを通知する(これは参加者側のレイアウト調節のため)
                    }
                });
            }
        };
        handleDevice();
    }, [isMic, isVideo, peerConnection, videoRef, newComerFlag, socket, roomId]);

    useEffect(() => { // 上のeffectと分けたのは、配信者が何らかの参加者とconnectして無くても画面のon offは反映させたいため
        const handleVideo = async () => {
            if (videoRef.current) {
                if (isVideo) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    videoRef.current.srcObject = stream;
                } else {
                    videoRef.current.srcObject = null;
                }
            }
        }
        handleVideo();
    }, [isVideo]);

    useEffect(() => {
        // サーバーとの接続を確立
        const newSocket = io('http://localhost:5001');
        const pc = new RTCPeerConnection();
        setSocket(newSocket);
        setPeerConnection(pc);
        // クリーンアップ関数で接続を解除
        return () => {
            newSocket.disconnect();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const initMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                videoRef.current.srcObject = stream;
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };
        initMediaStream();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
        {/* ルーム情報が読み込まれてからルームを表示 */}
        {roomInfo && <BroadcastRoomInner videoRef={videoRef} roomInfo={roomInfo} currentUser={props.currentUser} socket={socket}
                        isMic={isMic} setIsMic={setIsMic} isVideo={isVideo} setIsVideo={setIsVideo} liversMic={isMic} liversShare={isVideo}/>}
        </>
    )
}


export default BroadcastRoomLiver
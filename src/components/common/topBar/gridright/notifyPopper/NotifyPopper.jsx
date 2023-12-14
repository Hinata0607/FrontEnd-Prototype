import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Badge, IconButton, Tooltip, useTheme } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { isWindowScrollable } from "../../../../../redux/features/windowScrollaleSlice";
import NotifyPopperInner from './NotifyPopperInner';
import axios from 'axios';


const NotifyPopper = () => {

    const [isNotifyPopperOpen, setIsNotifyPopperOpen] = useState(false);
    const [notifyAnchorEl, setNotifyAnchorEl] = useState(null);
    const [unreadNum, setUnreadNum] = useState(NaN);
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const theme = useTheme();

    const handleNotifyPopper = (e) => {
        if (!isNotifyPopperOpen) {
            setNotifyAnchorEl(e.currentTarget);
            setIsNotifyPopperOpen(true);
        } else {
            setNotifyAnchorEl(null);
            setIsNotifyPopperOpen(false);
        }
    }

    useEffect(() => {
        if (isNotifyPopperOpen) {
          // ポッパーが展開されたときにスクロールを無効化
            dispatch(isWindowScrollable());
        } else {
            dispatch(isWindowScrollable());
        }
    }, [isNotifyPopperOpen, dispatch]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/client/notify/getUnread/${user._id}`);
                setUnreadNum(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchUnreadCount();
    }, [user]);

    return (
        <>

        <Tooltip title="通知" placement='bottom' arrow={true}>
            <StyledIconButton size='small' onClick={handleNotifyPopper} theme={theme}>
                <Badge color='secondary' badgeContent={unreadNum || null} max={99}>
                    {isNotifyPopperOpen ? <StyledNotificationsOutlinedIcon color='secondary'/> : <StyledNotificationsOutlinedIcon color="icon"/>}
                </Badge>
            </StyledIconButton>
        </Tooltip>

        {/* 閉じたら通知量も何もかも初期化 */}
        {isNotifyPopperOpen ? <NotifyPopperInner isNotifyPopperOpen={isNotifyPopperOpen} notifyAnchorEl={notifyAnchorEl} setNotifyAnchorEl={setNotifyAnchorEl} setIsNotifyPopperOpen={setIsNotifyPopperOpen}/> : null} 
        </>
    )
}

const StyledNotificationsOutlinedIcon = styled(NotificationsOutlinedIcon)`
    && {
        width: 35px;
        height: 35px;
    }
`

const StyledIconButton = styled(IconButton)`
    && {
        .MuiTouchRipple-child {
            background-color: ${(props) => props.theme.palette.secondary.main};
        }
    }
`


export default NotifyPopper
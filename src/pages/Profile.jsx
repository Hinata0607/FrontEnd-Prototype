import { ContentCopy, MoreVert, Notifications } from '@mui/icons-material';
import { Alert, Avatar, Chip, Grid, Hidden, IconButton, LinearProgress, Slide, Snackbar, Tab, Tabs, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import UserProfile from '../components/profile/UseProfile';
import UserProduct from '../components/profile/UserProduct';
import UserGroup from '../components/profile/UserGroup';
import UserLike from '../components/profile/UserLike';
import VerifiedBadge from '../layouts/badges/VerifiedBadge';
import ProfileUpdateModal from '../components/profile/ProfileUpdateModal';


const SlideTransition = (props) => {
  return <Slide {...props} direction="right" />;
};


const Profile = () => {

  const [isLinkSnack, setIsLinkSnack] = useState(false);
  const [isFollowSnack, setIsFollowSnack] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [upDateModal, setUpdateModal] = useState(false);
  const [isProfileChange, setIsProfileChange] = useState(false); // プロフィールに更新があった場合にtrueになりuseEffectでuserを再取得するフラグ

  const [uploadIcon, setUploadIcon] = useState();
  const [originalIcon, setOriginalIcon] = useState();
  const [binaryIcon, setBinaryIcon] = useState();
  const [uploadPrevIcon, setUploadPrevIcon] = useState();
  const [originalPrevIcon, setOriginalPrevIcon] = useState();
  const [binaryPrevIcon, setBinaryPrevIcon] = useState();
  const [iconCrop, setIconCrop] = useState({x: 0, y: 0});
  const [iconZoom, setIconZoom] = useState(1);

  const siteAssetsPath = process.env.REACT_APP_SITE_ASSETS;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const currentUser = useSelector((state) => state.user.value);
  const { userId } = useParams();
  const theme = useTheme();

  const handleLinkCopy = () => {
    const currentUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setIsLinkSnack(!isLinkSnack);
      })
    }
  }

  const handleFollowSnack = () => {
    setIsFollowSnack(true);
  }

  const handleLinkSnackClose = () => {
    setIsLinkSnack(false)
  };

  const handleFollowSnackClose = () => {
    setIsFollowSnack(false);
  }

  const handleTabChange = (event, newValue) => {
    if (newValue - tabValue > 0) {
      setDirection("left")
    } else if (newValue - tabValue < 0) {
      setDirection("right");
    }
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await axios.get(`http://localhost:5000/client/user/getById/${userId}`);
        setUser(user.data);
        setIsLoading(false);
        setIsProfileChange(false) // プロフィールを読み込んだらプロフィール変更フラグをfalse
      } catch (err) {
        if (err.response) {
          console.log(err);
        } else if (err.request) {
          console.log(err);
        } else {
            console.log(err);
        }
      }
    }
    fetchUser();
  }, [userId, isProfileChange]);

  return (
    <>
    {!isLoading ? 
    <StyledProfile $isSmallScreen={isSmallScreen}>
      <StyledHeaderZone backHeader={user.header ? `${siteAssetsPath}/${user.header}` : `${siteAssetsPath}/default_header/default_header.png`} theme={theme}>
        <StyledHeaderDarkness>
          <StyledInnerBack backHeader={user.header ? `${siteAssetsPath}/${user.header}` : `${siteAssetsPath}/default_header/default_header.png`} theme={theme}></StyledInnerBack>
          <StyledButtons $isSmallScreen={isSmallScreen}>
            <Tooltip title="リンクコピー" placement='top' arrow={true}>
              <StyledIconButton theme={theme} onClick={handleLinkCopy}>
                <ContentCopy />
              </StyledIconButton>
            </Tooltip>
            <Tooltip title="その他" placement='top' arrow={true}>
              <StyledIconButton theme={theme}>
                <MoreVert />
              </StyledIconButton>
            </Tooltip>
          </StyledButtons>
        </StyledHeaderDarkness>
      </StyledHeaderZone>

      <StyledUserInfo $isSmallScreen={isSmallScreen} $isXsScreen={isXsScreen}>
        <Grid container>
          <Hidden only={["xs"]}>
            <StyledUserGridItemLeft item xs={0} sm={2} md={2} $isXsScreen={isXsScreen}>
              <StyledAvatar src={user.icon ? `http://localhost:5000/uploads/userIcons/${user.icon}` : `${siteAssetsPath}/default_icons/${user.defaultIcon}`} $isSmallScreen={isSmallScreen}/>
            </StyledUserGridItemLeft>
          </Hidden>
          <StyledUserGridItemCenter item xs={6} sm={5} md={6} $isXsScreen={isXsScreen}>
            <StyledNameAndId>
              <StyledUsername theme={theme} $isSmallScreen={isSmallScreen}><div style={{ display: 'flex', alignItems: 'center' }}>{!user.iaAuthorized ? <VerifiedBadge /> : null}{user.username}</div></StyledUsername>
              <StyledUserId theme={theme} $isSmallScreen={isSmallScreen}>@{user.userId}</StyledUserId>
            </StyledNameAndId>
          </StyledUserGridItemCenter>
          <StyledUserGridItemRight item xs={6} sm={5} md={4} $isXsScreen={isXsScreen}>
            <StyledFollowAndNotify>
              {currentUser._id === user._id ?
              <Tooltip title="プロフィール編集" placement='top' arrow={true}>
              <StyledFollowTab label="プロフィール編集" variant="outlined" style={{color: theme.palette.text.main}} clickable onClick={() => setUpdateModal(true)}/>
            </Tooltip>
            :
            <Tooltip title="フォローする" placement='top' arrow={true}>
                <StyledFollowTab label="フォロー" variant="outlined" color="secondary" clickable onClick={handleFollowSnack}/>
            </Tooltip>
            }
              {currentUser._id !== user._id &&
              <Tooltip title="通知" placement='top' arrow={true}>
                <StyledNotifyIconButton theme={theme}>
                  <Notifications />
                </StyledNotifyIconButton>
              </Tooltip>
              }
            </StyledFollowAndNotify>
          </StyledUserGridItemRight>
        </Grid>
      </StyledUserInfo>

      <StyledUserInfoBar $isXsScreen={isXsScreen}>
        <Grid container>
          <Hidden only={["xs"]}>
            <Grid item xs={0} sm={2}></Grid>
          </Hidden>
          <StyledStatusGrid item xs={12} sm={10}>
          <div style={{display: "flex", gap: "20px"}}>
            <StyledStatus theme={theme}><StyledSpan theme={theme}>{user.followings.length}</StyledSpan> フォロー</StyledStatus>
            <StyledStatus theme={theme}><StyledSpan theme={theme}>{user.followings.length}</StyledSpan> フォロワー</StyledStatus>
          </div>
          <StyledBadges>
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
            {!user.iaAuthorized ? <VerifiedBadge /> : null}
          </StyledBadges>
          </StyledStatusGrid>
        </Grid>
      </StyledUserInfoBar>

      <StyledTabs value={tabValue} onChange={handleTabChange} indicatorColor='secondary' theme={theme}>
        <Tooltip title="ユーザー" placement='top' arrow><StyledTab theme={theme} label="ユーザー"></StyledTab></Tooltip>
        <Tooltip title="商品" placement='top' arrow><StyledTab theme={theme} label="商品"></StyledTab></Tooltip>
        <Tooltip title="グループ" placement='top' arrow><StyledTab theme={theme} label="グループ"></StyledTab></Tooltip>
        <Tooltip title="いいね" placement='top' arrow><StyledTab theme={theme} label="いいね"></StyledTab></Tooltip>
      </StyledTabs>

      <StyledProfileMain>
        {tabValue === 0 &&
        <UserProfile direction={direction} user={user} isExpanded={isExpanded} setIsExpanded={setIsExpanded} setTabValue={setTabValue}/>
        }
        {tabValue === 1 &&
        <UserProduct direction={direction}/>
        }
        {tabValue === 2 &&
        <UserGroup direction={direction}/>
        }
        {tabValue === 3 &&
        <UserLike direction={direction}/>
        }
      </StyledProfileMain>
    </StyledProfile>

    :

    <LinearProgress color='secondary' style={{backgroundColor: "transparent"}}/>
    }

    <Snackbar open={isLinkSnack} onClose={handleLinkSnackClose} TransitionComponent={SlideTransition} autoHideDuration={3000}>
      <Alert severity='success'>リンクをコピーしました</Alert>
    </Snackbar>
    <Snackbar open={isFollowSnack} onClose={handleFollowSnackClose} TransitionComponent={SlideTransition} autoHideDuration={10000}>
      <Alert severity='info'>username さんをフォローしました</Alert>
    </Snackbar>

    <ProfileUpdateModal open={upDateModal} setOpen={setUpdateModal} setUpdateModal={setUpdateModal} user={user} currentUser={currentUser} setIsProfileChange={setIsProfileChange}
    uploadIcon={uploadIcon} setUploadIcon={setUploadIcon} originalIcon={originalIcon} setOriginalIcon={setOriginalIcon} binaryIcon={binaryIcon} setBinaryIcon={setBinaryIcon}
    iconCrop={iconCrop} setIconCrop={setIconCrop} iconZoom={iconZoom} setIconZoom={setIconZoom} uploadPrevIcon={uploadPrevIcon} setUploadPrevIcon={setUploadPrevIcon} originalPrevIcon={originalPrevIcon}
    setOriginalPrevIcon={setOriginalPrevIcon} binaryPrevIcon={binaryPrevIcon} setBinaryPrevIcon={setBinaryPrevIcon}/>
    </>
  )
}


const StyledProfile = styled.div`
  width: ${(props) => (props.$isSmallScreen ? "100%" : "90%")};
  max-width: 3000px;
  height: 2000px;
  margin: 0 auto;
`

const StyledHeaderZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  aspect-ratio: 6/1;
  width: 100%;
  background-image: url(${(props => props.backHeader)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: ${(props) => props.theme.palette.background.productBack};
`

const StyledHeaderDarkness = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`

const StyledInnerBack = styled.div`
  height: 100%;
  aspect-ratio: 4/1;
  background-image: url(${(props => props.backHeader)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: ${(props) => props.theme.palette.background.productBack};
`

const StyledButtons = styled.div`
  position: absolute;
  bottom: ${(props) => (props.$isSmallScreen ? 0 : "15px")};
  right: ${(props) => (props.$isSmallScreen ? 0 : "15px")};
  display: flex;
  gap: 15px;
  width: fit-content;
  padding: 5px;
`

const StyledIconButton = styled(IconButton)`
  && {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);

    .MuiTouchRipple-child {
      background-color: transparent;
  }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
      background-color: rgba(255, 255, 255, 0.1);
  }
  }
`

const StyledUserInfo = styled.div`
  width: 100%;
  height: ${(props) => (props.$isXsScreen ? "100px" : "150px")};
  margin: ${(props) => (props.$isSmallScreen ? "15px" : "30px")} auto 0 auto;
`

const StyledUserGridItemLeft = styled(Grid)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props) => (props.$isXsScreen ? "100px" : "150px")};
  }
`

const StyledUserGridItemCenter = styled(Grid)`
  && {
    display: flex;
    justify-content: start;
    align-items: center;
    height: ${(props) => (props.$isXsScreen ? "100px" : "150px")};
  }
`

const StyledUserGridItemRight = styled(Grid)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props) => (props.$isXsScreen ? "100px" : "150px")};
  }
`

const StyledAvatar = styled(Avatar)`
  && {
    height: ${(props) => (props.$isSmallScreen ? "100px" : "130px")};
    width: ${(props) => (props.$isSmallScreen ? "100px" : "130px")};
  }
`

const StyledNameAndId = styled.div`
  height: fit-content;
  width: 100%;
  padding: 30px;
  margin: 0 auto;
`

const StyledUsername = styled.div`
  font-size: ${(props) => (props.$isSmallScreen ? "1.5rem" : "1.7rem")};
  color: ${(props) => props.theme.palette.text.main};
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const StyledUserId = styled.div`
  font-size: ${(props) => (props.$isSmallScreen ? "1.2rem" : "1.4rem")};
  color: ${(props) => props.theme.palette.text.sub};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledFollowAndNotify = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 15px;
  padding: 0 30px;
  width: 100%;
`

const StyledFollowTab = styled(Chip)`
  && {
    width: 200px;
    height: 50px;
    font-size: 1rem;
    font-weight: bold;
  }
`

const StyledNotifyIconButton = styled(IconButton)`
  && {
    width: 50px;
    height: 50px;
    color: ${(props) => props.theme.palette.text.sub};
    border: solid 1px ${(props) => props.theme.palette.text.sub};
    background-color: transparent;

    &:hover {
      background-color: ${(props) => props.theme.palette.background.hover};
    }
  }
`

const StyledUserInfoBar = styled.div`
  width: 100%;
  height: fit-content;
  margin: ${(props) => (props.$isXsScreen ? "20px" : 0)} auto;
`

const StyledStatusGrid = styled(Grid)`
  && {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
    padding: 0 30px;
  }
`

const StyledBadges = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  max-width: 40%;
`

const StyledStatus = styled.div`
  color: ${(props) => props.theme.palette.text.sub};
  font-size: 0.9rem;
`

const StyledSpan = styled.span`
    color: ${(props) => props.theme.palette.text.main};
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
    &:active {
        text-decoration: none;
    }
`

const StyledTabs = styled(Tabs)`
    && {
      width: 100%;
      margin: 30px auto 0 auto;
      .MuiTabs-indicator {
        bottom: 0;
      }
    }
`

const StyledTab = styled(Tab)`
    && {
      flex: 1 1 0;
      max-width: 25%;
      color: ${(props) => props.theme.palette.text.tab};
      border-bottom: solid 1px ${(props) => props.theme.palette.line.tab};

      &.Mui-selected {
        color: ${(props) => props.theme.palette.text.main};
      }
    }
`

const StyledProfileMain = styled.div`
    width: 100%;
    height: fit-content;
    max-height: 1000px;
`


export default Profile
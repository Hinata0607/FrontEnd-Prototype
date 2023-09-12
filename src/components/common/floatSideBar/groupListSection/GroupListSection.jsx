import { Avatar, ListItem, Tooltip, useTheme } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { booleanFloatSideBarGroup } from '../../../../redux/features/floatSideBarGroupSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const GroupListSection = () => {

    const groups = [{
        id: 1,
        name: "group1aaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    {
        id: 2,
        name: "group2ああああああああああああああ",
    },
    {
        id: 3,
        name: "group3",
    },
    {
        id: 4,
        name: "group4",
    },
    {
        id: 5,
        name: "group5",
    },
    {
        id: 6,
        name: "group6",
    },
    {
        id: 7,
        name: "group7",
    },]; 

    const dispatch = useDispatch();
    const isOpenGroup = useSelector((state => state.floatSideBarGroup.value));
    const visibleGroups = isOpenGroup ? groups : groups.slice(0, 5);
    const theme = useTheme();

    const toggleGroupShowAll = () => {
        dispatch(booleanFloatSideBarGroup());
    }

    return (
        <>
            <StyledListBlockWithTitle>
                {visibleGroups.map((group) => 
                <StyledListItem key={group.id}>
                    <Tooltip title={group.name} placement='right' arrow={true}>
                        <StyledListElements theme={theme}>
                            <StyledAvatar variant='square' />
                            <StyledListItemText theme={theme.palette.text.main}>{group.name}</StyledListItemText>
                        </StyledListElements>
                    </Tooltip>
                </StyledListItem>)}
                {groups.length > 5 && !isOpenGroup && (
                    <StyledListItem>
                        <Tooltip title="すべて表示" placement='right' arrow>
                            <StyledListElements theme={theme} onClick={toggleGroupShowAll}>
                                <StyledListItemText theme={theme.palette.text.sub2}>すべて表示</StyledListItemText>
                                <StyledExpandMoreIcon color="icon"/>
                            </StyledListElements>
                        </Tooltip>
                    </StyledListItem>
                )}
                {groups.length > 5 && isOpenGroup && (
                    <StyledListItem>
                    <Tooltip title="折りたたむ" placement='right' arrow>
                        <StyledListElements theme={theme} onClick={toggleGroupShowAll}>
                        <StyledListItemText theme={theme.palette.text.sub2}>折りたたむ</StyledListItemText>
                            <StyledExpandLessIcon color="icon"/>
                        </StyledListElements>
                    </Tooltip>
                </StyledListItem>
                )}
            </StyledListBlockWithTitle>
        </>
    )
}


const StyledListItem = styled(ListItem)`
    && {
        justify-content: center;
        height: 45px;
        width: 230px;
        padding: 0;
    }
`

const StyledListItemText = styled.div`
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${(props) => props.theme};
`

const StyledListBlockWithTitle = styled.div`
    padding-bottom 15px;

    &:nth-child(1) {
        padding-top: 0;
    }
`

const StyledListElements = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    height: 100%;
    width: 95%;
    padding-left: 5px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.palette.background.hover};
    }
`

const StyledAvatar = styled(Avatar)`
    && {
        width: 35px;
        height: 35px;
    }
`

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
    && {
        width: 25px;
        height: 25px;
    }
`

const StyledExpandLessIcon = styled(ExpandLessIcon)`
    && {
        width: 25px;
        height: 25px;
    }
`


export default GroupListSection
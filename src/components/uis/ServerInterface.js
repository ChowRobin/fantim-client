import React from 'react';
import logo from '../../img/interface.png';
import userHeader from '../../img/user-header.png';
import groupIcon from '../../img/group_icon.png';
import consultantHeader from '../../img/consultant-header.png';
import '../../css/server-interface.css';
import '../../css/app.css';
import { Button, Avatar, Collapse, Dropdown, Menu, Empty, Badge} from 'antd';
import { TeamOutlined, DownOutlined, UserOutlined} from '@ant-design/icons';
import ChatCore from './ChatCore';
import Friends from './Friends';
import Groups from './Groups';
import {pullAllMsg} from '../../utils/Message'
import store from '../../utils/Store';
import {fetchFriendList, fetchUser} from '../../utils/Friend'
import {fetchGroups} from '../../utils/Group'
import AddFriend from './AddFriend'
import AddGroup from './AddGroup'

export default class ServerInterface extends React.Component {
    constructor(props) {
        super(props);

        this.openService = this.openService.bind(this);

        let userId = parseInt(window.localStorage.getItem("userId"))
        fetchUser(userId) 
        pullAllMsg(userId)
        fetchFriendList(userId)
        fetchGroups()
        // mock
    }

    componentDidMount() {
    }

    openService(e) {
        let toId = e.currentTarget.getAttribute('id');
        store.dispatch({type: 'SELECT', payload: {selectConvId: toId}})
    }

    displayInput(e) {
        const { children } = e.currentTarget;
        e.currentTarget.style.backgroundColor = '#fff';
        children[0].style.display = 'none';
        children[1].style.display = 'none';
        children[2].style.display = 'flex';
    }

    render() {
        const { conversations, sendMessage, toId, friends, userInfos, myApplys, otherApplys, groups, searchGroups, searchMsgList } = this.props;

        const { Panel } = Collapse;


        let curConversation = conversations[toId]
        let userId = parseInt(window.localStorage.getItem("userId"))

        let allConvDiv = Object.entries(conversations)
            .sort(([, v1], [, v2]) => v2.lastTime.localeCompare(v1.lastTime))
            .map(([k, v], index) =>
                <div className="body_center_first" style={{backgroundColor:k===toId?'#b0ceff':''}} key={k} id={k} onClick={this.openService}>
                    <div className="body_center_first_header">
                        {
                            v.conversationType==0&&<img alt="用户头像" src={userHeader} />
                        }
                        {
                            v.conversationType==1&&<Avatar ><TeamOutlined /></Avatar>
                        }
                        <Badge count={v.unReadCount} overflowCount={99} offset={[5,-10]}>
                            <a href="#" className="head-example" />
                        </Badge>
                    </div>
                    <div className="body_center_first_body">
                        <div className="body_top">
                            {
                                v.conversationType==0&&<div>{userInfos[v.otherUserId]!=undefined?userInfos[v.otherUserId].nickname:'好友'}</div>
                            }
                            {
                                v.conversationType==1&&<div>{groups[v.groupId]!=undefined?groups[v.groupId].name:'群聊'}</div>
                            }
                            <div>{v.lastTime}</div>
                        </div>
                        <div className="body_bottom">
                            {v.messages!=undefined?v.messages[v.messages.length - 1]!=undefined?v.messages[v.messages.length - 1].content:'':''}
                        </div>
                    </div>
                </div>
            );

        const avatarMenu = (
            <Menu>
                <Menu.Item >
                    用户信息
                </Menu.Item>
                <Menu.Item onClick={e => window.Location.href='/'}>
                <a target="_self" rel="noopener noreferrer" href="/">
                    退出登陆 
                </a>
                </Menu.Item>
            </Menu>
        )

        return (<div id="interface_main">
            <div id="interface_header">
                <div id="interface_header_left">
                  <a target="_self" rel="noopener noreferrer" href="#/server">
                    <img src={logo} alt="界面Logo" />
                  </a>
                </div>
                <div id="interface_header_right">
                    <Dropdown overlay={avatarMenu}>
                        <Avatar size={50}>{userInfos[userId]!=undefined?userInfos[userId].nickname:'me'}</Avatar>
                    </Dropdown>
                </div>
            </div>
            <div id="interface_body" >
                {/* <div id="body_left"><LeftNavigator /></div> */}
                <div id="body_center">
                    <div id="body_center_first">
                        {
                            JSON.stringify(conversations)=="{}"&&
                            <div>
                                <br /><br /><br /><br />
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂时没有会话～快去找好友聊天吧"/>
                            </div>
                        }
                        {allConvDiv}
                    </div>
                    <div id="body_center_second">
                        <ChatCore contentHeight='590px' textInputHeight='160px'
                            myHeader={consultantHeader} itsHeader={userHeader}
                            {...{ userInfos, toId, sendMessage, curConversation, groups, searchMsgList}} />
                    </div>
                    <div id="body_center_third">
                    <Collapse style={{width:'333px', 'border-radius':'15px'}} bordered={false} defaultActiveKey={['1']}>
                        <Panel header="我的好友" key="1">
                            <Friends {...{friends}} /> 
                            <AddFriend {...{friends, userInfos, myApplys, otherApplys}} />
                        </Panel>
                        <Panel header="我的群聊" key="2">
                            <Groups {...{groups}} /> 
                            <AddGroup {...{userInfos, myApplys, otherApplys, groups, searchGroups, friends}} />
                        </Panel>
                    </Collapse>
                    </div>
                </div>
            
            </div>
        </div>);
    }
}

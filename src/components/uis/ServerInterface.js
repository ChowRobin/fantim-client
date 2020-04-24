import React from 'react';
import logo from '../../img/interface.png';
import userHeader from '../../img/user-header.png';
import consultantHeader from '../../img/consultant-header.png';
import '../../css/server-interface.css';
import '../../css/app.css';
import { Button, Avatar, Collapse, Dropdown, Menu} from 'antd';
import { PlusOutlined, UserOutlined} from '@ant-design/icons';
import ChatCore from './ChatCore';
import Friends from './Friends';
import LeftNavigator from './LeftNavigator';
import { generalFetch } from '../../utils/Utils';
import {pullAllMsg} from '../../utils/Message'
import store from '../../utils/Store';
import {fetchFriendList, fetchUser} from '../../utils/Friend'
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
        const { conversations, sendMessage, toId, friends, userInfos, myApplys, otherApplys } = this.props;

        const { Panel } = Collapse;


        let curConversation = conversations[toId]
        let userId = parseInt(window.localStorage.getItem("userId"))

        const allConvDiv = Object.entries(conversations)
            .sort(([, v1], [, v2]) => v2.lastTime.localeCompare(v1.lastTime))
            .map(([k, v], index) =>
                <div className="body_center_first" style={{backgroundColor:k===toId?'#b0ceff':''}} key={k} id={k} onClick={this.openService}>
                    <div className="body_center_first_header"><img alt="用户头像" src={userHeader} /></div>
                    <div className="body_center_first_body">
                        <div className="body_top">
                            <div>{friends[v.otherUserId]!=undefined?friends[v.otherUserId].nickname:'陌生人'}</div>
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
                <div id="body_left"><LeftNavigator /></div>
                <div id="body_center">
                    <div id="body_center_first">{allConvDiv}</div>
                    <div id="body_center_second">
                        <ChatCore contentHeight='590px' textInputHeight='160px'
                            myHeader={consultantHeader} itsHeader={userHeader}
                            {...{ toId, sendMessage, curConversation}} />
                    </div>
                    <div id="body_center_third">
                    <Collapse style={{width:'333px', 'border-radius':'15px'}} bordered={false} defaultActiveKey={['1']}>
                        <Panel header="我的好友" key="1">
                            <Friends {...{friends}} /> 
                            <AddFriend {...{friends, userInfos, myApplys, otherApplys}} />
                        </Panel>
                        <Panel header="我的群聊" key="2">
                            <AddGroup {...{friends, userInfos, myApplys, otherApplys}} />
                        </Panel>
                    </Collapse>
                    </div>
                </div>
            
            </div>
        </div>);
    }
}

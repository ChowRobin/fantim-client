import React from 'react';
import '../../css/chatcore.css';
import userHeader from '../../img/user-header.png';
import consultantHeader from '../../img/consultant-header.png';
import emoj from '../../img/emoj.png';
import picture from '../../img/picture.png';
import file from '../../img/file.png';
import EmojiPicker from './EmojiPicker';
import { regPayload } from '../../utils/PayloadReg';
import FileUpload from './FileUpload';
import store from '../../utils/Store';
import {genConversationId} from '../../utils/Message'
import '../../css/app.css';
import {Modal, Button } from 'antd';
import { PlusCircleFilled, UserAddOutlined } from '@ant-design/icons';

export default class FriendList extends React.Component {
    constructor(props) {
        super(props);
        this.areaRef = React.createRef();

        this.displayChoose = this.displayChoose.bind(this);
        this.openAddFriend = this.openAddFriend.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state =  {
            ModalText: '搜索',
            visible: false,
            confirmLoading: false,
        };

    }


    displayInput(e) {
        const { children } = e.currentTarget;
        e.currentTarget.style.backgroundColor = '#fff';
        children[0].style.display = 'none';
        children[1].style.display = 'none';
        children[2].style.display = 'flex';
    }

    displayChoose(e) {
        let toId = e.currentTarget.getAttribute('id');
        let myId = parseInt(window.localStorage.getItem("userId"))
        let convId = genConversationId(myId, toId)
        store.dispatch({type: 'SELECT', payload: {selectConvId: convId, friendId: toId}})
    }

    displayContextMenu(e) {
        e.preventDefault();
    }

    hideContextMenu(e) {
        var menu = e.currentTarget.children[2];
        menu.style.display = "none";
    }

    openAddFriend() {
        console.log('openAddFriend call')
        this.setState({
            visible: true,
        });
    };

    handleOk () {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
            visible: false,
            confirmLoading: false,
            });
        }, 2000);
    };

    handleCancel () {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };


    render() {
        //注意：在数组中使用Spread syntax（扩展语法）注意要判 `null | undefined`
        //参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Only_for_iterables
        const { friends } = this.props;
        const { visible, confirmLoading, ModalText } = this.state;

        // 处理朋友列表
        let friendList = Object.values(friends)

        return <div >
            {
                JSON.stringify(friendList) !== '{}' && friendList.map(({user_id, nickname })=>(
                    <div className="body_center_first" key={user_id} id={user_id}
                        onClick={this.displayChoose}
                        onContextMenu={this.displayContextMenu}
                        >
                        <div className="body_center_first_header"><img alt="用户头像" src={userHeader} /></div>
                            <div className="body_center_first_body">
                            <div className="body_top">
                                <div>  {nickname}</div>
                            </div>
                        </div>
                    </div>
                ))
            }
            {/* <Button type="link" onClick={this.openAddFriend} >加好友</Button> */}
            <Modal
                    title=""
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <p>{ModalText}</p>
                </Modal>
                 
        </div>;
    }
}
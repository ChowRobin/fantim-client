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
import { Button, PageHeader, Dropdown, Menu } from 'antd';
import {EllipsisOutlined } from '@ant-design/icons';
import { fetchUser } from '../../utils/Friend';

export default class ChatCore extends React.Component {
    constructor(props) {
        super(props);
        this.areaRef = React.createRef();
        this.scrollRef = React.createRef();

        this.sendEmoji = this.sendEmoji.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMessage0 = this.sendMessage0.bind(this);

    }

    componentDidMount() {
        this.scrollEnd();
    }

    componentDidUpdate() {
        this.scrollEnd();
    }

    scrollEnd() {
        let scrollDom = this.scrollRef.current;
        scrollDom.scrollTop = scrollDom.scrollHeight;
    }

    sendEmoji(emoji) {
        if(!this.props.toId){
            alert('未指定聊天对象！');
            return;
        }
        this.props.sendMessage(`<E:${emoji.id}>`,this.props.toId);
    }

    sendMessage(e) {
        e.preventDefault();
        if(!this.props.toId){
            alert('未指定聊天对象！');
            return;
        }
        let value = this.areaRef.current.value;
        if (value.trim() === '') {
            alert('输入内容不能为空');
            return;
        }
        let curConv = this.props.curConversation
        this.props.sendMessage({conversationType: curConv.conversationType, content: value},this.props.toId);
        // this.props.sendMessage(value,this.props.toId);
        this.areaRef.current.value = '';
    }

    sendMessage0(e) {
        // e.preventDefault();//注意这里keydown就不要阻止默认事件了，否则没法输入
        if (!(e.ctrlKey === true && e.keyCode === 13))//ctrl+enter发送
            return;
        if(!this.props.toId){
            alert('未指定聊天对象！');
            return;
        }
        let value = this.areaRef.current.value;
        if (value.trim() === '') {
            alert('输入内容不能为空');
            return;
        }
        let curConv = this.props.curConversation
        this.props.sendMessage({conversationType: curConv.conversationType, content: value},this.props.toId);
        this.areaRef.current.value = '';
    }

    render() {
        //注意：在数组中使用Spread syntax（扩展语法）注意要判 `null | undefined`
        //参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Only_for_iterables
        const {myHeader=userHeader, itsHeader=consultantHeader, contentHeight, textInputHeight, sendMessage, toId, curConversation, userInfos, groups} = this.props;

        let msgList = []
        let curConvType = 0
        let curUserId 
        let curGroupId
        let headerName
        if (curConversation != undefined) {
            curUserId = curConversation.otherUserId
            curGroupId = curConversation.groupId
            msgList = curConversation.messages
            curConvType = curConversation.conversationType

            if (curConvType == 1 && msgList != undefined) {
                msgList.map(({sender})=>{
                    if (userInfos[sender]==undefined) {
                        fetchUser(sender)
                    }
                })
            }

            headerName = ''
            if (curConvType == 0 && userInfos[curUserId] != undefined) {
                headerName = userInfos[curUserId].nickname
            } else if (curConvType == 1 && groups[curGroupId] != undefined) {
                headerName = groups[curGroupId].name
            }

        }

        const SingleMenu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                  好友资料
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                  聊天记录
                </a>
              </Menu.Item>
            </Menu>
          );

        const GroupMenu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                    群资料
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                    聊天记录
                </a>
              </Menu.Item>
            </Menu>
          );

        const DropdownMenu = () => {
            if (curConvType == 1) {
                return (
                <Dropdown key="more" overlay={GroupMenu}>
                    <Button
                    style={{
                        border: 'none',
                        padding: 0,
                    }}
                    >
                    <EllipsisOutlined
                        style={{
                        fontSize: 20,
                        verticalAlign: 'top',
                        }}
                    />
                    </Button>
                </Dropdown>
                );
            } else if (curConvType == 0) {
                return (
                    <Dropdown key="more" overlay={SingleMenu}>
                        <Button
                        style={{
                            border: 'none',
                            padding: 0,
                        }}
                        >
                        <EllipsisOutlined
                            style={{
                            fontSize: 20,
                            verticalAlign: 'top',
                            }}
                        />
                        </Button>
                    </Dropdown>
                    );
            }
            return null
          };

        return <div id="chat_core_body">
            <PageHeader
                className="site-page-header"
                // onBack={() => null}
                title={headerName}
                style={{border:'1px solid rgb(235, 237, 240)'}}
                extra={[
                    <DropdownMenu key="more" />,
                ]}
            />
            <div id="content" ref={this.scrollRef} style={{height:contentHeight}}>
                <div id="content-internal">
                    {
                        curConvType == 0 && msgList != undefined && msgList.map(({ myself, createTime, content }, index) => (
                            <div className={myself?'my':'its'} key={createTime + index}>
                                <div className="info">{regPayload(content, this.scrollEnd)}</div>
                                <img alt='' src={myself?myHeader:itsHeader}/>
                            </div>
                        ))

                    }
                    {
                        curConvType == 1 && msgList != undefined && msgList.map(({ myself, sender, createTime, content }, index) => (
                            <div className={myself?'my':'its-g'} key={createTime + index}>
                                {/* <Avatar size={50}>{userInfos[sender]!=undefined?userInfos[sender].nickname:'me'}</Avatar> */}
                                <span>{!myself?userInfos[sender]!=undefined?userInfos[sender].nickname:'陌生人':''}</span>
                                <div className="info">{regPayload(content, this.scrollEnd)}</div>
                                <img alt='' src={myself?myHeader:itsHeader}/>
                            </div>
                        )) 
                    }
                </div>
            </div>
            <div id="tools">
                <div id="tools-content">
                    <div id="emoj"><img src={emoj} alt="表情包"/><EmojiPicker id="emoji-picker" selectFuntion={this.sendEmoji} /></div>
                    <FileUpload id="picture" accept="image/*" toId={toId} sendMessage={sendMessage}>
                        <img src={picture} alt="上传图片"/>
                    </FileUpload>
                    <FileUpload id="file" toId={toId} sendMessage={sendMessage} >
                        <img src={file} alt="上传文件"/>
                    </FileUpload>
                </div>
            </div>
            <div id="textInput" style={{height:textInputHeight}}>
                <textarea id="text-area" ref={this.areaRef} autoFocus onKeyDown={this.sendMessage0}>

                </textarea>
            </div>
            <div id="buttonInput">
                <p>按ctrl+enter发送</p>
                <Button type="primary" onClick={this.sendMessage}>
                发送 
                </Button>
            </div>
        </div>;
    }
}
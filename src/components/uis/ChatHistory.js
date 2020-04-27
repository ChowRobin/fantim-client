import React from 'react';
import renderHTML from "react-render-html";
import '../../css/chatcore.css';
import userHeader from '../../img/user-header.png';
import consultantHeader from '../../img/consultant-header.png';
import timestampToTime from '../../utils/date'
import { Button, Input, List, Modal, Avatar } from 'antd';
import {UserOutlined } from '@ant-design/icons';
import { fetchUser } from '../../utils/Friend';
import {generalFetch, openNotification} from '../../utils/Utils' 
import {msgApi} from '../../utils/GlobalConfig'
import store from '../../utils/Store';
import {searchMsg} from '../../utils/Message'

const {Search} = Input
const {domain, action} = msgApi;

export default class ChatHistory extends React.Component {
    constructor(props) {
        super(props);
        this.areaRef = React.createRef();
        this.scrollRef = React.createRef();

        this.pullOldMsg = this.pullOldMsg.bind(this)

        this.state = {
            searchVisble: false,
            hasMore: true,
            searchKey: '',
        }

    }

    pullOldMsg(curConversation) {
        let msgList = curConversation.messages
        let msgId = '-1'
        if (msgList != undefined && msgList.length > 0) {
            msgId = msgList[0].msg_id_str
        }
        generalFetch(
            domain+action.pull,
            {msg_id_str: msgId, conversation_id:curConversation.conversationId, inbox_type: 1, count: 10},
            (result) => {
               if (result.status_code == 0){
                   if (result.message_list != undefined && result.message_list.length > 0) {
                    store.dispatch({type: 'OLD', payload: {msgList: result.message_list}})
                   } else {
                       this.setState({hasMore: false})
                   }
                } else {
                   openNotification('拉取历史失败', '请稍后重试')
                }
                
            }
        )
    }


    render() {
        //注意：在数组中使用Spread syntax（扩展语法）注意要判 `null | undefined`
        //参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Only_for_iterables
        const {myHeader=userHeader, itsHeader=consultantHeader, contentHeight, textInputHeight, historyVisible=historyVisible, setHistoryVisible=setHistoryVisible, 
            searchMsgList, curConversation, userInfos, groups} = this.props;

        let msgList = []
        let curConvType = 0
        let curUserId 
        let curGroupId, curGroup
        let headerName
        let groupMemberData = []
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
                curGroup = groups[curGroupId]
                headerName = groups[curGroupId].name
            }

        }

        const doSearchMsg = (e) => {
            let searchKey = e
            if (searchKey === undefined || searchKey === '') {
                return
            }
            this.state.searchKey = searchKey
            searchMsg(searchKey, curConversation.conversationId, '', 10)
          }


        return (
        <div id="chat-history">
            <Modal
            title="聊天记录"
            visible={historyVisible}
            footer={[]}
            closable={false}
            onCancel={()=>{
                setHistoryVisible(false)
                this.setState({hasMore:true})
            }}
            width = {640}
            >
            <Search
            placeholder="请输入关键词"
            onSearch={doSearchMsg}
            onClick={()=>this.setState({searchVisble:true})}
            style={{ width: 550 }}/>
            {this.state.searchVisble&&<div>
                <List
                itemLayout="horizontal"
                dataSource={searchMsgList}
                size="small"
                renderItem={item => (
                    <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar><UserOutlined /></Avatar>}
                        title={userInfos[item.sender].nickname}
                        description={renderHTML(item.content)}
                    />
                    <div>{timestampToTime(item.create_time)}</div>
                    </List.Item>
                )}
                />
                <Button onClick={()=>this.setState({searchVisble:false})} type="link">返回</Button>
            </div>
            }

            {!this.state.searchVisble&&<div id="content" ref={this.scrollRef} >
                {
                    this.state.hasMore &&<Button type="link" width={200} onClick={() => this.pullOldMsg(curConversation)}>
                        加载更多
                    </Button>
                }
                <div id="content-internal">
                    {
                        curConvType == 0 && msgList != undefined && msgList.map(({ myself, content, msg_id_str, create_time }, index) => (
                            <div className={myself?'my':'its'} key={msg_id_str}>
                                <span>{timestampToTime(create_time)}</span>
                                <div className="info">{content}</div>
                                <img alt='' src={myself?myHeader:itsHeader}/>
                            </div>
                        ))

                    }
                    {
                        curConvType == 1 && msgList != undefined && msgList.map(({ myself, sender, msg_id_str, content, create_time }, index) => (
                            <div className={myself?'my':'its-g'} key={ msg_id_str}>
                                <span>{!myself?userInfos[sender]!=undefined?userInfos[sender].nickname:'陌生人':''}</span>
                                <div className="info">{content}</div>
                                <img alt='' src={myself?myHeader:itsHeader}/>
                                {/* <span>{timestampToTime(create_time)}</span> */}
                            </div>
                        )) 
                    }
                </div>
            </div>
            }
            </Modal>
        </div>
        );
    }
}
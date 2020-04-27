import { connect } from 'react-redux';
import buildStomp from '../../utils/BuildStomp';
import { trackEmit, trackReceive } from '../../utils/Reducers';
import { chat, quickReply } from '../../utils/GlobalConfig';
import { generalFetch } from '../../utils/Utils';
import store from '../../utils/Store'


/**
 * 创建容器组件
 * @param {String} id 用作用户认证的user-name
 * @param {React.Component} uiComponent UI组件
 */
const buildContainer = (id, uiComponent) => {

    let wsuri = "ws://127.0.0.1:8080/websocket/create/";
    let sock = new WebSocket(wsuri);
    let userId = parseInt(window.localStorage.getItem("userId"))
    sock.onopen = function() {
        console.log("connected to " + wsuri);
        // 初始化消息
        
        let msg = JSON.stringify({push_type:0, body:{sender: userId}})
        sock.send(msg)
     
    };
    sock.onclose = function(e) {
        console.log("connection closed (" + e.code + ")");
    };
    sock.onmessage = function(e) {
        console.log("message received: " + e.data);
        let jsonObj = JSON.parse(e.data)
        if (jsonObj.body == null) {
            console.log("jsonObj.body is null. jsonObj=", jsonObj)
            return
        }
        let msgBody = jsonObj.body
        let content = msgBody.content
        let sender = msgBody.sender
        let conversationId = msgBody.conversation_id
        let userId = parseInt(window.localStorage.getItem("userId"))
        if (userId == sender) {
            store.dispatch({type: 'SEND', payload: trackEmit(content, conversationId)})
        } else {
            store.dispatch({type: 'RECEIVE', payload: trackReceive(content, conversationId)})
        }
        store.dispatch({type: 'NEW', payload: {index: jsonObj.index, msgList: [msgBody]}})
    }

    const mapStateToProps = (state) => ({
        toId: state.toId,
        conversations: state.conversations,
        friends: state.friends,
        userInfos: state.userInfos,
        myApplys: state.myApplys,
        otherApplys: state.otherApplys,
        groups: state.groups,
        searchGroups: state.searchGroups,
        searchMsgList: state.searchMsgList,
    });
    //dispatch to props
    const mapDispatchToProps = (dispatch) => ({
        sendMessage: (payload, toId) => {
            // stomp.stompClient.send('/consultant/private', JSON.stringify({ payload }), { toId });
            let userId = parseInt(window.localStorage.getItem("userId"))
            if (toId == 0 || toId == "") {
               toId = "0:1234:5678" 
            }
            let msg = JSON.stringify({push_type:1, body:{content: payload.content, msg_type: 1, 
                conversation_type: payload.conversationType, conversation_id: toId, sender: userId}})
            sock.send(msg)
        },
    });
  

    return connect(mapStateToProps, mapDispatchToProps)(uiComponent);
};

export default buildContainer;
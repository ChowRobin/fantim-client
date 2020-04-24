import store from './Store';
import timestampToTime from './date'
import {generalFetch} from './Utils' 
import {globalState, msgApi, friendApi} from './GlobalConfig'

const {domain, action} = msgApi;

export const handleNewMsg = (oldConversations, index, msgList) => {
  let cursor = parseInt(window.localStorage.getItem("cursor"))
  let userId = window.localStorage.getItem("userId")
  let conversations = {...oldConversations}

  // console.log("msg_list=", msgList)
  
  msgList.map(function(item ,index, arr) { 
    let curConversationId = item.conversation_id
    let curConversationType = item.conversation_type
    if (conversations[curConversationId] == undefined) {
      if (curConversationType == undefined) {
        curConversationType = 0
      }
      conversations[curConversationId] = {
        conversationId: curConversationId,
        conversationType: curConversationType,
        messages: []
      }
    }
  
    item.myself = item.sender == userId
    // 处理otherUserId
    if (conversations[curConversationId].otherUserId == undefined) {
      if (!item.myself) {
        conversations[curConversationId].otherUserId = item.sender
      } else if (item.receiver != undefined) {
        conversations[curConversationId].otherUserId = item.receiver
      }
    }
    conversations[curConversationId].lastTime = timestampToTime(item.create_time)
    if (conversations[curConversationId].messages == undefined) {
      conversations[curConversationId].messages = []
    }
    conversations[curConversationId].messages.push(item)
  })
  // console.log("new conversation=", conversations)
  
  return conversations
};


export const pullAllMsg = (userId) => {
     
  generalFetch(
    domain+action.pull,
    {inbox_type: 0, cursor: -1, count: -1},
    (result) => {
        // console.log("pullAllMsg=", result.message_list)
       if (result.status_code === 0){
        let allMsg  = result.message_list
        if (allMsg != undefined && allMsg.length > 0) {
          // console.log("dispatch=", allMsg) 
          store.dispatch({type: 'NEW', payload: {index: allMsg.length-1, msgList: allMsg}})
        }
        // 选中最新的会话
        let topTime = 0
        let topConvId
        if (allMsg == undefined) {
          return
        }
        allMsg.map(function(item ,index, arr) {
          if (item.create_time > topTime) {
            topTime = item.create_time
            topConvId = item.conversation_id
          }
        })
        store.dispatch({type: 'SELECT', payload: {selectConvId: topConvId}})
       } else {
          alert('历史消息拉取失败')
       }
    },
  ); 

}

export const fillFriendToConversation = (friends, oldConversations) => {
  // console.log('fillFriendToConversation friends=', friends)
  if (friends == undefined) {
    return oldConversations
  }
  let convMap = {...oldConversations} 
  for (let convId in convMap) {
    let conv = convMap[convId]
    if (conv.otherUserId != undefined) {
      let userInfo = friends[conv.otherUserId]
      if (userInfo != undefined) {
        conv.otherNickname = userInfo.nickname
        conv.Avatar = userInfo.avatar
      } else {
        conv.otherNickname = '陌生人'
      }
    }
    convMap[convId] = conv
  }
  return convMap
}

export const genConversationId = (uid1, uid2) => {
  if (uid1 < uid2) {
    return '0:' + uid1 + ':' + uid2
  } else {
    return '0:' + uid2 + ':' + uid1
  }
}

export const handleSelectConv = (convId, friendId, oldConversations) => {
  if (oldConversations[convId] != undefined && oldConversations[convId] != null) {
    return oldConversations 
  } else {
    let convs = {...oldConversations}
    // 没有选中的会话，创建
    let conv = {
      conversationId: convId,
      conversationType: 0, 
      otherUserId: friendId
    }
    convs[convId] = conv
    return convs
  }
}
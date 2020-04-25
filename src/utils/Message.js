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
    if (curConversationType == 1 && conversations[curConversationId].groupId == undefined) {
      // 群聊
      let convIdArr = curConversationId.split(':')
      if (convIdArr.length > 1) {
        conversations[curConversationId].groupId = convIdArr[1]
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
    // 私聊
    if (conv.conversationType == undefined || conv.conversationType == 0) {
      if (conv.otherUserId != undefined) {
        let userInfo = friends[conv.otherUserId]
        if (userInfo != undefined) {
          conv.otherNickname = userInfo.nickname
          conv.Avatar = userInfo.avatar
        } else {
          conv.otherNickname = '陌生人'
        }
      }
    } else if (conv.conversationType == 1) { // 群聊
      // conv.otherNickname = '群聊'
    }
    convMap[convId] = conv
  }
  return convMap
}


export const fillGroupToConversation = (groups, oldConversations) => {
  if (groups == undefined) {
    return oldConversations
  }
  let convMap = {...oldConversations} 
  for (let convId in convMap) {
    let conv = convMap[convId]
    if (conv.conversationType == 1) { // 群聊
      if (conv.otherUserId != undefined) {
        let groupInfo = groups[conv.groupId]
        if (groupInfo != undefined) {
          conv.otherNickname = groupInfo.name
          conv.Avatar = groupInfo.avatar
        } else {
          conv.otherNickname = '群聊'
        }
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

export const handleSelectConv = (convId, friendId, oldConversations, userInfos) => {
  if (oldConversations[convId] != undefined && oldConversations[convId] != null) {
    return oldConversations 
  } else {
    let convs = {...oldConversations}
    let nickname = '好友'
    if (userInfos != undefined && userInfos[friendId] != undefined) {
      nickname = userInfos[friendId].nickname 
    }
    // 没有选中的会话，创建
    let conv = {
      conversationId: convId,
      conversationType: 0, 
      otherUserId: friendId,
      otherNickname: nickname,
      lastTime: timestampToTime(Date.parse(new Date())/1000)
    }
    convs[convId] = conv
    return convs
  }
}

export const handleSelectGroupConv = (groupId, oldConversations) => {
  let convId = '1:' + groupId
  if (oldConversations[convId] != undefined && oldConversations[convId] != null) {
    return oldConversations 
  } else {
    let convs = {...oldConversations}
    // 没有选中的会话，创建
    let conv = {
      conversationId: convId,
      conversationType: 1, 
      groupId: groupId,
      lastTime: timestampToTime(Date.parse(new Date())/1000)
    }
    convs[convId] = conv
    return convs
  }
}
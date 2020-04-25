import { combineReducers } from 'redux';
import {handleNewMsg, fillFriendToConversation, fillGroupToConversation, handleSelectConv, handleSelectGroupConv} from './Message'
import {addUser} from './Friend'
import { searchGroup } from './Group';

/**
 * 为发出的内容增加时间戳标记
 * @param {String} payload 内容
 * @param {String} toId 发送目标
 */
export const trackEmit = (payload,toId) => ({payload,toId,date:new Date().toLocaleString()});

/**
 * 把接收到的Message.body（转成对象后）解析处理并增加时间戳标记
 * @param {Object} param0 Message.body（转成对象后）
 */
export const trackReceive = (payload,fromId) =>({payload,fromId,date:new Date().toLocaleString()});


/**
 * 这里使用`计算属性名称`来初始化对象。
 * 可参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
 */
const conversations = {
  // ['conversation_id']: {conversationId, conversationType, messages, lastTime}
}

const userInfos = {
  // ['user_id']: {nickname, avatar}
}

const myApplys = {
  /// [apply_type]: {page, pageSize, [applys]}
}

const otherApplys = {
  /// [apply_type]: {page, pageSize, [applys]}
}

const groups = {
  /// [group_id_str]: {group}
}

const searchGroups = [
  /// [groups]
]

export const init_state = {
    toId: '',//会话对象
    conversations,
    friends: {}, //好友列表
    userInfos, // 用户信息集合
    myApplys,
    otherApplys,
    groups, 
    searchGroups, 
};

/**
 * 虽然 combineReducers 自动帮你检查 reducer 是否符合以上规则，但你也应该牢记，
 * 并尽量遵守。即使你通过 Redux.createStore(combineReducers(...), initialState)
 * 指定初始 state，combineReducers 也会尝试通过传递 undefined 的 state 来检测你的
 * reducer 是否符合规则。因此，即使你在代码中不打算实际接收值为 undefined 的 state，
 * 也必须保证你的 reducer 在接收到 undefined 时能够正常工作。
 * 
 * 详情可见：https://www.redux.org.cn/docs/api/combineReducers.html
 */
const allReducers = {
    toId(old = '',{type,payload}){
      switch (type) {
        case 'SELECT':
         return payload.selectConvId
         case 'SELECT_GROUP':
          return '1:' + payload.groupId
      }
      return old;
    },
    conversations(olds=conversations, {type, payload={}}) {
      const {index, msgList, friends, selectConvId, friendId, groupId} = payload
      switch (type) {
        case 'NEW':
          let newConv = handleNewMsg(olds, index, msgList) 
          return newConv
        case 'FRIENDS':
          return fillFriendToConversation(friends, olds)
        case 'GROUPS':
          return fillGroupToConversation(friends, olds)
        case 'SELECT':
          return handleSelectConv(selectConvId, friendId, olds, userInfos)
        case 'SELECT_GROUP':
          return handleSelectGroupConv(groupId, olds)
      }
      return olds
    },
    friends(old = {}, {type, payload={}}){
      const {friends} = payload
      if(type === 'FRIENDS')
        return friends;
      return old
    },
    userInfos(old = userInfos, {type, payload={}}){
      const {friends, users} = payload
      switch(type) {
        case 'FRIENDS':
          return {...old, ...friends}
        case 'ADD_USER':
          return addUser(old, users)
      }
      return old
    },
    myApplys(old = myApplys, {type, payload={}}){
      const {applyType, applys, page, pageSize} = payload
      switch(type) {
        case 'MY_APPLY':
          let newApplyMap = {...old}
          let newApply = {
             applys: applys,
             page: page,
             pageSize: pageSize
          }
          newApplyMap[applyType] = newApply
          return newApplyMap
      }
      return old
    },
    otherApplys(old = otherApplys, {type, payload={}}){
      const {applyType, applys, page, pageSize} = payload
      switch(type) {
        case 'OTHER_APPLY':
          let newApplyMap = {...old}
          let newApply = {
             applys: applys,
             page: page,
             pageSize: pageSize
          }
          newApplyMap[applyType] = newApply
          return newApplyMap
      } 
      return old
    },
    groups(old = groups, {type, payload={}}){
      const {groups, searchGroups} = payload
      if(type === 'GROUPS')
        return groups;
      return old 
    },
    searchGroups(old = searchGroups, {type, payload={}}) {
      const {groups, searchGroups} = payload
      if (type === 'SEARCH_GROUP') {
        return searchGroups!=undefined?searchGroups:null
      }
      return old
    }
};

const reducers = combineReducers(allReducers);

export default reducers;

import store from './Store';
import {generalFetch, httpGet, openNotification} from './Utils' 
import {globalState, friendApi, userApi} from './GlobalConfig'

const {domain, action} = friendApi;


export const fetchFriendList = (userId) => {

    httpGet(
        domain+action.list,
        (result) => {
           if (result.status_code === 0){
            let friendsMap = {}
            if (result !== undefined && result.friends !== undefined) {
                result.friends.map(function(item, index, arr) { 
                    friendsMap[item.user_id] = item
                })
                store.dispatch({type: 'FRIENDS', payload: {friends: friendsMap}})
            }
           } else {
               openNotification('好友列表拉取失败', '请刷新重试')
           }
        },
      ); 
}

export const fetchUser = (userId) => {
    httpGet(
        domain+userApi.action.info,
        (result) => {
           if (result.status_code === 0){
            // console.log('fetchUser result=', result)
            if (result !== undefined && result.user_info !== undefined) {
                store.dispatch({type: 'ADD_USER', payload: {users: [result.user_info]}})
            }
           } else {
              openNotification('用户不存在', '请重新查询')
           }
        },
        {user_id:userId}
      ); 
}

export const addUser = (oldUserInfos, newUsers) => {
    let userInfos = {...oldUserInfos}
    newUsers.map(function(item ,index, arr) {
        userInfos[item.user_id] = item
    })
    return userInfos
}

export const fetchFriendApply = (isMy, page, pageSize) => {
    let userId = parseInt(window.localStorage.getItem("userId"))
    let fromUserId = 0
    if (isMy) {
        fromUserId = userId
    }
    httpGet(
        domain+action.applyList,
        (result) => {
           if (result.status_code === 0){
            let friendsMap = {}
            if (result !== undefined && result.apply_list !== undefined) {
                if (isMy) {
                    store.dispatch({type: 'MY_APPLY', payload: {applyType:1, page:page, pageSize:pageSize, applys:result.apply_list}})
                } else {
                    store.dispatch({type: 'OTHER_APPLY', payload: {applyType:1, page:page, pageSize:pageSize, applys:result.apply_list}})
                }
            }
           } else {
               openNotification('好友申请拉取失败', '请刷新重试')
           }
        },
        {
            apply_type: 1,
            page: page,
            page_size: pageSize,
            from_user_id: fromUserId
        }
      ); 
}

export const createFriendApply = (userId) => {
    generalFetch(
        domain+action.apply,
        {to_user_id: userId, apply_type:1},
        (result) => {
           if (result.status_code == 0){
               openNotification('申请成功', '请等待对方通过')
            } else {
               openNotification('申请失败', '无法添加对方为好友')
            }
            
        }
    )
}

export const updateFriendApply = (applyId, status) => {
    let loginUserId = parseInt(window.localStorage.getItem("userId"))
    generalFetch(
        domain+action.applyUpdate,
        {apply_id: applyId, status: status},
        (result) => {
           if (result.status_code == 0){
               switch (status) {
                   case 1:
                    openNotification('申请通过', '您与对方已成为好友')
                    // 刷新好友列表
                    fetchFriendList(loginUserId)
                    break
                   case 2: 
                    openNotification('拒绝成功', '已拒绝好友申请')
                    break
                   case 3:
                    openNotification('取消成功', '好友申请已取消')
                    break
               }
            } else {
               openNotification('操作失败', '请稍后重试')
            }
            
        }
    )
}
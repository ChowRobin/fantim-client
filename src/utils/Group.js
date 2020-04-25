import store from './Store';
import {generalFetch, httpGet, openNotification} from './Utils' 
import {globalState, groupApi, userApi} from './GlobalConfig'

const {domain, action} = groupApi;

export const fetchGroups = (userId) => {

    httpGet(
        domain+action.list,
        (result) => {
           if (result.status_code === 0){
            let groupMap = {}
            if (result !== undefined && result.groups !== undefined) {
                result.groups.map(function(item, index, arr) {
                    groupMap[item.group_id_str] = item
                })
                store.dispatch({type: 'GROUPS', payload: {groups: groupMap}})
            }
           } else {
               openNotification('群聊拉取失败', '请刷新重试')
           }
        },
      ); 
}

export const fetchGroupMembers = (groupId) => {

    httpGet(
        domain+action.memberList,
        (result) => {
           if (result.status_code === 0){
            let groupMap = {}
            if (result !== undefined && result.members !== undefined) {
                store.dispatch({type: 'GROUP_MEMBER', payload: {groupId: groupId, groupMembers: result.members}})
            }
           } else {
               openNotification('群成员拉取失败', '请刷新重试')
           }
        },
        {group_id: groupId}
      ); 
}

export const searchGroup = (name, page, pageSize, searchResult) => {
    httpGet(
        domain+action.search,
        (result) => {
           let groups 
           if (result.status_code === 0){
            if (result !== undefined && result.groups !== undefined) {
                searchResult = result.groups
                for (let i=0, len=result.groups.length; i<len; i++) {
                    if (result.groups[i].user_role==undefined) {
                        result.groups[i].user_role = 0
                    }
                }
                groups = result.groups
            }
           } else {
              openNotification('群名称不存在', '请重新查询')
           }
           store.dispatch({type: 'SEARCH_GROUP', payload: {searchGroups: result.groups}})
        },
        {name:name, page:page, page_size:pageSize}
      ); 
}


export const fetchGroupApply = (isMy, page, pageSize) => {
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
                    store.dispatch({type: 'MY_APPLY', payload: {applyType:2, page:page, pageSize:pageSize, applys:result.apply_list}})
                } else {
                    store.dispatch({type: 'OTHER_APPLY', payload: {applyType:2, page:page, pageSize:pageSize, applys:result.apply_list}})
                }
            }
           } else {
               openNotification('入群申请拉取失败', '请刷新重试')
           }
        },
        {
            apply_type: 2,
            page: page,
            page_size: pageSize,
            from_user_id: fromUserId
        }
      ); 
}

export const createGroupApply = (groupId) => {
    generalFetch(
        domain+action.apply,
        {group_id_str: groupId, apply_type:2},
        (result) => {
           if (result.status_code == 0){
               openNotification('申请成功', '请等待群主通过')
            } else {
               openNotification('申请失败', '暂时无法加入群聊')
            }
            
        }
    )
}

export const updateGroupApply = (applyId, status) => {
    let loginUserId = parseInt(window.localStorage.getItem("userId"))
    generalFetch(
        domain+action.applyUpdate,
        {apply_id: applyId, status: status},
        (result) => {
           if (result.status_code == 0){
               switch (status) {
                   case 1:
                    openNotification('申请通过', '对方已加入群聊')
                    // 刷新群聊列表
                    fetchGroups(loginUserId)
                    fetchGroupApply(true, 1, 10)
                    break
                   case 2: 
                    openNotification('拒绝成功', '已拒绝入群申请')
                    fetchGroupApply(false, 1, 10)
                    break
                   case 3:
                    openNotification('取消成功', '入群申请已取消')
                    fetchGroupApply(true, 1, 10)
                    break
               }
            } else {
               openNotification('操作失败', '请稍后重试')
            }
            
        }
    )
}
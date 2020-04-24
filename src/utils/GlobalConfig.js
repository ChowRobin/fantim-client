/**
 * 简单的全局状态持有对象，通过它可以实现：组件的异步加载、单例加载、验权
 */
export const  globalState = {
    Component:null,
    isLogin:false
}
/**
 * 消息长链
 * @param {String} domain <域名 | IP地址>[端口][根路径]。
 * @param {Object} action 是一个普通对象，其中key是有意义的变量名，value是action地址。
 */
export const chat = {
    domain: 'ws://localhost:8080',
    action: {
        endPoint: '/websocket/create/'
    }
};

/**
 * 消息短链
 */
export const msgApi = {
    domain: 'http://localhost:8080',
    action: {
        pull: '/message/pull/'
    } 
}

/**
 * 好友api
 */
export const friendApi = {
    domain: 'http://localhost:8080',
    action: {
        list: '/relation/friend/list/',
        apply: '/relation/apply/create/',
        applyList: '/relation/apply/list/',
        applyUpdate: '/relation/apply/update/'
    } 
}

export const userApi = {
    domain: 'http://localhost:8080',
    action: {
        info: '/user/info/',
        signUp: '/user/sign/up/'
    } 
}

/**
 * 文件上传
 * @param {String} domain <域名 | IP地址>[端口][根路径]。
 * @param {Object} action 是一个普通对象，其中key是有意义的变量名，value是action地址。
 */
export const fileUpload = {
    domain: 'http://192.168.1.70',
    action: {
        upload: '/upload'
    }
};
/**
 * 
 * @param {String} domain <域名 | IP地址>[端口][根路径]。
 * @param {Object} action 是一个普通对象，其中key是有意义的变量名，value是action地址。
 */
export const loginConf = {
    domain: 'http://localhost:8080',
    action: {
        toLogin: '/user/login/'
    }
};

export const quickReply= {
    domain: 'http://127.0.0.1:8080',
    action: {
        get: '/get_quick_replies',
        add: '/add_quick_reply',
        del: '/del_quick_reply',
        toLogin: '/user/login'
    }
};

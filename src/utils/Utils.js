import { notification} from 'antd';

/**
 * fetch API 的一般使用方式
 * @param {String} url  请求url
 * @param {Object} json 
 * @param {Function} onfulfilled 响应成功的回调函数
 * @param {String} method 请求method类型，默认`post`
 * @param {Function} onrejected  响应失败的回调函数，默认打印错误日志
 */
export const generalFetch = (url, json, onfulfilled, method = 'post', uid, onrejected = (error)=>console.error(error) ) => {
    fetch(url, {
        method,
        body: JSON.stringify(json),
        credentials: 'include',
    }).then((response) => {
        // console.log("gereralFetch response=", response)
        if (response.ok)
            return response.json();
        throw new Error(`Request is failed, status is ${response.status}`);
    }).then(
        onfulfilled,
        onrejected
    );
}

export const httpGet = (url, onfulfilled, query, onrejected = (error)=>console.error(error) ) => {
    if (query != undefined) {
        url += '?'
        for (let k in query) {
            url += k + '=' + query[k] + '&'
        }
    }
    let method = 'get'
    fetch(url, {
       method,
       credentials: 'include',
    }).then((response) => {
        if (response.ok)
            return response.json();
        throw new Error(`Request is failed, status is ${response.status}`);
    }).then(
        onfulfilled,
        onrejected
    );
}


export const openNotification = (msg, description) => {
    notification.open({
      message: msg,
      description: description,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
 };

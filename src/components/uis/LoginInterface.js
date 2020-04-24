import React from 'react';
import '../../css/login-interface.css';
import chairs from '../../img/chairs.png';
import chat from '../../img/fantbird.png';
import blueLogo from '../../img/blue_logo.png';
import {globalState,loginConf} from '../../utils/GlobalConfig';
import {generalFetch, generalFetchWithFullReponse} from '../../utils/Utils';
import store from '../../utils/Store';
import SighUp from './SignUp'

const {domain,action} = loginConf;

export default (props) => {

    const managerIdRef = React.createRef();
    const passWordRef = React.createRef();
    
    function toLogin(){
       const managerId = managerIdRef.current.value;
       const passWord = passWordRef.current.value;
       
       if(managerId.trim() === '' || passWord.trim() === ''){
           alert('账户或密码为空');
           return;
       }

       const userId = parseInt(managerId)
      
       generalFetch(
          domain+action.toLogin,
          {user_id: userId, password: passWord},
          (result) => {
             if (result.status_code === 0){
                 window.localStorage.setItem('serverId', managerId);
                 window.localStorage.setItem('userId', userId);
                 globalState.isLogin = true;
                store.dispatch({type: 'ADD_USER', payload: {users: [result.user_info]}})
                 props.history.push('/server');
             } else {
                alert('密码错误')
             }
          }
       );


      
    }

    return (<div id="login_interface_main">
            <div id="login_interface_left">
                <img alt="chairs" src={chairs} />
            </div>
            <div id="login_interface_right">
                <img alt="Logo" src={blueLogo} />
                <div id="login_interface_right_form">
                    <div id="right_form_top">
                        <h1>饭聊</h1>
                        <span className="welcome_to_login">你的朋友都在等你</span>
                    </div>
                    <div id="right_form_bottom">
                        <input ref={managerIdRef} type="text" />
                        <input ref={passWordRef} type="password" />
                        <button onClick={toLogin}>登陆</button>
                        {/* <span>没有账号？注册一下</span> */}
                        <SighUp></SighUp>
                    </div>
                </div>
            </div>
    </div>);
    
}
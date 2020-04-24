import React from 'react';
import '../../css/visitor-interface.css';
import logo from '../../img/logo.png';
import close from '../../img/close.png';
import minus from '../../img/minus.png';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';
import ChatCore from './ChatCore';

export default (props) => {
    const { messages: { [props.toId]: currentMessages=[], sys: sysMessages=[]}, ...otherProps} = props;
    const toId = props.toId?props.toId:'kuaiban';
    
    return (<Draggable handle=".handle">
    <div id="box">
        <div id="header" className="handle">
            <div id="header-left">
                <img src={logo} alt="Logo"/>
                <p>在线客服</p>
            </div>
            <div id="header-right">
                <Link to="/"><img src={minus} alt="最小化"/></Link>
                <Link to="/"><img src={close} alt="关闭"/></Link>
            </div>
        </div>
        <div id="bottom">
            <div id="left"><ChatCore {...{messages:[...currentMessages,...sysMessages], ...otherProps, toId}} /></div>
            <div id="right">
                <p id="article-title">关于</p>
                <p id="article"></p>
            </div>
        </div>
    </div>
</Draggable>);
}
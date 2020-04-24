import React from 'react';
import { Provider } from 'react-redux';
import buildContainer from '../components/containers/buildContainer';
import ServerInterface from './uis/ServerInterface';
import LoginInterface from './uis/LoginInterface';
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom';
import {globalState} from "../utils/GlobalConfig";


const ChatApp = (props) => (
    <Provider {...props}>
        <HashRouter>
            <Switch>
                <Route exact path="/" component={LoginInterface}/>
                <Route path="/server" render={({history}) => {
                    let uid = parseInt(window.localStorage.getItem("userId"))
                    if(uid != undefined){
                        if(globalState.Component)
                         return <globalState.Component />;
                        const id = window.localStorage.getItem('serverId');
                        if(id){
                            globalState.Component = buildContainer(id, ServerInterface);
                            return <globalState.Component />;
                        }
                        console.error('serverId 不存在');
                    }
                    history.push('/');
                    return null;
                }}/>
                <Redirect to="/" from="*" />
            </Switch>
        </HashRouter>
    </Provider>
);

export default ChatApp;

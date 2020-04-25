import React from 'react';
import '../../css/chatcore.css';
import store from '../../utils/Store';
import {genConversationId} from '../../utils/Message'
import '../../css/app.css';
import {Modal, Button, List, Avatar} from 'antd';
import { TeamOutlined, UserAddOutlined } from '@ant-design/icons';

export default class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.areaRef = React.createRef();

        this.displayChoose = this.displayChoose.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClickGroup = this.handleClickGroup.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseOut = this.handleMouseOut.bind(this)
        this.state =  {
            ModalText: '搜索',
            visible: false,
            confirmLoading: false,
        };

    }


    displayInput(e) {
        const { children } = e.currentTarget;
        e.currentTarget.style.backgroundColor = '#fff';
        children[0].style.display = 'none';
        children[1].style.display = 'none';
        children[2].style.display = 'flex';
    }

    displayChoose(e) {
        let groupId = e.currentTarget.getAttribute('id');
        store.dispatch({type: 'SELECT_GROUP', payload: {groupId: groupId}})
    }

    displayContextMenu(e) {
        e.preventDefault();
    }

    hideContextMenu(e) {
        var menu = e.currentTarget.children[2];
        menu.style.display = "none";
    }

    openAddFriend() {
        console.log('openAddFriend call')
        this.setState({
            visible: true,
        });
    };

    handleOk () {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
            visible: false,
            confirmLoading: false,
            });
        }, 2000);
    };

    handleCancel () {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    handleClickGroup(e) {

    }

    handleMouseOver(e) {
        e.currentTarget.style.backgroundColor = '#f3f3f3'
    }

    handleMouseOut(e) {
        e.currentTarget.style.backgroundColor = ''
    }

    render() {
        //注意：在数组中使用Spread syntax（扩展语法）注意要判 `null | undefined`
        //参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Only_for_iterables
        const { groups } = this.props;
        const { visible, confirmLoading, ModalText } = this.state;

        let groupList = Object.values(groups)

        return <div >
            {
                JSON.stringify(groupList) !== '{}' && groupList.map(({group_id_str, name})=>(
                    <div className="body_center_first" key={group_id_str} id={group_id_str}
                        onClick={this.displayChoose}
                        onContextMenu={this.displayContextMenu}
                        >
                        <div className="body_center_first_header">
                            <Avatar ><TeamOutlined /></Avatar>
                        </div>
                            <div className="body_center_first_body">
                            <div className="body_top">
                                <div>{name}</div>
                            </div>
                        </div>
                    </div>
                ))
                // <List
                //     itemLayout="horizontal"
                //     dataSource={groupList}
                //     renderItem={item => (
                //         <List.Item>
                //             <List.Item.Meta
                //             avatar={<Avatar ><TeamOutlined /></Avatar>}
                //             title={item.name}
                //             description={item.description}
                //             onClick={this.handleClickGroup}
                //             onMouseOver={this.handleMouseUserOver}
                //             style={{}}
                //             />
                //         </List.Item>
                //     )}
                // />
            }
            {/* <Button type="link" onClick={this.openAddFriend} >加好友</Button> */}
            <Modal
                    title=""
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <p>{ModalText}</p>
                </Modal>
                 
        </div>;
    }
}
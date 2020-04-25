import React from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, Modal, Menu, Table, notification } from 'antd';
import { PlusOutlined, MailOutlined, ExclamationCircleOutlined, SearchOutlined  } from '@ant-design/icons';
import {fetchUser, fetchFriendApply, createFriendApply, updateFriendApply} from '../../utils/Friend'
import '../../css/app.css';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;


export default class AddFriend extends React.Component {
    constructor(props) {
        super(props);
        this.showDrawer = this.showDrawer.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.searchUser= this.searchUser.bind(this);
        this.fetchApplyList= this.fetchApplyList.bind(this);
        this.showFriendApplyConfirm = this.showFriendApplyConfirm.bind(this)
        this.showPassApplyConfirm = this.showPassApplyConfirm.bind(this)
        this.showRefuseApplyConfirm = this.showRefuseApplyConfirm.bind(this)

        // this.showfriendApplyModal= this.showfriendApplyModal.bind(this);
        // this.handlefriendApplyOk= this.handlefriendApplyOk.bind(this);
        // this.handlefriendApplyCancel= this.handlefriendApplyCancel.bind(this);

        this.state =  {
            visible: false,
            current: 'searchUser',
            searchUserId: 0,
            friendApplyModalVisible: false,
            friendApplySuccessAlertVisible: false,
            friendApplyFailAlertVisible: false,
        };

    }

  showDrawer () {
    this.setState({
      visible: true,
    });
  };

  onClose () {
    this.setState({
      visible: false,
    });
  };

  handleClickMenu (e){
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  searchUser(e) {
      let searchId = parseInt(e)
      if (searchId == undefined || searchId == 0) {
          return
      }
      this.state.searchUserId = searchId
      fetchUser(searchId)
    }

  fetchApplyList(e) {
      let key = e.key
      let isMy = false
      if (key == 'otherApply') {
          isMy = false
      } else if (key == 'myApply') {
          isMy = true
      }
      fetchFriendApply(isMy, 1, 10)
  }


  showFriendApplyConfirm(userId) {
    confirm({
      title: '好友申请',
      icon: <ExclamationCircleOutlined />,
      content: '确认申请添加对方为好友？',
      type: 'link',
      onOk() {
        createFriendApply(userId)
      },
      onCancel() {
      },
    });
  }

  showRefuseApplyConfirm(applyId) {
    confirm({
      title: '拒绝申请',
      icon: <ExclamationCircleOutlined />,
      content: '确认拒绝对方的好友申请？',
      type: 'link',
      onOk() {
        updateFriendApply(applyId, 2)
      },
      onCancel() {
      },
    });
  }

  showPassApplyConfirm(applyId) {
    confirm({
      title: '通过申请',
      icon: <ExclamationCircleOutlined />,
      content: '确认添加对方为好友？',
      type: 'link',
      onOk() {
        updateFriendApply(applyId, 1)
      },
      onCancel() {
      },
    });
  }
  
  render() {
    const { friends, userInfos, myApplys, otherApplys} = this.props

    // 处理搜索数据
    let searchUserResult = []
    let searchUserById = {}
    if (userInfos != undefined && this.state.searchUserId != 0) {
        let searchUserInfo = userInfos[this.state.searchUserId]
        let friendUserInfo = friends[this.state.searchUserId]
        let userStatus = 0
        if (friendUserInfo != undefined && friendUserInfo != null) {
            userStatus = 1
        }
        if (searchUserInfo != undefined) {
            searchUserById = {
                userId: searchUserInfo.user_id,
                nickname: searchUserInfo.nickname,
                status: userStatus
            }
            searchUserResult.push(searchUserById)
        }
    }

    let myApplyList = [], otherApplyList = []
    // 处理申请列表
    if (myApplys != undefined && myApplys[1] != undefined && myApplys[1].applys) {
        myApplys[1].applys.map(function({apply_id, from_user_id, to_user_id, status}, arr) {
            if (status == undefined) {
                status = 0
            }
            let userId = to_user_id
            let userInfo = userInfos[userId]
            let nickname
            if (userInfo == undefined) {
                fetchUser(userId)
            } else {
                nickname = userInfo.nickname
            }
            let userStatus = '等待同意'
            switch (status) {
                case 1:
                    userStatus = '已同意'
                    break
                case 2:
                    userStatus = '已拒绝'
                    break
                case 3:
                    userStatus = '已取消'
                    break
            }
            myApplyList.push({
                applyId: apply_id,
                userId: userId,
                nickname: nickname,
                status: status,
                userStatus: userStatus
            })
        })
    }
    if (otherApplys != undefined && otherApplys[1] != undefined && otherApplys[1].applys) {
        otherApplys[1].applys.map(function({apply_id, from_user_id, to_user_id, status}, arr) {
            if (status == undefined) {
                status = 0
            }
            let userId = from_user_id
            let userInfo = userInfos[userId]
            let nickname
            if (userInfo == undefined) {
                fetchUser(userId)
            } else {
                nickname = userInfo.nickname
            }
            let userStatus = '等待同意'
            switch (status) {
                case 1:
                    userStatus = '已同意'
                    break
                case 2:
                    userStatus = '已拒绝'
                    break
                case 3:
                    userStatus = '已取消'
                    break
            }
            otherApplyList.push({
                applyId: apply_id,
                userId: userId,
                nickname: nickname,
                status: status,
                userStatus: userStatus
            })
        })
    }


    const otherApplyColumns = [
        {
          title: '用户Id',
          dataIndex: 'userId',
          key: 'userId',
          render: text => <a>{text}</a>,
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record)  => (
              <span>
               {record.userStatus} 
              </span>
          )
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a style={{ marginRight: 16 }} hidden={record.status!=0} onClick={this.showPassApplyConfirm.bind(this, record.applyId)}>同意</a>
              <a style={{ marginRight: 16 }} hidden={record.status!=0} onClick={this.showRefuseApplyConfirm.bind(this, record.applyId)}>拒绝</a>
              <a style={{ marginRight: 16 }} hidden={record.status==0} >删除</a>
            </span>
          ),
        },
    ];

    const myApplyColumns = [
        {
          title: '用户Id',
          dataIndex: 'userId',
          key: 'userId',
          render: text => <a>{text}</a>,
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record)  => (
            <span>
             {record.userStatus} 
            </span>
          )
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a style={{ marginRight: 16 }} hidden={record.status!=0}>取消</a>
              <a style={{ marginRight: 16 }} hidden={record.status!=1}>删除</a>
            </span>
          ),
        },
    ];


    const searchUserColumns = [
        {
          title: '用户Id',
          dataIndex: 'userId',
          key: 'userId',
          render: text => <a>{text}</a>,
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record)  => (
            <span>
             <span hidden={record.status!=0}>陌生人</span>
             <span hidden={record.status!=1}>好友</span>
            </span>
          )
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a style={{ marginRight: 16 }} hidden={record.status!=0} onClick={this.showFriendApplyConfirm.bind(this, record.userId)}>加好友</a>
              <a style={{ marginRight: 16 }} hidden={record.status!=1}>发起聊天</a>
            </span>
          ),
        },
    ];



    return (
      <div>
        <Button type="link" onClick={this.showDrawer}>
          <PlusOutlined /> 加好友
        </Button>
        <Drawer
          title="发现更多好友"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >

        <Menu onClick={this.handleClickMenu} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="searchUser">
          <SearchOutlined />
          搜索用户
        </Menu.Item>
        <Menu.Item key="otherApply" onClick={this.fetchApplyList} >
          <MailOutlined />
          好友申请
        </Menu.Item>
        <Menu.Item key="myApply" onClick={this.fetchApplyList}>
           <MailOutlined />
           我的申请 
        </Menu.Item>
        </Menu>

        {this.state.current=='searchUser' && <div>
          <br />
          <br />  
          <Search
            placeholder="用户id"
            onSearch={this.searchUser}
            style={{ width: 300 }}
          />
          <br />
          <br /> 
           <Table columns={searchUserColumns} dataSource={searchUserResult} />
          <br />
          <br />
        </div>}

        {this.state.current=='otherApply' && <div>
          <br />
          <br />  
          <Table columns={otherApplyColumns} dataSource={otherApplyList} />
          <br />
          <br />
        </div>}

        {this.state.current=='myApply' && <div>
          <br />
          <br />  
          <Table columns={myApplyColumns} dataSource={myApplyList} />
          <br />
          <br />
        </div>}

        </Drawer>
      </div>
    );
  }
}

// ReactDOM.render(<DrawerForm />, mountNode);
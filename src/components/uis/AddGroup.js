import React from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Menu, Table } from 'antd';
import { PlusOutlined, MailOutlined, AppstoreOutlined, SearchOutlined  } from '@ant-design/icons';
import {fetchUser, fetchFriendApply} from '../../utils/Friend'

const { Option } = Select;
const { Search } = Input;

export default class AddGroup extends React.Component {
    constructor(props) {
        super(props);
        this.showDrawer = this.showDrawer.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.searchUser= this.searchUser.bind(this);
        this.fetchApplyList= this.fetchApplyList.bind(this);
        this.state =  {
            visible: false,
            current: 'searchUser',
            searchUserId: 0,
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
    // console.log('click ', e);
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

  render() {
    const { friends, userInfos, myApplys, otherApplys } = this.props

    // 处理搜索数据
    let searchUserResult = []
    let searchUserById = {}
    if (userInfos != undefined && this.state.searchUserId != 0) {
        let searchUserInfo = userInfos[this.state.searchUserId]
        let friendUserInfo = friends[this.state.searchUserId]
        let userStatus = '陌生人'
        if (friendUserInfo != undefined && friendUserInfo != null) {
            userStatus = '好友'
        }
        if (searchUserInfo != undefined) {
            searchUserById = {
                userId: searchUserInfo.user_id,
                nickname: searchUserInfo.nickname,
                status: userStatus
            }
            // console.log('search_user=', searchUserById)
            searchUserResult.push(searchUserById)
        }
    }

    let myApplyList = [], otherApplyList = []
    // 处理申请列表
    if (myApplys != undefined && myApplys[1] != undefined && myApplys[1].applys) {
        myApplys[1].applys.map(function({from_user_id, to_user_id, status}, arr) {
            let userId = to_user_id
            let userInfo = userInfos[userId]
            let nickname
            if (userInfo != undefined) {
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
                userId: userId,
                nickname: nickname,
                status: userStatus,
            })
        })
    }
    if (otherApplys != undefined && otherApplys[1] != undefined && otherApplys[1].applys) {
        otherApplys[1].applys.map(function({from_user_id, to_user_id, status}, arr) {
            let userId = from_user_id
            let userInfo = userInfos[userId]
            let nickname
            if (userInfo != undefined) {
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
                userId: userId,
                nickname: nickname,
                status: userStatus,
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
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a style={{ marginRight: 16 }}>同意</a>
              <a>拒绝</a>
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
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>取消</a>
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
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>申请好友</a>
            </span>
          ),
        },
    ];

    return (
      <div>
        <Button type="link" onClick={this.showDrawer}>
          <PlusOutlined /> 加群
        </Button>
        <Drawer
          title="加入更多群聊"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >

        <Menu onClick={this.handleClickMenu} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="searchUser">
          <SearchOutlined />
          搜索群聊
        </Menu.Item>
        <Menu.Item key="otherApply" onClick={this.fetchApplyList} >
          <MailOutlined />
          用户申请
        </Menu.Item>
        <Menu.Item key="myApply" onClick={this.fetchApplyList}>
           <MailOutlined />
           我的申请 
        </Menu.Item>
        <Menu.Item key="createGroup" onClick={this.fetchApplyList}>
           <PlusOutlined />
           创建群聊 
        </Menu.Item>
        </Menu>

        {this.state.current=='searchUser' && <div>
          <br />
          <br />  
          <Search
            placeholder="用户id"
            onSearch={this.searchUser}
            style={{ width: 400 }}
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
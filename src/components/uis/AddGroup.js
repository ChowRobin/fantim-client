import React from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, Modal, Menu, Table, Transfer } from 'antd';
import { PlusOutlined, MailOutlined, ExclamationCircleOutlined, SearchOutlined  } from '@ant-design/icons';
import {searchGroup, fetchGroupApply, createGroupApply, updateGroupApply} from '../../utils/Group'
import {generalFetch, httpGet, openNotification} from '../../utils/Utils' 
import { fetchUser } from '../../utils/Friend'
import {groupApi} from '../../utils/GlobalConfig'

const { confirm } = Modal
const { Option } = Select;
const { Search } = Input;

const {domain, action} = groupApi;

export default class AddGroup extends React.Component {
    constructor(props) {
        super(props);
        this.showDrawer = this.showDrawer.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.fetchApplyList= this.fetchApplyList.bind(this);

        this.handleChange= this.handleChange.bind(this);
        this.handleSearch= this.handleSearch.bind(this);
        this.filterOption= this.filterOption.bind(this);
        this.getFriendList= this.getFriendList.bind(this);
        this.componentDidMount= this.componentDidMount.bind(this);

        this.state =  {
            visible: false,
            current: 'searchGroup',
            searchKey: '',

            mockData: [],
            friendList: [],
            targetKeys: [],
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


  fetchApplyList(e) {
      let key = e.key
      let isMy = false
      if (key == 'otherApply') {
          isMy = false
      } else if (key == 'myApply') {
          isMy = true
      }
      fetchGroupApply(isMy, 1, 10)
  }

  showGroupApplyConfirm(userId) {
    confirm({
      title: '入群申请',
      icon: <ExclamationCircleOutlined />,
      content: '确认申请加入群聊？',
      type: 'link',
      onOk() {
        createGroupApply(userId)
      },
      onCancel() {
      },
    });
  }

  showRefuseApplyConfirm(applyId) {
    confirm({
      title: '拒绝申请',
      icon: <ExclamationCircleOutlined />,
      content: '确认拒绝对方的入群申请？',
      type: 'link',
      onOk() {
        updateGroupApply(applyId, 2)
      },
      onCancel() {
      },
    });
  }

  showPassApplyConfirm(applyId) {
    confirm({
      title: '通过申请',
      icon: <ExclamationCircleOutlined />,
      content: '确认添加对方进入群聊？',
      type: 'link',
      onOk() {
        updateGroupApply(applyId, 1)
      },
      onCancel() {
      },
    });
  }

  filterOption (inputValue, option) {
    // option.description.indexOf(inputValue) > -1;
  }

  handleChange (targetKeys) {
    this.setState({ targetKeys });
  };

  handleSearch (dir, value) {
    console.log('search:', dir, value);
  };

  componentDidMount() {
    this.getFriendList();
  }

  getFriendList(){

    let friendList = []
    let friends = this.props.friends
    if (friends != undefined) {
      Object.values(friends).map((item, arr)=>{
        friendList.push({
          key: item.user_id,
          title: item.nickname,
        })
      })
    }
    this.setState({friendList:friendList})
    // this.setState({ mockData, targetKeys });
  };

  render() {
    const { userInfos, myApplys, otherApplys, groups, searchGroups, friends } = this.props

    const searchGroupByKey = (e) => {
      let searchKey = e
      if (searchKey == undefined || searchKey == 0) {
          return
      }
      this.state.searchKey = searchKey
      searchGroup(searchKey, 1, 10)
    }
    
    let myApplyList = [], otherApplyList = []
   // 处理申请列表
   if (myApplys != undefined && myApplys[2] != undefined && myApplys[2].applys) {
    myApplys[2].applys.map(function({apply_id, from_user_id, to_user_id, status, group_info}, arr) {
        if (status == undefined) {
            status = 0
        }
        let groupName
        if (group_info != undefined) {
          groupName = group_info.name
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
            groupName: groupName,
            status: status,
            userStatus: userStatus
        })
      })
    }
    if (otherApplys != undefined && otherApplys[2] != undefined && otherApplys[2].applys) {
        otherApplys[2].applys.map(function({apply_id, from_user_id, to_user_id, status, group_info}, arr) {
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
                groupName: group_info.name,
                status: status,
                userStatus: userStatus
            })
        })
    }


    const otherApplyColumns = [
        {
          title: '群名称',
          dataIndex: 'groupName',
          key: 'groupName',
        },
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
          title: '群名称',
          dataIndex: 'groupName',
          key: 'groupName',
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


    const searchGroupColumns = [
        {
          title: '群名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '状态',
          dataIndex: 'role',
          key: 'role',
          render: (text, record)  => (
            <span>
             <span hidden={record.user_role!=0}>未入群</span>
             <span hidden={record.user_role==0}>已入群</span>
            </span>
          )
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a style={{ marginRight: 16 }} hidden={record.user_role!=0} onClick={this.showGroupApplyConfirm.bind(this, record.group_id_str)}>加群</a>
              <a style={{ marginRight: 16 }} hidden={record.user_role<1}>发起聊天</a>
            </span>
          ),
        },
    ];

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 4, span: 12 },
    };



    const onFinish = values => {

      generalFetch(
          domain+action.create,
          {name: values.name, description: values.description, members: values.members},
          (result) => {
             if (result.status_code == 0){
                 openNotification('创建成功', '群聊已创建')
              } else {
                 openNotification('操作失败', '请稍后重试')
              }
              
          }
      )

          this.setState({visible:false})
      };
        
      const onFinishFailed = errorInfo => {
          console.log('Failed:', errorInfo);
    };



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
        <Menu.Item key="searchGroup">
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

        {this.state.current=='searchGroup' && <div>
          <br />
          <br />  
          <Search
            placeholder="请输入群名称"
            onSearch={searchGroupByKey}
            style={{ width: 400 }}
          />
          <br />
          <br /> 
           <Table columns={searchGroupColumns} dataSource={searchGroups} />
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

        {this.state.current=='createGroup' && <div>
          <br />
          <br />  
          <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              >
              <Form.Item
                  label="群名称"
                  name="name"
                  rules={[{ required: true, message: '请输入群名称' }]}
              >
                  <Input style={{width: "200px"}}/>
              </Form.Item>

              <Form.Item
                  label="群简介"
                  name="description"
                  rules={[{ required: true, message: '请输入群简介' }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                label="群成员"
                name="members"
                rules={[{ required: false, message: '请加入群成员' }]}
              >
              <Transfer
                dataSource={this.state.friendList}
                showSearch
                filterOption={this.filterOption}
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                render={item => item.title}
                locale={{itemUnit:'人', itemsUnit:'人', searchPlaceholder:'请输入好友昵称'}}
              />
              </Form.Item>

              <Form.Item {...tailLayout}>
                  <Button type="primary" size="middle" htmlType="submit">
                     创建 
                  </Button>
              </Form.Item>
          </Form>
          <br />
          <br />
        </div>}
        </Drawer>
      </div>
    );
  }
}

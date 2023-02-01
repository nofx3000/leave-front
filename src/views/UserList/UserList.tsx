import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserInfoInter } from '../../interface/UserInterface';
import axios from 'axios'

const formatCatagory = (catagory: number) => {
    switch (catagory) {
      case 0:
        return "干部";
      case 1:
        return "军士";
      case 2:
        return "文职";
      default:
        break;
    }
  };


const columns: ColumnsType<Partial<UserInfoInter>> = [
    {
        title: '用戶名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '真實姓名',
        dataIndex: 'realname',
        key: 'realname',
    },
    // {
    //     title: 'Address',
    //     dataIndex: 'address',
    //     key: 'address',
    // },
    {
        title: '人員類別',
        key: 'tags',
        dataIndex: 'catagory',
        render: (_, { catagory }) => (
            <>
                {formatCatagory(catagory as number)}
            </>
        ),
    },
    {
        title: '權限角色',
        key: 'role_id',
        dataIndex: 'role_id',
        render: (_, { role_id }) => (
            <>
                {role_id}
            </>
        ),
    },
    {
        title: '操作',
        key: 'option',
        render: (_, record) => (
            <Space size="middle">
                <a>編輯</a>
                <a>刪除</a>
            </Space>
        ),
    },
];

const App: React.FC = () => {
    const [userList, setUserList] = useState<Partial<UserInfoInter>[]>([])
    useEffect(() => {
        const getUserList = async () => {
            const res = await axios.get('/user')
            console.log(res.data.data);
            await setUserList(res.data.data)
        }
        getUserList()
    }, [])
    return <Table columns={columns} dataSource={userList} rowKey="id"/>;
}

export default App;
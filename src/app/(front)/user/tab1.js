import {ProDescriptions} from '@ant-design/pro-components';
import {useRef, useState} from 'react';
import {Avatar, message} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {clientBackendFetch} from "@/util/requestUtil";

async function getUser() {
    const user = await clientBackendFetch.post('/user/getLoginUser', null)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(r => {
            if (r) {
                return r.data
            }
        })
    console.log(user);
    return user
}

async function editUser(data) {
    console.log(data);
    clientBackendFetch.post('/user/update', data)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(r => {
            if (r && r.data) {
                message.success("修改成功")
            } else {
                message.error("修改失败")
            }
        })
}

export default function Tab1() {
    const [userUUID, setUserUUID] = useState(null);
    const actionRef = useRef();
    const columns = [
        {
            title: '用户名',
            dataIndex: 'userDisplayName',
            ellipsis: true,
        },
        {
            title: '邮箱',
            dataIndex: 'userEmail',
            copyable: true,
            ellipsis: true,
        },
        {
            title: '电话',
            dataIndex: 'userPhone',
            copyable: true,
            ellipsis: true,
        },
        {
            title: '国家',
            dataIndex: 'userCountry',
            ellipsis: true,
        },
    ];
    return (
        <ProDescriptions
            actionRef={actionRef}
            // bordered
            title={<Avatar size={64} icon={<UserOutlined/>}/>}
            request={async () => {
                let user = await getUser();
                if (user) {
                    setUserUUID(user.userUuid);
                    return {success: true, data: user}
                }
            }}
            editable={{
                onSave: (key, row) => {
                    const data = {'userUuid': userUUID};
                    data[key] = row[key];
                    editUser(data);
                }
            }}
            columns={columns}
        >
        </ProDescriptions>
    );
};
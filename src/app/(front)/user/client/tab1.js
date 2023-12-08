import {ProDescriptions} from '@ant-design/pro-components';
import {useCallback, useEffect, useRef, useState} from 'react';
import {message, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";

async function getLoginUser() {
    return await clientBackendFetch.post('/user/getLoginUser', null)
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
}

async function editUser(data) {
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

const AvatarUpload = ({onSuccess, filePath}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        if (filePath) {
            setImageUrl(`${imagePrefix}/${filePath}`)
        }
    }, [filePath]);
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            const {name, response} = info.file
            if (response.code === 200) {
                const fileObject = response.data[name];
                if (onSuccess) {
                    onSuccess(fileObject)
                } else {
                    const fileUrl = `${imagePrefix}/${fileObject.fileCategory}/${fileObject.fileUniqueName}`
                    setImageUrl(fileUrl);
                }
            }
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );
    return (<>
        <Upload
            accept={'image/*'}
            action="/backend/file/upload"
            withCredentials={true}
            name="file"
            data={{category: 'avatar'}}
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            onChange={handleChange}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    </>)
}

export default function Tab1() {
    const [user, setUser] = useState(null);
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
    const handleAvatarUpload = (fileObject) => {
        clientBackendFetch.postJson('/user/update', {userUuid: user.userUuid, userAvatar: fileObject.filePath})
            .then(r => {
                if (r) {
                    setUser({...user, userAvatar: fileObject.filePath});
                    message.success("success");
                }
            })
    }
    const handleSave = useCallback((key, row) => {
        const data = {'userUuid': user.userUuid};
        data[key] = row[key];
        editUser(data);
    }, [user])
    const handleRequest = useCallback(() => {
        return getLoginUser().then(u => {
            if (u) {
                setUser(u);
                return {success: true, data: u}
            }
        })
    })
    return (
        <>
            <ProDescriptions
                actionRef={actionRef}
                title={<AvatarUpload onSuccess={handleAvatarUpload} filePath={user?.userAvatar}/>}
                request={handleRequest}
                editable={{onSave: handleSave}}
                columns={columns}
            >
            </ProDescriptions>
        </>
    );
};
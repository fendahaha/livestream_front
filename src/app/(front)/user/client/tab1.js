import {ProDescriptions} from '@ant-design/pro-components';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {message, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {GlobalContext} from "@/app/(front)/component/globalContext";

async function editUser(data, onSuccess) {
    clientBackendFetch.post('/user/update', data)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(r => {
            if (r && r.data) {
                if (onSuccess) {
                    onSuccess()
                }
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
            name="file"
            data={{category: 'avatar'}}
            withCredentials={true}
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
    const actionRef = useRef();
    const {userInfo, updateUserInfo} = useContext(GlobalContext);
    const {user, anchor, client} = userInfo;
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
    const handleAvatarUpload = useCallback((fileObject) => {
        const data = {userUuid: user?.userUuid, userAvatar: fileObject.filePath};
        clientBackendFetch.postJson('/user/update', data)
            .then(r => {
                if (r) {
                    updateUserInfo({action: 'updateUser', data: data});
                    message.success("success");
                }
            })
    }, [user?.userUuid])
    const handleSave = useCallback((key, row) => {
        const data = {'userUuid': user.userUuid};
        data[key] = row[key];
        editUser(data, () => updateUserInfo({action: 'updateUser', data: data}));
    }, [user?.userUuid])
    const handleRequest = useCallback(() => {
        return {success: true, data: user ? user : {}}
    }, [user])
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
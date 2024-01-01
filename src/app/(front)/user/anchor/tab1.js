import {ProDescriptions} from '@ant-design/pro-components';
import {useCallback, useEffect, useRef, useState} from 'react';
import {message, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {useMyLocale} from "@/component/context/localeContext";

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
                message.success("success")
            } else {
                message.error("fail")
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

export default function Tab1({anchor}) {
    const {getDict} = useMyLocale('AnchorUserPage','tab1');
    const {user, room} = anchor;
    const actionRef = useRef();
    const columns = [
        {
            title: getDict('username'),
            dataIndex: 'userDisplayName',
            ellipsis: true,
        },
        {
            title: getDict('email'),
            dataIndex: 'userEmail',
            copyable: true,
            ellipsis: true,
        },
        {
            title: getDict('phone'),
            dataIndex: 'userPhone',
            copyable: true,
            ellipsis: true,
        },
        {
            title: getDict('country'),
            dataIndex: 'userCountry',
            ellipsis: true,
        },
    ];
    const handleAvatarUpload = useCallback((fileObject) => {
        const data = {userUuid: user?.userUuid, userAvatar: fileObject.filePath};
        clientBackendFetch.postJson('/user/update', data)
            .then(r => {
                if (r) {
                    message.success("success");
                }
            })
    }, [user?.userUuid])
    const handleSave = useCallback((key, row) => {
        const data = {'userUuid': user.userUuid};
        data[key] = row[key];
        editUser(data);
    }, [user?.userUuid])
    const handleRequest = useCallback(async () => {
        return {success: true, data: user}
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
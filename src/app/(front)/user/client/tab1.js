import {ProDescriptions} from '@ant-design/pro-components';
import {useCallback, useEffect, useRef, useState} from 'react';
import {message, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {useMyLocale} from "@/component/context/localeContext";

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
                const fileUrl = `${imagePrefix}/${fileObject.fileCategory}/${fileObject.fileUniqueName}`
                setImageUrl(fileUrl);
                if (onSuccess) {
                    onSuccess(fileObject)
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


export function ClientDetail({client}) {
    const {getDict} = useMyLocale('ClientUserPage', 'tab1');
    const actionRef = useRef();
    const columns = [
        {
            title: getDict('level'),
            dataIndex: 'clientLeavel',
            ellipsis: true,
            valueType: 'number',
            span: 3,
        },
        {
            title: getDict('money'),
            dataIndex: 'clientMoney',
            ellipsis: true,
            valueType: 'number',
        },
        {
            title: getDict('moneySent'),
            dataIndex: 'clientMoneySended',
            ellipsis: true,
            valueType: 'number',
        },
        {
            title: getDict('rechargeMoney'),
            dataIndex: 'clientMoneyRecharged',
            ellipsis: true,
            valueType: 'number',
        },
    ];
    return (
        <ProDescriptions
            column={3}
            actionRef={actionRef}
            title={''}
            request={async () => ({success: true, data: client})}
            columns={columns}
        />
    )
}

export function ClientUserDetail({user}) {
    const {getDict} = useMyLocale('ClientUserPage', 'tab1');
    const actionRef = useRef();
    const columns = [
        {
            title: getDict('username'),
            dataIndex: 'userDisplayName',
            ellipsis: true,
            valueType: 'string',
        },
        {
            title: getDict('email'),
            dataIndex: 'userEmail',
            copyable: true,
            ellipsis: true,
            valueType: 'email',
        },
        {
            title: getDict('phone'),
            dataIndex: 'userPhone',
            copyable: true,
            ellipsis: true,
            valueType: 'number',
        },
        {
            title: getDict('country'),
            dataIndex: 'userCountry',
            ellipsis: true,
            valueType: 'string',
        },
    ];
    const handleAvatarUpload = useCallback((fileObject) => {
        const data = {userUuid: user?.userUuid, userAvatar: fileObject.filePath};
        clientBackendFetch.postJson('/user/update', data)
            .then(r => {
                if (r && r.data) {
                    message.success(getDict("edit_success"));
                }
            })
    }, [user?.userUuid])
    const handleSave = useCallback((key, row) => {
        const data = {'userUuid': user.userUuid};
        data[key] = row[key];
        clientBackendFetch.postJson('/user/update', data)
            .then(r => {
                if (r && r.data) {
                    message.success(getDict("edit_success"))
                } else {
                    message.info(getDict("edit_fail"))
                }
            })
    }, [user?.userUuid])
    return (
        <>
            <ProDescriptions
                actionRef={actionRef}
                title={<AvatarUpload onSuccess={handleAvatarUpload} filePath={user?.userAvatar}/>}
                request={async () => ({success: true, data: user})}
                editable={{onSave: handleSave}}
                columns={columns}
            />
        </>
    );
}

export default function Tab1({clientInfo}) {
    const {user, client} = clientInfo;
    return (
        <>
            <ClientUserDetail user={user}/>
            <ClientDetail client={client}/>
        </>
    )
};
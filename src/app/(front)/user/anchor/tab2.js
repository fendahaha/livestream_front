import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ProDescriptions} from "@ant-design/pro-components";
import {clientBackendFetch, imagePrefix, rtmpServer} from "@/util/requestUtil";
import {message, Switch, Typography, Upload} from "antd";
import styles from './tab2.module.css';
import {DeleteOutlined, InboxOutlined} from "@ant-design/icons";
import {get_attribute_of_anchorConfig, update_attribute_of_anchorConfig} from "@/app/_func/client";
import {useMyLocale} from "@/component/context/localeContext";

const AnchorStatusChange = ({userUuid, anchorUuid}) => {
    const {getDict} = useMyLocale('AnchorUserPage','tab2');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const props = {
        checkedChildren: getDict('online'),
        unCheckedChildren: getDict('offline'),
        checked: checked,
        disabled: loading,
        loading: loading,
        onClick: () => {
            if (loading) {
                return
            }
            setLoading(true);
            clientBackendFetch.getJson("/anchor/setOnlineStatus", {user_uuid: userUuid, status: checked ? 0 : 1})
                .then(r => {
                    if (r?.data) {
                        setChecked(!checked);
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }
    useEffect(() => {
        clientBackendFetch.getJson("/anchor/is_online", {anchor_uuid: anchorUuid})
            .then(r => {
                if (r?.data) {
                    setChecked(true);
                } else {
                    setChecked(false);
                }
            })
    }, [anchorUuid]);
    return (
        <Switch {...props}/>
    )
}
const AnchorInfo = ({anchor}) => {
    const {getDict} = useMyLocale('AnchorUserPage','tab2');
    const {user, room} = anchor;
    const actionRef = useRef();
    console.log(anchor);
    const columns = [
        {
            title: getDict('stream_address'),
            dataIndex: 'streamAddress',
            copyable: true,
            editable: false,
            ellipsis: true,
            span: 3,
        },
        {
            title: getDict('can_stream'),
            dataIndex: 'roomEnable',
            editable: false,
            valueEnum: {
                1: {text: 'Yes', status: 'Success'},
                0: {text: 'No', status: 'Error'},
            },
        },
        {
            title: getDict('stream_type'),
            dataIndex: 'streamType',
            editable: false,
            span: 2,
        },
        {
            title: getDict('moneyReceive'),
            dataIndex: 'anchorMoney',
            editable: false,
            span: 1,
        },
        {
            title: getDict('follows'),
            dataIndex: 'anchorFollowers',
            editable: false,
            span: 2,
        },
        {
            title: getDict('room_title'),
            dataIndex: 'anchorRemark',
            copyable: true,
            ellipsis: true,
            span: 3,
        },
        {
            title: getDict('sanwei'),
            dataIndex: 'anchorSanwei',
            valueType: 'text',
        },
        {
            title: getDict('height'),
            dataIndex: 'anchorHeight',
            valueType: 'digit',
        },
        {
            title: getDict('weight'),
            dataIndex: 'anchorWieght',
            valueType: 'digit',
        },
    ];
    const proDescriptionsProps = {
        column: 3,
        actionRef: actionRef,
        request: () => {
            let s = {};
            if (anchor.anchorConfig) {
                s = JSON.parse(anchor.anchorConfig)
            }
            let d = {
                anchorSanwei: s.anchorSanwei,
                anchorHeight: s.anchorHeight,
                anchorWieght: s.anchorWieght,
                roomEnable: room.roomEnable,
                streamAddress: `${rtmpServer}${room.streamAddress}?${room.streamParam}`,
                streamType: room.streamType,
                anchorRemark: anchor.anchorRemark,
                anchorMoney: anchor.anchorMoney,
                anchorFollowers: anchor.anchorFollowers,
            }
            return {success: true, data: d}
        },
        editable: {
            onSave: (key, row) => {
                const data = {anchorUuid: anchor.anchorUuid};
                if (['anchorHeight', 'anchorSanwei', 'anchorWieght'].includes(key)) {
                    let anchorConfig = {};
                    if (anchor.anchorConfig) {
                        anchorConfig = JSON.parse(anchor.anchorConfig)
                    }
                    anchorConfig[key] = row[key];
                    data['anchorConfig'] = JSON.stringify(anchorConfig);
                } else {
                    data[key] = row[key];
                }
                clientBackendFetch.postJson('/anchor/update2', data)
                    .then(r => {
                        if (r) {
                            message.success("success");
                        }
                    })
            }
        },
        title: (
            <div className={styles.title}>
                <span>{getDict('onlineStatus')}</span>
                <AnchorStatusChange userUuid={anchor.userUuid} anchorUuid={anchor.anchorUuid}/>
            </div>
        ),
        columns: columns
    }
    return (
        <div>
            <ProDescriptions {...proDescriptionsProps}></ProDescriptions>
        </div>
    );
};

const AnchorImage = ({filePath, del}) => {
    return (
        <div className={styles.anchor_image}>
            <img src={`${imagePrefix}/${filePath}`} alt={''} className={styles.anchor_image_item}/>
            <div className={styles.anchor_image_del}>
                <DeleteOutlined onClick={() => del(filePath)}/>
            </div>
        </div>
    )
}

const AnchorImages = ({anchor}) => {
    const {getDict} = useMyLocale('AnchorUserPage','tab2');
    const anchorUuid = anchor.anchorUuid;
    const [anchorConfig, setAnchorConfig] = useState(anchor.anchorConfig)
    const upload_success_callback = (fileObject) => {
        let new_anchorConfig = update_attribute_of_anchorConfig(anchorConfig, 'covers', [], (covers) => {
            return [...covers, fileObject.filePath]
        });
        clientBackendFetch.postJson("/anchor/update2", {anchorUuid, anchorConfig: new_anchorConfig})
            .then(r => {
                if (r?.data) {
                    setAnchorConfig(new_anchorConfig);
                    message.success(getDict('upload_success'));
                }
            })
            .catch(() => {
                message.info(getDict('upload_fail'));
            })
    }
    const del = (filePath) => {
        let new_anchorConfig = update_attribute_of_anchorConfig(anchorConfig, 'covers', [], (covers) => {
            let index = covers.indexOf(filePath)
            if (index > -1) {
                covers.splice(index, 1)
            }
            return [...covers]
        });
        clientBackendFetch.postJson("/anchor/update2", {anchorUuid, anchorConfig: new_anchorConfig})
            .then(r => {
                if (r?.data) {
                    setAnchorConfig(new_anchorConfig);
                    message.success("success");
                }
            })
            .catch(() => {
                message.info("fail");
            })
    }
    const images = useMemo(() => {
        let covers = get_attribute_of_anchorConfig(anchorConfig, 'covers', []);
        return covers.map(filePath => <AnchorImage key={filePath} filePath={filePath} del={del}/>)
    }, [anchorConfig, del]);
    const props = {
        accept: 'image/*',
        action: "/backend/file/upload",
        name: "file",
        data: {category: 'anchor_avatar'},
        withCredentials: true,
        showUploadList: false,
        multiple: false,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onChange(info) {
            const {file} = info;
            if (file.status === 'uploading') {
                return;
            }
            if (file.status === 'done') {
                const {name, response} = file
                if (response.data[name]) {
                    upload_success_callback(response.data[name]);
                } else {
                    message.info(getDict('upload_fail'));
                }
            }
            if (file.status === 'error') {
                console.log(info);
                message.error(getDict('upload_fail'));

            }
        },
    };
    return (
        <>
            <div className={styles.anchor_images}>
                {/*{data.map(filePath => <AnchorImage key={filePath} data={filePath}/>)}*/}
                {images}
                <div>
                    <Upload.Dragger {...props} className={styles.fd_ant_upload}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or
                            other
                            banned files.
                        </p>
                    </Upload.Dragger>
                </div>
            </div>
        </>
    )
}

export default function Page({anchor}) {
    const {getDict} = useMyLocale('AnchorUserPage','tab2');
    return (
        <>
            <AnchorInfo anchor={anchor}/>
            <Typography.Title ellipsis={true} level={2} type={'secondary'} style={{textAlign: "center"}}>
                {getDict('anchor_images')}
            </Typography.Title>
            <AnchorImages anchor={anchor}/>
        </>
    );
}
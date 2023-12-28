import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ProDescriptions} from "@ant-design/pro-components";
import {clientBackendFetch, imagePrefix, rtmpServer} from "@/util/requestUtil";
import {message, Switch, Typography, Upload} from "antd";
import styles from './tab2.module.css';
import {DeleteOutlined, InboxOutlined} from "@ant-design/icons";
import {get_attribute_of_anchorConfig, update_attribute_of_anchorConfig} from "@/app/_func/client";

const AnchorStatusChange = ({userUuid, anchorUuid}) => {
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const props = {
        checkedChildren: '在线',
        unCheckedChildren: '下线',
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
    const {user, room} = anchor;
    const actionRef = useRef();
    const columns = [
        {
            title: '直播地址',
            dataIndex: 'streamAddress',
            copyable: true,
            editable: false,
            ellipsis: true,
            span: 3,
        },
        {
            title: '是否可以直播',
            dataIndex: 'roomEnable',
            editable: false,
            valueEnum: {
                1: {text: 'Yes', status: 'Success'},
                0: {text: 'No', status: 'Error'},
            },
        },
        {
            title: '直播类型',
            dataIndex: 'streamType',
            editable: false,
            span: 2,
        },
        {
            title: '直播房间标题',
            dataIndex: 'anchorRemark',
            copyable: true,
            ellipsis: true,
            span: 3,
        },
        {
            title: '三维',
            dataIndex: 'anchorSanwei',
            valueType: 'digit',
        },
        {
            title: '身高',
            dataIndex: 'anchorHeight',
            valueType: 'digit',
        },
        {
            title: '体重',
            dataIndex: 'anchorWieght',
            valueType: 'digit',
        },
    ];
    const handleSave = useCallback((key, row) => {
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
    }, [anchor])
    const handleRequest = useCallback(() => {
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
        }
        return {success: true, data: d}
    }, [anchor])
    return (
        <div>
            <ProDescriptions
                column={3}
                actionRef={actionRef}
                title={<AnchorStatusChange userUuid={anchor.userUuid} anchorUuid={anchor.anchorUuid}/>}
                request={handleRequest}
                editable={{onSave: handleSave}}
                columns={columns}
            >
            </ProDescriptions>
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
                    message.success("上传成功");
                }
            })
            .catch(() => {
                message.success("上传失败");
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
                message.success("fail");
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
                    message.error("上传失败")
                }
            }
            if (file.status === 'error') {
                console.log(info);
                message.error("上传失败（网络错误）")
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
    return (
        <>
            <AnchorInfo anchor={anchor}/>
            <Typography.Title ellipsis={true} level={2} type={'secondary'} style={{textAlign: "center"}}>
                主播封面图
            </Typography.Title>
            <AnchorImages anchor={anchor}/>
        </>
    );
}
import React, {useCallback, useRef} from 'react';
import {ProDescriptions} from "@ant-design/pro-components";
import {clientBackendFetch, rtmpServer} from "@/util/requestUtil";
import {message} from "antd";

const App = ({anchor}) => {
    const actionRef = useRef();
    const columns = [
        {
            title: '直播地址',
            dataIndex: 'streamAddress',
            copyable: true,
            editable: false,
            ellipsis: true,
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
        },
        {
            title: '直播房间标题',
            dataIndex: 'anchorRemark',
            copyable: true,
            ellipsis: true,
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
        const user = anchor.user;
        const room = anchor.room;
        let s = {};
        if (anchor.anchorConfig) {
            s = JSON.parse(anchor.anchorConfig)
        }
        let d = {
            ...s,
            roomEnable: room.roomEnable,
            streamAddress: `${rtmpServer}/${room.streamAddress}`,
            streamType: room.streamType,
            anchorRemark: anchor.anchorRemark,
        }
        return {success: true, data: d}
    }, [anchor])
    return (
        <div>
            <ProDescriptions
                column={1}
                actionRef={actionRef}
                title={''}
                request={handleRequest}
                editable={{onSave: handleSave}}
                columns={columns}
            >
            </ProDescriptions>
        </div>
    );
};
export default App;
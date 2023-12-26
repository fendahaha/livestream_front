'use client'
import React, {useState} from 'react';
import {ReloadOutlined} from "@ant-design/icons";
import {Image, Input, InputNumber, message, Tooltip} from "antd";
import {clientBackendFetch, imagePrefix, rtmpServer} from "@/util/requestUtil";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {CreateButton, DataList, ImageUploadFormItem} from "@/component/antform";
import SearchForm from "@/app/(backend)/admin/anchor/SearchForm";
import {MyCopyableToolTip} from "@/component/ant_common";

const initialColumns = [
    {
        title: 'user.avatar',
        dataIndex: 'userAvatar',
        editable: true,
        editInputType: 'image',
        editConfig: {imageCategory: 'avatar'},
        render: (_, record) => {
            return _ ? <Image width={50} src={`${imagePrefix}/${_}`}/> : ''
        }
    },
    {
        title: 'user.userName',
        dataIndex: 'userName',
        render: (_, record) => record?.user?.userName,
    },
    {
        title: 'user.userDisplayName',
        dataIndex: 'userDisplayName',
        render: (_, record) => record?.user?.userDisplayName,
    },
    {
        title: 'room.streamType',
        dataIndex: 'streamType',
        render: (_, record) => record?.room?.streamType,
    },
    {
        title: 'room.streamAddress',
        dataIndex: 'streamAddress',
        ellipsis: true,
        render: (_, record) => {
            let s = `${rtmpServer}${record?.room?.streamAddress}?${record?.room?.streamParam}`;
            return <MyCopyableToolTip text={s}>
                <div>{s}</div>
            </MyCopyableToolTip>
        },
    },
    {
        title: 'anchorSanwei',
        dataIndex: 'anchorSanwei',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'anchorHeight',
        dataIndex: 'anchorHeight',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'anchorWieght',
        dataIndex: 'anchorWieght',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'anchorRemark',
        dataIndex: 'anchorRemark',
        ellipsis: true,
        editable: true,
        editRules: [],
        editInputType: 'text',
    },
    {
        title: 'anchorCreateAt',
        dataIndex: 'anchorCreateAt',
        editable: false,
        editInputType: 'date',
        render: (_, record) => _.format('YYYY-MM-DD HH:mm:ss')
    },
];
const get_data = (params) => {
    return clientBackendFetch.postJson('/anchor/list', params).then(r => {
        if (r?.data) {
            dayjs.extend(customParseFormat);
            const {list, total} = r.data;
            let d = list.map(r => {
                let anchorConfig = JSON.parse(r.anchorConfig);
                return {
                    ...r,
                    anchorCreateAt: dayjs(r['anchorCreateAt'], "YYYY-MM-DD HH:mm:ss"),
                    userAvatar: r.user.userAvatar,
                    anchorSanwei: anchorConfig?.anchorSanwei,
                    anchorHeight: anchorConfig?.anchorHeight,
                    anchorWieght: anchorConfig?.anchorWieght,
                }
            })
            return {list: d, total}
        }
    })
}
const update_data = async (item) => {
    let anchorConfig = JSON.stringify({
        anchorSanwei: item.anchorSanwei,
        anchorHeight: item.anchorHeight,
        anchorWieght: item.anchorWieght,
    });
    item = {
        ...item,
        anchorCreateAt: item['anchorCreateAt'].format("YYYY-MM-DD HH:mm:ss"),
        anchorConfig,
    }
    await clientBackendFetch.postJson('/anchor/update', item).then(r => {
        if (r?.data) {
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const delete_data = (record, successCallback) => {
    clientBackendFetch.formPostJson('/anchor/delete', {id: record.id}).then(r => {
        if (r?.data) {
            message.success("success")
            if (successCallback) {
                successCallback(record)
            }
        } else {
            message.error("fail")
        }
    })
}

const initialFormItems = [
    {
        label: 'userName',
        name: 'userName',
        rules: [{required: true, message: 'this is required'}],
        input: <Input placeholder=""/>
    },
    {
        label: 'userPassword',
        name: 'userPassword',
        rules: [{required: true, message: 'this is required'}],
        input: <Input placeholder=""/>
    },
    {
        label: 'userEmail',
        name: 'userEmail',
        rules: [],
        input: <Input placeholder=""/>
    },
    {
        label: 'userPhone',
        name: 'userPhone',
        rules: [],
        input: <InputNumber style={{width: '100%'}}/>
    },
    {
        label: 'userCountry',
        name: 'userCountry',
        rules: [],
        input: <Input placeholder=""/>
    },
    {
        label: 'userAvatar',
        name: 'userAvatar',
        rules: [{required: true, message: 'this is required'}],
        input: <ImageUploadFormItem category={'avatar'}/>
    },
    {
        label: 'anchorSanwei',
        name: 'anchorSanwei',
        rules: [{required: true, message: 'this is required'}],
        input: <InputNumber style={{width: '100%'}}/>
    },
    {
        label: 'anchorHeight',
        name: 'anchorHeight',
        rules: [{required: true, message: 'this is required'}],
        input: <InputNumber style={{width: '100%'}}/>
    },
    {
        label: 'anchorWieght',
        name: 'anchorWieght',
        rules: [{required: true, message: 'this is required'}],
        input: <InputNumber style={{width: '100%'}}/>
    },
]
const onCreateFinish = (values) => {
    values['anchorConfig'] = {
        anchorSanwei: values.anchorSanwei,
        anchorHeight: values.anchorHeight,
        anchorWieght: values.anchorWieght
    };
    values['anchorConfig'] = JSON.stringify(values['anchorConfig']);
    return clientBackendFetch.postJson('/anchor/create', values).then(r => {
        if (r && r.data) {
            message.success("success");
        } else {
            message.error("fail");
        }
    })
}
export default function Page() {
    const [searchData, setSearchData] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    return (
        <>
            <div style={{padding: '0 10px', marginBottom: 20}}>
                <SearchForm setSearchData={setSearchData} setPagination={setPagination}/>
            </div>
            <div style={{
                padding: '0 10px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <CreateButton initialFormItems={initialFormItems} onFinish={onCreateFinish}/>
                <span style={{
                    paddingRight: '10px',
                    fontSize: '22px',
                    lineHeight: '22px',
                }}>
                    <Tooltip title="reload">
                        <ReloadOutlined style={{cursor: 'pointer',}} onClick={() => {
                            setSearchData({...searchData, _timing: new Date().getTime()})
                        }}/>
                    </Tooltip>
                </span>
            </div>
            <div style={{padding: '0 10px', marginBottom: 10}}>
                <DataList searchData={searchData} pagination={pagination} setPagination={setPagination}
                          initialColumns={initialColumns} get_data={get_data} update_data={update_data}
                          delete_data={delete_data}/>
            </div>
        </>
    );
};
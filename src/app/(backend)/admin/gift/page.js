'use client'
import React, {useState} from 'react';
import {ReloadOutlined} from "@ant-design/icons";
import {Image, Input, InputNumber, message, Tooltip} from "antd";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {CreateButton, DataList, ImageUploadFormItem, SearchForm} from "@/component/antform";

const initialColumns = [
    {
        title: 'giftName',
        dataIndex: 'giftName',
        ellipsis: true,
        editable: true,
        editRules: [{type: 'string', min: 1, message: '最少1个字符'}],
        editInputType: 'text',
    },
    {
        title: 'giftValue',
        dataIndex: 'giftValue',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'giftImage',
        dataIndex: 'giftImage',
        editable: true,
        editInputType: 'image',
        render: (_, record) => _ ? <Image width={50} src={`${imagePrefix}/${_}`}/> : ''
    },
    {
        title: 'giftOrder',
        dataIndex: 'giftOrder',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'giftCreateAt',
        dataIndex: 'giftCreateAt',
        editable: false,
        editInputType: 'date',
        render: (_, record) => _.format('YYYY-MM-DD HH:mm:ss')
    },
];
const get_data = (params) => {
    return clientBackendFetch.postJson('/gift/list', params).then(r => {
        if (r?.data) {
            dayjs.extend(customParseFormat);
            const {list, total} = r.data;
            let d = list.map(r => {
                return {...r, giftCreateAt: dayjs(r['giftCreateAt'], "YYYY-MM-DD HH:mm:ss")}
            })
            return {list: d, total}
        }
    })
}
const update_data = async (item) => {
    item['giftCreateAt'] = item['giftCreateAt'].format("YYYY-MM-DD HH:mm:ss");
    await clientBackendFetch.postJson('/gift/update', item).then(r => {
        if (r?.data) {
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const delete_data = (record, successCallback) => {
    clientBackendFetch.postJson('/gift/delete', {id: record.id}).then(r => {
        if (r?.data) {
            if (successCallback) {
                successCallback(record)
            }
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}

const initialFormItems = [
    {
        label: 'giftName',
        name: 'giftName',
        rules: [
            {required: true, message: 'this is required'},
            {
                type: "string",
                message: '字符长度在1-100',
                min: 1,
                max: 100,
            }
        ],
        input: <Input placeholder=""/>
    },
    {
        label: 'giftValue',
        name: 'giftValue',
        rules: [
            {required: true, message: 'this is required'},
            {
                type: "number",
                message: '最小值为1',
                min: 1,
            }
        ],
        input: <InputNumber style={{width: '100%'}}/>
    },
    {
        label: 'giftImage',
        name: 'giftImage',
        rules: [
            {required: true, message: 'this is required'},
            {
                type: "string",
                message: '字符长度在1-255',
                min: 1,
                max: 255,
            }
        ],
        input: <ImageUploadFormItem category={'gift'}/>
    },
    {
        label: 'giftOrder',
        name: 'giftOrder',
        rules: [
            {required: true, message: 'this is required'},
            {
                type: "number",
                message: '最小值为1',
                min: 1,
            }
        ],
        input: <InputNumber style={{width: '100%'}}/>
    }
]
const onCreateFinish = (values) => {
    return clientBackendFetch.postJson('/gift/create', values).then(r => {
        if (r) {
            message.success("success");
        } else {
            message.success("fail");
        }
    })
}

const searchFormItems = [
    {
        formItemProps: {
            name: 'giftName',
            rules: [
                {
                    type: 'string',
                    whitespace: true,
                },
            ],
        },
        input: <Input placeholder="giftName"/>,
    },
    {
        formItemProps: {
            name: 'giftValue',
            rules: [
                {
                    type: 'number',
                    message: 'must be number!',
                },
            ],
        },
        input: <InputNumber placeholder='giftValue'/>,
    },
]
export default function Page() {
    const [searchData, setSearchData] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const onFinish = (values) => {
        setSearchData(values);
        setPagination({
            current: 1,
            pageSize: 10,
            total: 0,
        });
    }
    return (
        <>
            <div style={{padding: '0 10px', marginBottom: 20}}>
                <SearchForm onFinish={onFinish} items={searchFormItems}/>
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
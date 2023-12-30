'use client'
import React, {useState} from 'react';
import {ReloadOutlined} from "@ant-design/icons";
import {Image, Input, InputNumber, message, Tooltip} from "antd";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {DataList, SearchForm} from "@/component/antform";

const initialColumns = [
    {
        title: 'userAvatar',
        dataIndex: 'userAvatar',
        ellipsis: true,
        editable: true,
        editInputType: 'image',
        render: (_, record) => _ ? <Image width={50} src={`${imagePrefix}/${_}`}/> : ''
    },
    {
        title: 'userDisplayName',
        dataIndex: 'userDisplayName',
        ellipsis: true,
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'userEmail',
        dataIndex: 'userEmail',
        ellipsis: true,
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'userPhone',
        dataIndex: 'userPhone',
        ellipsis: true,
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'userCountry',
        dataIndex: 'userCountry',
        ellipsis: true,
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'clientLeavel',
        dataIndex: 'clientLeavel',
        ellipsis: true,
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'clientMoney',
        dataIndex: 'clientMoney',
        ellipsis: true,
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'clientMoneySended',
        dataIndex: 'clientMoneySended',
        ellipsis: true,
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'clientMoneyRecharged',
        dataIndex: 'clientMoneyRecharged',
        ellipsis: true,
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'createAt',
        dataIndex: 'createAt',
        editable: false,
        editInputType: 'date',
        render: (_, record) => _.format('YYYY-MM-DD HH:mm:ss')
    },
];
const get_data = (params) => {
    return clientBackendFetch.postJson('/client/list', params).then(r => {
        if (r?.data) {
            dayjs.extend(customParseFormat);
            const {list, total} = r.data;
            let d = list.map(r => {
                return {
                    ...r.user,
                    createAt: dayjs(r.user['createAt'], "YYYY-MM-DD HH:mm:ss"),
                    clientLeavel: r.client.clientLeavel,
                    clientMoney: r.client.clientMoney,
                    clientMoneySended: r.client.clientMoneySended,
                    clientMoneyRecharged: r.client.clientMoneyRecharged,
                }
            })
            return {list: d, total}
        }
    })
}
const update_data = async (item) => {
    item['createAt'] = item['createAt'].format("YYYY-MM-DD HH:mm:ss");
    await clientBackendFetch.postJson(`/client/update/${item.userUuid}`, item).then(r => {
        if (r?.data) {
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const delete_data = (record, successCallback) => {
    clientBackendFetch.getJson(`/client/delete/${record.userUuid}`).then(r => {
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

const searchFormItems = [
    {
        formItemProps: {
            name:'userDisplayName',
            rules:[],
        },
        input: <Input placeholder="userDisplayName"/>,
    },
    {
        formItemProps: {
            name:'userPhone',
            rules:[{type: 'number', message: 'must be number!'},],
        },
        input: <InputNumber placeholder='userPhone'/>,
    },
    {
        formItemProps: {
            name:'userCountry',
            rules:[],
        },
        input: <Input placeholder="userCountry"/>,
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
                <span></span>
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
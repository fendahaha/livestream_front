'use client'
import React, {useState} from 'react';
import {ReloadOutlined} from "@ant-design/icons";
import {message, Tooltip} from "antd";
import {clientBackendFetch} from "@/util/requestUtil";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {DataList} from "@/component/antform";
import SearchForm from "@/app/(front)/user/anchor/SearchForm";

const initialColumns = [
    {
        title: 'clientName',
        dataIndex: 'clientName',
        ellipsis: true,
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'anchorName',
        dataIndex: 'anchorName',
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'giftName',
        dataIndex: 'giftName',
        editable: true,
        editInputType: 'text',
    },
    {
        title: 'giftValue',
        dataIndex: 'giftValue',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'giftSendDate',
        dataIndex: 'giftSendDate',
        editable: false,
        editInputType: 'date',
        render: (_, record) => _.format('YYYY-MM-DD HH:mm:ss')
    },
];
const get_data = (params) => {
    return clientBackendFetch.postJson('/gift_send_record/list', params).then(r => {
        if (r?.data) {
            dayjs.extend(customParseFormat);
            const {list, total} = r.data;
            let d = list.map(r => {
                return {...r, giftSendDate: dayjs(r['giftSendDate'], "YYYY-MM-DD HH:mm:ss")}
            })
            return {list: d, total}
        }
    })
}
const update_data = async (item) => {
    item['giftCreateAt'] = item['giftCreateAt'].format("YYYY-MM-DD HH:mm:ss");
    await clientBackendFetch.postJson('/gift_send_record/update', item).then(r => {
        if (r?.data) {
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const delete_data = (record, successCallback) => {
    clientBackendFetch.postJson('/gift_send_record/delete', {id: record.id}).then(r => {
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
export default function GiftSendList({anchor}) {
    const [searchData, setSearchData] = useState({anchorUuid: anchor.anchorUuid});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    return (
        <>
            <div style={{padding: '0 10px', marginBottom: 20}}>
                <SearchForm setSearchData={setSearchData} setPagination={setPagination} anchor={anchor}/>
            </div>
            <div style={{
                padding: '0 10px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
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
'use client'
import React, {useState} from 'react';
import {CreateButton} from "@/app/(backend)/admin/gift_send_record/create";
import DataList from "@/app/(backend)/admin/gift_send_record/DataList";
import SearchForm from "@/app/(backend)/admin/gift_send_record/SearchForm";
import {ReloadOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";

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
                <CreateButton/>
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
                <DataList searchData={searchData} pagination={pagination} setPagination={setPagination}/>
            </div>
        </>
    );
};
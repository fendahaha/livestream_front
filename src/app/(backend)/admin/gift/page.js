'use client'
import React, {useState} from 'react';
import {Button, Drawer, Form, Input, InputNumber} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import Create from "@/app/(backend)/admin/gift/create";
import DataList from "@/app/(backend)/admin/gift/DataList";
import SearchForm from "@/app/(backend)/admin/gift/SearchForm";

export default function Page() {
    const [searchData, setSearchData] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <>
            <div style={{padding: '0 10px', marginBottom: 20}}>
                <SearchForm setSearchData={setSearchData} setPagination={setPagination}/>
            </div>
            <div style={{padding: '0 10px', marginBottom: 10}}>
                <Button type="primary" key="button" icon={<PlusOutlined/>}
                        onClick={() => setDrawerOpen(true)}>新建</Button>
                <Drawer title="Basic Drawer" placement="right" destroyOnClose={true} size={'large'}
                        onClose={() => setDrawerOpen(false)} open={drawerOpen}>
                    <Create/>
                </Drawer>
            </div>
            <div style={{padding: '0 10px', marginBottom: 10}}>
                <DataList searchData={searchData} pagination={pagination} setPagination={setPagination}/>
            </div>
        </>
    );
};
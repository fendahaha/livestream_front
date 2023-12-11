'use client'
import React, {useState} from 'react';
import {Button, Drawer, Form, Input, InputNumber} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import Create from "@/app/(backend)/admin/gift/create";
import DataList from "@/app/(backend)/admin/gift/DataList";


export function CreateButton({buttonText, children}) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    return (
        <>
            <Button type="primary" key="button" icon={<PlusOutlined/>}
                    onClick={() => setDrawerOpen(true)}>{buttonText}</Button>
            <Drawer title="Basic Drawer" placement="right" destroyOnClose={true} size={'large'}
                    onClose={() => setDrawerOpen(false)} open={drawerOpen}>
                {children}
            </Drawer>
        </>
    );
}

export const SearchForm = ({setSearchData}) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        setSearchData(values)
        console.log('Finish:', values);
    };
    return (
        <Form form={form} name="horizontal" layout="inline" onFinish={onFinish}>
            <Form.Item name="giftName">
                <Input placeholder="giftName"/>
            </Form.Item>
            <Form.Item
                name="giftValue"
                rules={[
                    {
                        type: 'number',
                        message: 'must be number!',
                    },
                ]}
            >
                <InputNumber placeholder='giftValue'/>
            </Form.Item>
            <Form.Item shouldUpdate>
                {() => (
                    <Button type="primary" htmlType="submit"
                            disabled={!!form.getFieldsError().filter(({errors}) => errors.length).length}
                    >
                        Search
                    </Button>
                )}
            </Form.Item>
            <Form.Item>
                <Button onClick={() => form.resetFields()}>Reset</Button>
            </Form.Item>
        </Form>
    )
}

const App = () => {
    const [searchData, setSearchData] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    return (
        <>
            <div style={{padding: '0 10px', marginBottom: 20}}>
                <SearchForm setSearchData={setSearchData}/>
            </div>
            <div style={{padding: '0 10px', marginBottom: 10}}>
                <CreateButton buttonText={'新建'}>
                    <Create></Create>
                </CreateButton>
            </div>
            <div style={{padding: '0 10px', marginBottom: 10}}>
                <DataList searchData={searchData} pagination={pagination} setPagination={setPagination}/>
            </div>
        </>
    );
};
export default App;
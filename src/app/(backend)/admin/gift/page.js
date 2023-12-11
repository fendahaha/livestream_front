'use client'
import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Drawer, Form, Input} from 'antd';
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

export const SearchFormContext = createContext({
    searchData: {}, setSearchData: (r) => {
    }
});
export const SearchForm = () => {
    const {searchData, setSearchData} = useContext(SearchFormContext);
    const [form1] = Form.useForm();
    const [clientReady, setClientReady] = useState(false);
    // To disable submit button at the beginning.
    useEffect(() => {
        setClientReady(true);
    }, []);
    const onFinish = (values) => {
        setSearchData(values)
        console.log('Finish:', values);
    };
    return (
        <Form form={form1} name="horizontal" layout="inline" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input placeholder="Username"/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input type="password" placeholder="Password"/>
            </Form.Item>
            <Form.Item shouldUpdate>
                {() => (
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                            !clientReady ||
                            !form1.isFieldsTouched(true) ||
                            !!form1.getFieldsError().filter(({errors}) => errors.length).length
                        }
                    >
                        Search
                    </Button>
                )}
            </Form.Item>
            <Form.Item>
                <Button onClick={() => {
                    form1.resetFields()
                }}>Reset</Button>
            </Form.Item>
        </Form>
    )
}

const App = () => {
    const [searchData, setSearchData] = useState({});
    const contextValue = useMemo(()=>{
        return {searchData, setSearchData}
    },[searchData]);
    return (
        <>
            <SearchFormContext.Provider value={contextValue}>
                <div style={{padding: '0 10px', marginBottom: 20}}>
                    <SearchForm/>
                </div>
                <div style={{padding: '0 10px', marginBottom: 10}}>
                    <CreateButton buttonText={'新建'}>
                        <Create></Create>
                    </CreateButton>
                </div>
                <div style={{padding: '0 10px', marginBottom: 10}}>
                    <DataList/>
                </div>
            </SearchFormContext.Provider>
        </>
    );
};
export default App;
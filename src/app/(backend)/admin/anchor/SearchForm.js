import {Button, Form, Input, InputNumber, Select} from "antd";
import React from "react";

export default function SearchForm({setSearchData, setPagination}) {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        setSearchData(values);
        setPagination({
            current: 1,
            pageSize: 10,
            total: 0,
        });
    };
    return (
        <Form form={form} name="horizontal" layout="inline" onFinish={onFinish}>
            <Form.Item name="userName" rules={[{type: 'string', min: '1', whitespace: true}]}>
                <Input placeholder="userName"/>
            </Form.Item>
            <Form.Item name="roomEnable">
                <Select placeholder="roomEnable"
                        options={[
                            {value: 1, label: 'enable'},
                            {value: 0, label: 'disable'},
                        ]}
                />
            </Form.Item>
            <Form.Item name="streamType">
                <Select placeholder="streamType"
                        options={[
                            {value: 'live', label: 'live'},
                            {value: 'static', label: 'static'},
                        ]}
                />
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
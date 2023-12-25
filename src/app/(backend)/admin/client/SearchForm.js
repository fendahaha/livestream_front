import {Button, Form, Input, InputNumber} from "antd";
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
            <Form.Item name="userDisplayName" rules={[]}>
                <Input placeholder="userDisplayName"/>
            </Form.Item>
            <Form.Item
                name="userPhone"
                rules={[{type: 'number', message: 'must be number!'},]}
            >
                <InputNumber placeholder='userPhone'/>
            </Form.Item>
            <Form.Item name="userCountry" rules={[]}>
                <Input placeholder="userCountry"/>
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
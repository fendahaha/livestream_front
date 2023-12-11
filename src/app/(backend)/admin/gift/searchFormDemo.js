import {Button, Form, Input} from "antd";
import React, {useEffect, useState} from "react";

export const SearchForm = ({setSearchData}) => {
    const [form] = Form.useForm();
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
        <Form form={form} name="horizontal" layout="inline" onFinish={onFinish}>
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
                            !form.isFieldsTouched(true) ||
                            !!form.getFieldsError().filter(({errors}) => errors.length).length
                        }
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
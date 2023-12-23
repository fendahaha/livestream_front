import {Button, Form, Input, InputNumber} from "antd";
import React from "react";

export default function SearchForm({setSearchData, setPagination, anchor}) {
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
        <Form form={form} name="horizontal" layout="inline" onFinish={onFinish}
              initialValues={{anchorUuid: anchor.anchorUuid}}>
            <Form.Item name="clientName"
                       rules={[
                           {
                               type: 'string',
                               whitespace: true,
                           },
                       ]}>
                <Input placeholder="clientName"/>
            </Form.Item>
            <Form.Item name="anchorUuid"
                       hidden={true}
            >
                <Input placeholder="anchorUuid"/>
            </Form.Item>
            <Form.Item name="giftName"
                       rules={[
                           {
                               type: 'string',
                               whitespace: true,
                           },
                       ]}>
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
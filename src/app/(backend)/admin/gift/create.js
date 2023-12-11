import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, message, Space, Tag} from 'antd';
import {clientBackendFetch} from "@/util/requestUtil";


const SubmitButton = ({form, loading}) => {
    const [submittable, setSubmittable] = React.useState(false);
    // Watch all values
    const values = Form.useWatch([], form);
    React.useEffect(() => {
        form
            .validateFields({
                validateOnly: true,
            })
            .then(
                () => {
                    setSubmittable(true);
                },
                () => {
                    setSubmittable(false);
                },
            );
    }, [values]);
    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} loading={loading}>
            Submit
        </Button>
    );
};
const customizeRequiredMark = (label, {required}) => (
    <>
        {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
        {label}
    </>
);
const Create = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState(false);
    // To disable submit button at the beginning.
    useEffect(() => {
        setClientReady(true);
    }, []);
    const onFinish = (values) => {
        setLoading(true);
        clientBackendFetch.postJson('/gift/create', values).then(r => {
            if (r) {
                message.success("success");
            } else {
                message.success("fail");
            }
        }).finally(() => {
            setLoading(false);
        })
    }
    return (
        <Form
            autoComplete={"off"}
            form={form}
            layout="vertical"
            initialValues={{}}
            onFinish={onFinish}
            requiredMark={customizeRequiredMark}
        >
            <Form.Item label="giftName" name='giftName'
                       rules={[
                           {required: true, message: 'this is required'},
                           {
                               type: "string",
                               message: '字符长度在1-100',
                               min: 1,
                               max: 100,
                           }
                       ]}
            >
                <Input placeholder=""/>
            </Form.Item>
            <Form.Item label="giftValue" name='giftValue'
                       rules={[
                           {required: true, message: 'this is required'},
                           {
                               type: "number",
                               message: '最小值为1',
                               min: 1,
                           }
                       ]}
            >
                <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item label="giftImage" name='giftImage'
                       rules={[
                           {required: true, message: 'this is required'},
                           {
                               type: "string",
                               message: '字符长度在1-255',
                               min: 1,
                               max: 255,
                           }
                       ]}
            >
                <Input placeholder=""/>
            </Form.Item>
            <Form.Item label="giftOrder" name='giftOrder'
                       rules={[
                           {required: true, message: 'this is required'},
                           {
                               type: "number",
                               message: '最小值为1',
                               min: 1,
                           }
                       ]}
            >
                <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item shouldUpdate>
                <Space>
                    <SubmitButton form={form} loading={loading}/>
                    <Button htmlType="reset">Reset</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
export default Create;
import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, InputNumber, message, Space, Tag} from 'antd';
import {clientBackendFetch} from "@/util/requestUtil";
import {PlusOutlined} from "@ant-design/icons";


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
        clientBackendFetch.postJson('/gift_send_record/create', values).then(r => {
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
                       ]}
            >
                <Input placeholder=""/>
            </Form.Item>
            <Form.Item label="giftValue" name='giftValue'
                       rules={[
                           {required: true, message: 'this is required'},
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

export function CreateButton() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <span>
            <Button type="primary" key="button" icon={<PlusOutlined/>}
                    onClick={() => setDrawerOpen(true)}>New</Button>
            <Drawer title="Basic Drawer" placement="right" destroyOnClose={true} size={'large'}
                    onClose={() => setDrawerOpen(false)} open={drawerOpen}>
                <Create/>
            </Drawer>
        </span>
    );
}

export default Create;
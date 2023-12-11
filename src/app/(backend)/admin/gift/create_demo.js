import React from 'react';
import {Button, Form, Input, InputNumber, Space, Tag} from 'antd';


const SubmitButton = ({form}) => {
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
        <Button type="primary" htmlType="submit" disabled={!submittable}>
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
    const [form] = Form.useForm();

    const onValuesChange = ({requiredMarkValue}) => {

    };
    return (
        <Form
            autoComplete={"off"}
            form={form}
            layout="vertical"
            initialValues={{}}
            onValuesChange={onValuesChange}
            requiredMark={customizeRequiredMark}
        >
            <Form.Item label="Field A" name={'a'}
                       rules={[
                           {required: true, message: 'please input'},
                           {
                               type: "string",
                               message: '字符长度在1-10',
                               min: 1,
                               max: 10,
                           }
                       ]}
            >
                <Input placeholder=""/>
            </Form.Item>
            <Form.Item label="Field B" name={'b'}
                       rules={[
                           {required: true, message: 'please input'},
                           {
                               type: "number",
                               message: 'please input number (1-10)',
                               min: 1,
                               max: 10,
                           }
                       ]}
            >
                <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item>
                <Space>
                    <SubmitButton form={form}/>
                    <Button htmlType="reset">Reset</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
export default Create;
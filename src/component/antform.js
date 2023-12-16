import React, {useEffect, useState} from "react";
import {
    Button,
    DatePicker, Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm, Space,
    Spin,
    Table,
    Tag,
    Typography,
    Upload
} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";

export const ImageUploadFormItem = ({value, onChange, category = 'image'}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(value);
    useEffect(() => {
        setImageUrl(value);
    }, [value]);
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            const {name, response} = info.file
            if (response.code === 200) {
                const fileObject = response.data[name];
                message.success("上传成功");
                setImageUrl(fileObject.filePath);
                onChange(fileObject.filePath);
            } else {
                message.error("上传失败")
            }
        }
        if (info.file.status === 'error') {
            console.log(info);
            message.error("上传失败（网络错误）")
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );
    const imgProps = {
        src: `${imagePrefix}/${imageUrl}`,
        alt: 'avatar',
        style: {
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }
    }
    return (<>
        <Spin spinning={loading}>
            <Upload
                accept={'image/*'}
                action="/backend/file/upload"
                name="file"
                data={{category: category}}
                withCredentials={true}
                listType="picture-card"
                showUploadList={false}
                onChange={handleChange}
            >
                {imageUrl ? (<img {...imgProps}/>) : (uploadButton)}
            </Upload>
        </Spin>
    </>)
}

export const SubmitButton = ({form, loading}) => {
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
export const CustomizeRequiredMark = (label, {required}) => (
    <>
        {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
        {label}
    </>
);

export const EditableCell = ({
                                 editRules,
                                 editing,
                                 dataIndex,
                                 title,
                                 editInputType,
                                 record,
                                 index,
                                 children,
                                 ...restProps
                             }) => {
    let initialRules = [{required: true, message: `Please Input ${title}!`},];
    let rules = editRules ? editRules : initialRules;
    let inputNode = <Input/>;
    if (editInputType === 'number') {
        inputNode = <InputNumber style={{width: '100%'}}/>
    }
    if (editInputType === 'date') {
        inputNode = <DatePicker format={'YYYY-MM-DD HH:mm:ss'}/>
    }
    if (editInputType === 'image') {
        inputNode = <ImageUploadFormItem category={'gift'}/>
    }
    let inputItem = <Form.Item name={dataIndex} style={{margin: 0,}} rules={rules}>
        {inputNode}
    </Form.Item>
    return (
        <td {...restProps}>
            {editing ? (inputItem) : (children)}
        </td>
    );
};

export const DataList = ({
                             searchData,
                             pagination,
                             setPagination,
                             initialColumns,
                             get_data,
                             update_data,
                             delete_data
                         }) => {
    const [tableLoading, setTableLoading] = useState(true);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    useEffect(() => {
        const params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
            ...searchData,
        };

        get_data(params).then(r => {
            if (r) {
                const {list, total} = r;
                setData(list);
                setPagination({...pagination, total});
                setTableLoading(false);
            }
        })
    }, [searchData, JSON.stringify(pagination)]);
    const isEditing = (record) => record.id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({...record});
        setEditingKey(record.id);
    };
    const cancelEdit = () => {
        setEditingKey('');
    };
    const delSuccessCallback = (record) => {
        const newData = [...data];
        const index = newData.findIndex((item) => record.id === item.id);
        if (index > -1) {
            newData.splice(index, 1,);
            setData(newData);
        }
    }
    const updateAction = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                await update_data({...item, ...row,});
                newData.splice(index, 1, {...item, ...row,});
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            message.error(errInfo.errorFields[0].errors);
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        ...initialColumns,
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const c1 = <span>
                    <Typography.Link onClick={() => updateAction(record.id)} style={{marginRight: 8,}}>
                    Save
                    </Typography.Link>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancelEdit}>
                    <a>Cancel</a>
                    </Popconfirm>
                </span>
                const c2 = <span>
                    <Typography.Link style={{marginRight: 8,}} disabled={editingKey !== ''}
                                     onClick={() => edit(record)}>
                    Edit
                    </Typography.Link>
                    <Popconfirm title="Sure to Delete?" disabled={editingKey !== ''}
                                onConfirm={() => delete_data(record, delSuccessCallback)}>
                        <Typography.Link disabled={editingKey !== ''}>
                        Delete
                        </Typography.Link>
                    </Popconfirm>
                </span>;
                return isEditing(record) ? c1 : c2;
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                editInputType: col.editInputType,
                editRules: col.editRules,
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                loading={tableLoading}
                bordered={true}
                size={'small'}
                rowKey={(record) => record.id}
                rowClassName="editable-row"
                columns={mergedColumns}
                dataSource={data}
                pagination={{
                    position: ['bottomRight'],
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    showTotal: (total, range) => `Total ${total} items`,
                    ...pagination,
                }}
                onChange={(_pagination, filters, sorter) => {
                    if (_pagination?.current) {
                        const {current, pageSize, total} = _pagination;
                        setPagination({..._pagination})
                    }
                }}
            />
        </Form>
    );
};

export const Create = ({initialFormItems, OnFinish}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        setLoading(true);
        if (OnFinish) {
            OnFinish(values).finally(() => {
                setLoading(false);
            })
        }
    }
    return (
        <Form
            autoComplete={"off"}
            form={form}
            layout="vertical"
            initialValues={{}}
            onFinish={onFinish}
            requiredMark={CustomizeRequiredMark}
        >
            {
                initialFormItems.map(e => {
                    return <Form.Item label={e.label} name={e.name} rules={e.rules} key={e.name}>
                        {e.input}
                    </Form.Item>
                })
            }
            <Form.Item shouldUpdate>
                <Space>
                    <SubmitButton form={form} loading={loading}/>
                    <Button htmlType="reset">Reset</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export function CreateButton({initialFormItems, onFinish}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <span>
            <Button type="primary" key="button" icon={<PlusOutlined/>}
                    onClick={() => setDrawerOpen(true)}>New</Button>
            <Drawer title="Basic Drawer" placement="right" destroyOnClose={true} size={'large'}
                    onClose={() => setDrawerOpen(false)} open={drawerOpen}>
                <Create initialFormItems={initialFormItems} OnFinish={onFinish}/>
            </Drawer>
        </span>
    );
}
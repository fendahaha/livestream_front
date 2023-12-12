import {clientBackendFetch} from "@/util/requestUtil";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {DatePicker, Form, Input, InputNumber, message, Popconfirm, Table, Typography} from "antd";
import React, {useEffect, useState} from "react";


const initialColumns = [
    {
        title: 'anchorSanwei',
        dataIndex: 'anchorSanwei',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'anchorHeight',
        dataIndex: 'anchorHeight',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'anchorWieght',
        dataIndex: 'anchorWieght',
        editable: true,
        editInputType: 'number',
    },
    {
        title: 'anchorRemark',
        dataIndex: 'anchorRemark',
        ellipsis: true,
        editable: true,
        // editRules: [],
        editInputType: 'text',
    },
    {
        title: 'anchorCreateAt',
        dataIndex: 'anchorCreateAt',
        editable: false,
        editInputType: 'date',
        render: (_, record) => _.format('YYYY-MM-DD HH:mm:ss')
    },
];
const get_data = (params) => {
    return clientBackendFetch.postJson('/anchor/list', params).then(r => {
        if (r?.data) {
            dayjs.extend(customParseFormat);
            const {list, total} = r.data;
            let d = list.map(r => {
                return {...r, anchorCreateAt: dayjs(r['anchorCreateAt'], "YYYY-MM-DD HH:mm:ss")}
            })
            return {list: d, total}
        }
    })
}
const update_data = async (item) => {
    item['giftCreateAt'] = item['giftCreateAt'].format("YYYY-MM-DD HH:mm:ss");
    await clientBackendFetch.postJson('/anchor/update', item).then(r => {
        if (r?.data) {
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const delete_data = (record, successCallback) => {
    clientBackendFetch.postJson('/anchor/delete', {id: record.id}).then(r => {
        if (r?.data) {
            if (successCallback) {
                successCallback(record)
            }
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const EditableCell = ({editRules, editing, dataIndex, title, editInputType, record, index, children, ...restProps}) => {
    let initialRules = [{required: true, message: `Please Input ${title}!`},];
    let rules = editRules ? editRules : initialRules;
    let inputNode = <Input/>;
    if (editInputType === 'number') {
        inputNode = <InputNumber style={{width: '100%'}}/>
    }
    if (editInputType === 'date') {
        inputNode = <DatePicker format={'YYYY-MM-DD HH:mm:ss'}/>
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
const DataList = ({searchData, pagination, setPagination}) => {
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

export default DataList;
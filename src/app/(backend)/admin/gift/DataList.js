import {clientBackendFetch} from "@/util/requestUtil";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {DatePicker, Form, Input, InputNumber, message, Popconfirm, Table, Typography} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {SearchFormContext} from "@/app/(backend)/admin/gift/page";

const get_data = (params) => {
    return clientBackendFetch.postJson('/gift/list', params).then(r => {
        if (r?.data) {
            const {list, pageNum, pageSize, total} = r.data;
            const pagination = {
                current: pageNum,
                pageSize: pageSize,
                total: total,
            }
            let d = list.map(r => {
                dayjs.extend(customParseFormat)
                return {...r, giftCreateAt: dayjs(r['giftCreateAt'], "YYYY-MM-DD HH:mm:ss")}
            })
            return {list: d, pagination}
        }
    })
}
const update_data = async (item) => {
    item['giftCreateAt'] = item['giftCreateAt'].format("YYYY-MM-DD HH:mm:ss");
    await clientBackendFetch.postJson('/gift/update', item).then(r => {
        if (r?.data) {
            message.success("success")
        } else {
            message.error("fail")
        }
    })
}
const delete_data = (record, successCallback) => {
    clientBackendFetch.postJson('/gift/delete', {id: record.id}).then(r => {
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
const EditableCell = ({editing, dataIndex, title, inputType, record, index, children, ...restProps}) => {
    let inputNode = <Input/>;
    if (inputType === 'number') {
        inputNode = <InputNumber/>
    }
    if (inputType === 'date') {
        inputNode = <DatePicker format={'YYYY-MM-DD HH:mm:ss'}/>
    }
    let inputItem = <Form.Item
        name={dataIndex}
        style={{margin: 0,}}
        rules={[
            {
                required: true,
                message: `Please Input ${title}!`,
            },
        ]}
    >
        {inputNode}
    </Form.Item>
    return (
        <td {...restProps}>
            {editing ? (
                inputItem
            ) : (
                children
            )}
        </td>
    );
};
const DataList = () => {
    const {searchData, setSearchData} = useContext(SearchFormContext);
    const [tableLoading, setTableLoading] = useState(true);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    });
    useEffect(() => {
        const params = {
            pageNum: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            ...searchData,
        };
        get_data(params).then(r => {
            console.log(1);
            const {list, pagination} = r;
            setData(list);
            setTableParams({pagination});
            setTableLoading(false);
        })
    }, [searchData]);
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
        {
            title: 'giftName',
            dataIndex: 'giftName',
            editable: true,
            inputType: 'text',
            ellipsis: true,
        },
        {
            title: 'giftValue',
            dataIndex: 'giftValue',
            editable: true,
            inputType: 'number',
        },
        {
            title: 'giftImage',
            dataIndex: 'giftImage',
            editable: true,
            inputType: 'text',
        },
        {
            title: 'giftOrder',
            dataIndex: 'giftOrder',
            editable: true,
            inputType: 'number',
        },
        {
            title: 'giftCreateAt',
            dataIndex: 'giftCreateAt',
            editable: false,
            inputType: 'date',
            render: (_, record) => _.format('YYYY-MM-DD HH:mm:ss')
        },
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
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
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
                    ...tableParams.pagination,
                }}
                onChange={(pagination, filters, sorter) => {
                    if (pagination?.current) {
                        const {current, pageSize, total} = pagination;
                        setTableLoading(true);
                        get_data({pageNum: current, pageSize}).then(r => {
                            const {list, pagination} = r;
                            setData(list);
                            setTableParams({pagination});
                        }).finally(() => setTableLoading(false))
                        // setTableParams({pagination: {...tableParams.pagination, current, pageSize, total}})
                    }
                }}
            />
        </Form>
    );
};

export default DataList;
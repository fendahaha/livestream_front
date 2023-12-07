'use client'
import React, {useCallback, useEffect, useState} from 'react';
import {App, List, Pagination, Space} from 'antd';
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {DeleteOutlined} from "@ant-design/icons";


const MyImage = ({data, delAction}) => {
    const {message} = App.useApp();
    let s = `${imagePrefix}/${data.fileUniqueName}`;
    return (
        <div style={{
            width: '120px',
            height: '120px',
            cursor: 'pointer',
            position: 'relative'
        }}>
            <img src={s} alt={'img'} style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }}/>
            <div style={{
                position: 'absolute',
                right: '5px',
                top: '0px',
                fontSize: '20px',
                display: 'inline-block',
                color: 'red',
            }}
                 onClick={() => {
                     clientBackendFetch.postJson("/file/deleteByUniqueNames", {fileUniqueNames: [data.fileUniqueName]})
                         .then(r => {
                             message.success(`${data.fileOriginalName} file delete successfully.`);
                             delAction(true);
                         })
                 }}
            >
                <DeleteOutlined/>
            </div>
        </div>
    )
}

function getData() {
    const data = [];
    for (let i = 0; i < 20; i++) {
        data.push({
            title: `Title ${i + 1}`,
        })
    }
    return data
}

export default function Component() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageParams, setPageParams] = useState({total: 0, current: 1, pageSize: 50});
    const [delStatus, setDelStatus] = useState(false);
    const delAction = useCallback(() => {
        setDelStatus(!delStatus)
    }, [delStatus]);
    useEffect(() => {
        setLoading(true);
        clientBackendFetch.getJson('/file/list', {pageNum: pageParams.current, pageSize: pageParams.pageSize})
            .then(r => {
                let total = r.data.total;
                let images = r.data.list;
                setPageParams({...pageParams, total: total});
                setImages(images);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [delStatus]);
    return (
        <div>
            <Pagination
                total={pageParams.total}
                showTotal={(total) => `Total ${total} items`}
                defaultPageSize={pageParams.pageSize}
                defaultCurrent={pageParams.current}
                pageSizeOptions={[10, 20, 50, 100]}
                onChange={(page, pageSize) => {
                    setLoading(true);
                    clientBackendFetch.getJson('/file/list', {pageNum: page, pageSize: pageSize}).then(r => {
                        let total = r.data.total;
                        let images = r.data.list;
                        setPageParams({...pageParams, current: page, pageSize: pageSize, total: total});
                        setImages(images);
                    }).finally(() => {
                        setLoading(false);
                    })
                }}
                style={{
                    marginBottom: '20px'
                }}
            />
            <List
                grid={{gutter: 12}}
                loading={loading}
                dataSource={images}
                renderItem={(item) => (
                    <List.Item>
                        <MyImage data={item} delAction={delAction}/>
                    </List.Item>
                )}
            />
        </div>
    );
}
'use client'
import {InboxOutlined} from '@ant-design/icons';
import {App, message, Upload} from 'antd';
import {backendFetch} from "@/util/requestUtil";

const {Dragger} = Upload;


export default function Component() {
    const {message} = App.useApp();
    const props = {
        accept: 'audio/*,video/*,image/*',
        name: 'file',
        multiple: true,
        action: '/backend/file/upload',
        listType: 'picture-card',
        withCredentials: true,
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
        onRemove: function (file) {
            let fileName = file.name;
            let res = JSON.parse(file.xhr.responseText);
            if (res.code === 200) {
                let fileUniqueName = res?.data[fileName]?.fileUniqueName;
                if (fileUniqueName) {
                    backendFetch.postJson("/file/deleteByUniqueNames", {fileUniqueNames: [fileUniqueName]})
                        .then(r => {
                            message.success(`${fileName} file delete successfully.`);
                        })
                }
            }
        },
    };
    return (
        <div>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
        </div>
    );
}
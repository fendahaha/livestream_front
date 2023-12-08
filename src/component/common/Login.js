'use client'
import {LockOutlined, MobileOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs, theme} from 'antd';
import {clientBackendFetch} from "@/util/requestUtil";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";

export default function Login({onSuccess}) {
    const {token} = theme.useToken();
    const [activeTab, setActiveTab] = useState("1");
    const items = [
        {
            'key': '1',
            'label': '登录',
            'children': <>
                <ProFormText
                    name="userName"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'用户名: admin or user'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="userPassword"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'}/>,
                        strengthText: 'Password should contain numbers, letters and special characters, at least 8 characters long.',
                        statusRender: (value) => {
                            const getStatus = () => {
                                if (value && value.length > 12) {
                                    return 'ok';
                                }
                                if (value && value.length > 6) {
                                    return 'pass';
                                }
                                return 'poor';
                            };
                            const status = getStatus();
                            if (status === 'pass') {
                                return (
                                    <div style={{color: token.colorWarning}}>
                                        强度：中
                                    </div>
                                );
                            }
                            if (status === 'ok') {
                                return (
                                    <div style={{color: token.colorSuccess}}>
                                        强度：强
                                    </div>
                                );
                            }
                            return (
                                <div style={{color: token.colorError}}>强度：弱</div>
                            );
                        },
                    }}
                    placeholder={'密码: ant.design'}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
            </>,
        },
        {
            'key': '2',
            'label': '注册',
            'children': <>
                <ProFormText
                    name="userName"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'用户名: admin or user'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="userPassword"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'}/>,
                        strengthText: 'Password should contain numbers, letters and special characters, at least 8 characters long.',
                        statusRender: (value) => {
                            const getStatus = () => {
                                if (value && value.length > 12) {
                                    return 'ok';
                                }
                                if (value && value.length > 6) {
                                    return 'pass';
                                }
                                return 'poor';
                            };
                            const status = getStatus();
                            if (status === 'pass') {
                                return (
                                    <div style={{color: token.colorWarning}}>
                                        强度：中
                                    </div>
                                );
                            }
                            if (status === 'ok') {
                                return (
                                    <div style={{color: token.colorSuccess}}>
                                        强度：强
                                    </div>
                                );
                            }
                            return (
                                <div style={{color: token.colorError}}>强度：弱</div>
                            );
                        },
                    }}
                    placeholder={'密码: ant.design'}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
                <ProFormText
                    name="userEmail"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'邮箱'}
                    rules={[
                        {
                            required: false,
                            message: '请输入邮箱!',
                        },
                    ]}
                />
                <ProFormText
                    name="userPhone"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'电话'}
                    rules={[
                        {
                            required: false,
                            message: '请输入电话!',
                        },
                    ]}
                />
            </>,
        },
    ];

    const finish = useCallback((data) => {
        console.log(data);
        if (activeTab === '1') {
            clientBackendFetch.postJson("/user/login", data)
                .then(d => {
                    if (d && d.data) {
                        if (onSuccess) {
                            message.success("登录成功");
                            onSuccess(d.data);
                        }
                    } else {
                        message.error("用户名或密码错误")
                    }
                })
        } else if (activeTab === '2') {
            clientBackendFetch.post("/user/register", data).then(res => {
                if (res.status === 200) {
                    message.success("注册成功");
                } else {
                    res.json().then(d => {
                        message.error(d.data)
                    })
                }
            }).catch(reason => {
                console.log(reason);
                message.error("未知错误")
            })
        }
    }, [activeTab, onSuccess])

    return (
        <ProConfigProvider hashed={false}>
            <div style={{backgroundColor: token.colorBgContainer}}>
                <LoginForm
                    logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                    title=""
                    subTitle=""
                    onFinish={finish}
                    submitter={{
                        searchConfig: {
                            submitText: activeTab === '1' ? '登录' : '注册',
                        },
                    }}
                >
                    <Tabs items={items} centered activeKey={activeTab}
                          onChange={(activeKey) => setActiveTab(activeKey)}/>
                    <div style={{marginBlockEnd: 24,}}>
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a style={{float: 'right',}}>
                            忘记密码
                        </a>
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};
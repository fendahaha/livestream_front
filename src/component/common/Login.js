'use client'
import {LockOutlined, MobileOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs, theme} from 'antd';
import {clientBackendFetch} from "@/util/requestUtil";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";
import {useMyLocale} from "@/component/context/localeContext";

export default function Login({onSuccess}) {
    const {getDict} = useMyLocale('Login');
    const {token} = theme.useToken();
    const [activeTab, setActiveTab] = useState("1");
    const common_items = <>
        <ProFormText
            name="userName"
            fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'}/>,
            }}
            placeholder={getDict('user_or_anchor')}
            rules={[
                {
                    required: true,
                    message: getDict('please_input_user_or_anchor'),
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
                        return <div style={{color: token.colorWarning}}>{getDict('normal')}</div>;
                    }
                    if (status === 'ok') {
                        return <div style={{color: token.colorSuccess}}>{getDict('strong')}</div>;
                    }
                    return <div style={{color: token.colorError}}>{getDict('weak')}</div>;
                },
            }}
            placeholder={getDict('password')}
            rules={[
                {
                    required: true,
                    message: getDict('please_input_password'),
                },
            ]}
        />
    </>;
    const items = [
        {
            'key': '1',
            'label': getDict('login'),
            'children': common_items,
        },
        {
            'key': '2',
            'label': getDict('register'),
            'children': <>
                {common_items}
                <ProFormText
                    name="userEmail"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={getDict('email')}
                    rules={[
                        {
                            required: false,
                            message: getDict('please_input_email'),
                        },
                    ]}
                />
                <ProFormText
                    name="userPhone"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={getDict('phone')}
                    rules={[
                        {
                            required: false,
                            message: getDict('please_input_phone'),
                        },
                    ]}
                />
            </>,
        },
    ];

    const finish = useCallback((data) => {
        if (activeTab === '1') {
            clientBackendFetch.postJson("/user/login", data)
                .then(d => {
                    if (d && d.data) {
                        message.success(getDict("login_success"));
                        if (onSuccess) {
                            onSuccess(d.data);
                        }
                    } else {
                        message.error(getDict("username_password_error"))
                    }
                })
        } else if (activeTab === '2') {
            clientBackendFetch.post("/user/registClient", data).then(res => {
                if (res.status === 200) {
                    message.success(getDict("register_success"));
                } else {
                    res.json().then(d => {
                        message.error(d.data)
                    })
                }
            }).catch(reason => {
                console.log(reason);
                message.error(getDict("unknown_error"))
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
                            submitText: activeTab === '1' ? getDict('login') : getDict('register'),
                        },
                    }}
                >
                    <Tabs items={items} centered activeKey={activeTab}
                          onChange={(activeKey) => setActiveTab(activeKey)}/>
                    {/*<div style={{marginBlockEnd: 24}}>*/}
                    {/*    <ProFormCheckbox noStyle name="autoLogin">*/}
                    {/*        自动登录*/}
                    {/*    </ProFormCheckbox>*/}
                    {/*    <a style={{float: 'right',}}>*/}
                    {/*        忘记密码*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};
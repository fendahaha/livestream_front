'use client'
import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import {Space, Tabs, message, theme, App} from 'antd';
import {useState} from 'react';
import {clientBackendFetch} from "@/util/requestUtil";

export default function Login() {
    const {token} = theme.useToken();
    const [loginType, setLoginType] = useState('phone');

    const items = [
        {
            'key': '1',
            'label': 'account',
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
                        strengthText:
                            'Password should contain numbers, letters and special characters, at least 8 characters long.',

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
            'label': 'phone',
            'children': <>
                <ProFormText
                    fieldProps={{
                        size: 'large',
                        prefix: <MobileOutlined className={'prefixIcon'}/>,
                    }}
                    name="mobile"
                    placeholder={'手机号'}
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号！',
                        },
                        {
                            pattern: /^1\d{10}$/,
                            message: '手机号格式错误！',
                        },
                    ]}
                />
                <ProFormCaptcha
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'}/>,
                    }}
                    captchaProps={{
                        size: 'large',
                    }}
                    placeholder={'请输入验证码'}
                    captchaTextRender={(timing, count) => {
                        if (timing) {
                            return `${count} ${'获取验证码'}`;
                        }
                        return '获取验证码';
                    }}
                    name="captcha"
                    rules={[
                        {
                            required: true,
                            message: '请输入验证码！',
                        },
                    ]}
                    onGetCaptcha={async () => {
                        message.success('获取验证码成功！验证码为：1234');
                    }}
                />
            </>,
        },
    ];

    const finish = (data) => {
        clientBackendFetch.postJson("/user/login", data)
            .then(d => {
                if (d) {
                    window.location = '/admin';
                } else {
                    message.error("用户名或密码错误")
                }
            })
    };

    return (
        <ProConfigProvider hashed={false}>
            <div style={{backgroundColor: token.colorBgContainer}}>
                <LoginForm
                    logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                    title="JiuZhou"
                    subTitle="your personal assistant"
                    actions={
                        <Space>
                            {/*其他登录方式*/}
                            {/*<AlipayCircleOutlined style={iconStyles}/>*/}
                            {/*<TaobaoCircleOutlined style={iconStyles}/>*/}
                            {/*<WeiboCircleOutlined style={iconStyles}/>*/}
                        </Space>
                    }
                    onFinish={finish}
                >
                    <Tabs items={items} centered/>
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
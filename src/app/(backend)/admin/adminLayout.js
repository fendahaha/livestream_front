'use client'
import {usePathname, useRouter} from "next/navigation";
import defaultProps from "@/app/(backend)/admin/adminLayoutProps";
import {App, Dropdown, message} from "antd";
import {GithubFilled, InfoCircleFilled, LogoutOutlined, QuestionCircleFilled} from "@ant-design/icons";
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import Link from "next/link";
import {logout} from "@/app/_func/client";
import {useContext} from "react";
import {GlobalContext} from "@/app/(front)/component/globalContext";
import {imagePrefix} from "@/util/requestUtil";

export default function AdminLayout({children}) {
    const {userInfo, updateUserInfo} = useContext(GlobalContext);
    const {user, anchor, client} = userInfo;
    const s = usePathname();
    const router = useRouter();
    const props = {
        siderWidth: 216,
        avatarProps: {
            src: `${imagePrefix}/${user.userAvatar}`,
            title: user.userDisplayName,
            size: 'small',
            render: (props, dom) => {
                return (
                    <Dropdown
                        menu={{
                            items: [{
                                key: 'logout', icon: <LogoutOutlined/>, label: '退出登录',
                                onClick: () => {
                                    logout(() => {
                                        message.success("已退出登录");
                                        router.refresh();
                                    });
                                },
                            }]
                        }}
                    >
                        {dom}
                    </Dropdown>
                );
            },
        },
        ...defaultProps,
        location: {pathname: s},
        actionsRender: (props) => {
            if (props.isMobile) return [];
            return [
                <InfoCircleFilled key="InfoCircleFilled"/>,
                <QuestionCircleFilled key="QuestionCircleFilled"/>,
                <GithubFilled key="GithubFilled"/>,
            ];
        },
        menuItemRender: (item, dom) => (
            <Link href={item.path}>
                {dom}
            </Link>
        )
    };
    return (
        <div id="test-pro-layout" style={{height: '100vh'}}>
            <App>
                <ProLayout {...props}>
                    <PageContainer>
                        <ProCard>
                            {children}
                        </ProCard>
                    </PageContainer>
                </ProLayout>
            </App>
        </div>
    );
}
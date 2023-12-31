'use client'
import {usePathname, useRouter} from "next/navigation";
import {get_defaultProps} from "@/app/(backend)/admin/adminLayoutProps";
import {App, Dropdown, message} from "antd";
import {GithubFilled, InfoCircleFilled, LogoutOutlined, QuestionCircleFilled} from "@ant-design/icons";
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import Link from "next/link";
import {logout} from "@/app/_func/client";
import {useContext} from "react";
import {GlobalContext} from "@/component/context/globalContext";
import {imagePrefix} from "@/util/requestUtil";
import {useMyLocale} from "@/component/context/localeContext";

export default function AdminLayout({children}) {
    const {getDict}=useMyLocale('AdminLayout');
    const {user, updateUser} = useContext(GlobalContext);
    const s = usePathname();
    const router = useRouter();
    const props = {
        siderWidth: 216,
        avatarProps: {
            src: `${imagePrefix}/${user.userAvatar}`,
            title: user?.userDisplayName,
            size: 'small',
            render: (props, dom) => {
                return (
                    <Dropdown
                        menu={{
                            items: [{
                                key: 'logout', icon: <LogoutOutlined/>, label: getDict('logout'),
                                onClick: () => {
                                    logout(() => {
                                        message.success(getDict("logout_success"));
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
        ...get_defaultProps(getDict),
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
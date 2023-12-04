'use client'
import {usePathname} from "next/navigation";
import defaultProps from "@/app/(backend)/admin/adminLayoutProps";
import {Dropdown} from "antd";
import {GithubFilled, InfoCircleFilled, LogoutOutlined, QuestionCircleFilled} from "@ant-design/icons";
import {PageContainer, ProCard, ProLayout} from "@ant-design/pro-components";
import Link from "next/link";

export default function AdminLayout({children}) {
    let s = usePathname();
    const props = {
        siderWidth: 216,
        avatarProps: {
            src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
            title: '七妮妮',
            size: 'small',
            render: (props, dom) => {
                return (
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'logout',
                                    icon: <LogoutOutlined/>,
                                    label: '退出登录',
                                    onClick: () => {
                                        console.log(1);
                                    }
                                },
                            ],
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
            <ProLayout {...props}>
                <PageContainer>
                    <ProCard>
                        {children}
                    </ProCard>
                </PageContainer>
            </ProLayout>
        </div>
    );
}
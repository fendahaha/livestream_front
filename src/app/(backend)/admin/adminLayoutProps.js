import {ChromeFilled, SmileFilled,} from '@ant-design/icons';

const defaultProps = {
    route: {
        path: '/admin',
        routes: [
            {
                path: '/admin',
                name: 'admin',
                icon: <SmileFilled/>,
            },
            {
                path: '/admin/media',
                name: 'media',
                icon: <SmileFilled/>,
                routes: [
                    {
                        path: 'list',
                        name: 'list',
                        icon: <SmileFilled/>,
                    },
                    {
                        path: 'upload',
                        name: 'upload',
                        icon: <SmileFilled/>,
                    },
                ]
            },
            {
                path: '/admin/gift',
                name: 'gift',
                icon: <SmileFilled/>,
            },
            {
                path: '/admin/anchor',
                name: 'anchor',
                icon: <SmileFilled/>,
            },
            {
                path: '/admin/gift_send_record',
                name: 'giftSendRecord',
                icon: <SmileFilled/>,
            },
            {
                path: '/admin/client',
                name: 'client',
                icon: <SmileFilled/>,
            },
            {
                path: 'http://localhost:3000',
                name: '网站首页',
                icon: <ChromeFilled/>,
            },
        ],
    },
    location: {
        pathname: '/',
    },
    appList: [
        {
            icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
            title: 'Ant Design',
            desc: '杭州市较知名的 UI 设计语言',
            url: 'https://ant.design',
        },
        {
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
            title: 'AntV',
            desc: '蚂蚁集团全新一代数据可视化解决方案',
            url: 'https://antv.vision/',
            target: '_blank',
        },
        {
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
            title: 'Pro Components',
            desc: '专业级 UI 组件库',
            url: 'https://procomponents.ant.design/',
        },
    ],
};

export default defaultProps;
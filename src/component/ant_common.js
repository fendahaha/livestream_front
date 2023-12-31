import {Button, ConfigProvider, Empty, Tooltip, Typography} from "antd";
import React from "react";
import {HeartOutlined} from "@ant-design/icons";

export default function MyEmpty(props) {
    return <Empty description={false} {...props}/>
}

export const MyCopyableToolTip = ({children, text}) => {
    let e = <Typography.Paragraph copyable style={{color: "white"}}>{text}</Typography.Paragraph>;
    return <Tooltip placement="top" title={e}>
        {children}
    </Tooltip>;
}

export const SubscribeButton = ({children, ...props}) => {
    return (
        <Button type="primary" shape={'round'} icon={<HeartOutlined/>}
                style={{backgroundColor: '#FF7575'}} {...props}>{children}</Button>
    )
}
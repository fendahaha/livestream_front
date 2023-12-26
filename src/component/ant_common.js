import {Empty, Tooltip, Typography} from "antd";
import React from "react";

export default function MyEmpty(props) {
    return <Empty description={false} {...props}/>
}

export const MyCopyableToolTip = ({children, text}) => {
    let e = <Typography.Paragraph copyable style={{color: "white"}}>{text}</Typography.Paragraph>;
    return <Tooltip placement="top" title={e}>
        {children}
    </Tooltip>;
}
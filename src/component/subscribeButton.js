import {userTypeUtil} from "@/util/commonUtil";
import {followAnchor, unfollowAnchor} from "@/app/_func/client";
import {Button, message} from "antd";
import {DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import React from "react";

export const SubscribeButton = ({children, clientUserType, clientUserUuid, anchorUserUuid, ...props}) => {
    const follow = () => {
        if (clientUserType && clientUserUuid) {
            if (userTypeUtil.is_client(clientUserType)) {
                followAnchor(clientUserUuid, anchorUserUuid).then(r => {
                    if (r) {
                        message.success("Followed!");
                    } else {
                        message.info("fail");
                    }
                })
            } else {
                message.info("only client can follow!");
            }
        } else {
            message.info("please login!");
        }
    }
    return (
        <Button danger shape={'round'} icon={<LikeOutlined/>} onClick={follow}
                style1={{backgroundColor: '#FF7575', color: 'white'}} {...props}>{children}</Button>
    )
}

export const UnSubscribeButton = ({children, clientUserType, clientUserUuid, anchorUserUuid, ...props}) => {
    const follow = () => {
        if (clientUserType && clientUserUuid) {
            if (userTypeUtil.is_client(clientUserType)) {
                unfollowAnchor(clientUserUuid, anchorUserUuid).then(r => {
                    if (r) {
                        message.success("Unfollowed!");
                    } else {
                        message.info("fail");
                    }
                })
            } else {
                message.info("only client can UnFollow!");
            }
        } else {
            message.info("please login!");
        }
    }
    return (
        <Button danger shape={'round'} icon={<DislikeOutlined/>} onClick={follow}
                {...props}>{children}</Button>
    )
}
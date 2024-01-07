'use client'
import {userTypeUtil} from "@/util/commonUtil";
import {followAnchor, unfollowAnchor} from "@/app/_func/client";
import {Button, message} from "antd";
import {DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import React, {useContext, useState} from "react";

export const SubscribeContext = React.createContext({value: null, update: null});
export const SubscribeContextManager = ({children}) => {
    const [value, setValue] = useState(null);
    return (
        <SubscribeContext.Provider value={{value: value, update: setValue}}>
            {children}
        </SubscribeContext.Provider>
    )
}
export const SubscribeButton = ({children, clientUserType, clientUserUuid, anchorUserUuid, ...props}) => {
    const subscribeContext = useContext(SubscribeContext);
    const follow = () => {
        if (clientUserType && clientUserUuid) {
            if (userTypeUtil.is_client(clientUserType)) {
                followAnchor(clientUserUuid, anchorUserUuid).then(r => {
                    if (r) {
                        message.success("Followed!");
                        if (subscribeContext?.update) {
                            subscribeContext.update({clientUserUuid, anchorUserUuid})
                        }
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
    const style = {backgroundColor: '#FF7575', color: 'white'};
    return (
        <Button danger shape={'round'} icon={<LikeOutlined/>} onClick={follow} {...props}>{children}</Button>
    )
}

export const UnSubscribeButton = ({children, clientUserType, clientUserUuid, anchorUserUuid, ...props}) => {
    const subscribeContext = useContext(SubscribeContext);
    const follow = () => {
        if (clientUserType && clientUserUuid) {
            if (userTypeUtil.is_client(clientUserType)) {
                unfollowAnchor(clientUserUuid, anchorUserUuid).then(r => {
                    if (r) {
                        message.success("Unfollowed!");
                        if (subscribeContext?.update) {
                            subscribeContext.update({clientUserUuid, anchorUserUuid})
                        }
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

export const SmallScribeButton = ({clientUserType, clientUserUuid, anchorUserUuid}) => {
    const subscribeContext = useContext(SubscribeContext);
    const follow = () => {
        if (clientUserType && clientUserUuid) {
            if (userTypeUtil.is_client(clientUserType)) {
                followAnchor(clientUserUuid, anchorUserUuid).then(r => {
                    if (r) {
                        message.success("Followed!");
                        if (subscribeContext?.update) {
                            subscribeContext.update({clientUserUuid, anchorUserUuid})
                        }
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
    const styles = {
        width: '28px',
        height: '28px',
        borderRadius: '14px',
        color: 'white',
        backgroundColor: '#FF7575',
        textAlign: 'center',
        overflow: 'hidden',
        fontSize: '24px',
        lineHeight: '28px',
        cursor: 'pointer',
    }
    return <span style={styles} onClick={follow}>+</span>
}
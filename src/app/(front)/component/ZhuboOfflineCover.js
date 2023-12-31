import React, {useContext, useEffect, useMemo, useState} from "react";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {Image, Modal} from "antd";
import styles from './ZhuboOfflineCover.module.css';
import {get_attribute_of_anchorConfig} from "@/app/_func/client";
import MyEmpty from "@/component/ant_common";
import {GlobalContext} from "@/component/context/globalContext";
import {SubscribeButton} from "@/component/subscribeButton";

const OfflineCoverHeader = ({anchor, anchorUser}) => {
    const {user} = useContext(GlobalContext);
    const anchorSanwei = get_attribute_of_anchorConfig(anchor.anchorConfig, 'anchorSanwei', '')
    const anchorHeight = get_attribute_of_anchorConfig(anchor.anchorConfig, 'anchorHeight', '')
    const anchorWieght = get_attribute_of_anchorConfig(anchor.anchorConfig, 'anchorWieght', '')
    return (
        <>
            <div className={'header'}>
                <div className={'avatar'}><img src={`${imagePrefix}/${anchorUser.userAvatar}`} alt={''}/></div>
                <div className={'info'}>
                    <h2 className={'anchorName'}>
                        <span>{anchorUser.userDisplayName}</span>
                        <img src={'/country/tw.svg'} alt={''} className={'country'}/>
                    </h2>
                    <div className={'detail'}>
                        <p><span className={'subscript'}>178</span>subscribe</p>
                        <p className={'config'}>
                            三维<span>{anchorSanwei}</span>
                            身高<span>{anchorHeight}cm</span>
                            体重<span>{anchorWieght}kg</span>
                        </p>
                        <p>{anchor.anchorRemark}</p>
                    </div>
                </div>
                <div className={'buttons'}>
                    <SubscribeButton clientUserType={user?.userType}
                                     clientUserUuid={user?.userUuid}
                                     anchorUserUuid={anchorUser.userUuid}>
                        Subscribe
                    </SubscribeButton>
                </div>
            </div>
            <style jsx>{`
              .header {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
              }

              .avatar {
                flex: 0 0 auto;
                width: 140px;
                position: relative;
                background-color: #755757;
                border-radius: 50%;
                overflow: hidden;
              }

              .avatar:after {
                content: '';
                display: block;
                margin-top: 100%;
              }

              .avatar img {
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                object-fit: cover;
              }

              .info {
                flex: 1 1 auto;
                padding: 0 20px;
              }

              .buttons {
                flex: 0 0 100px;
              }

              .config span {
                margin: 0 5px;
                font-weight: 700;
              }

              .detail {
                font-size: 16px;
              }

              .subscript {
                font-weight: 700;
                font-size: 18px;
                margin-right: 5px;
              }

              .country {
                width: 24px;
                height: 24px;
                object-fit: cover;
                border-radius: 12px;
                margin: 0 5px;
              }

              .anchorName {
                display: flex;
                align-items: center;
              }
            `}</style>
        </>
    )
}
export const ImagesModal = ({children, userUuid}) => {
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState(null);
    useEffect(() => {
        if (open && !anchor) {
            clientBackendFetch.formPostJson("/anchor/query_by_useruuid", {user_uuid: userUuid})
                .then(r => {
                    if (r && r.data) {
                        setAnchor(r.data)
                    }
                })
        }
    }, [anchor, open, userUuid]);
    const images = useMemo(() => {
        if (anchor) {
            let covers = get_attribute_of_anchorConfig(anchor.anchorConfig, 'covers', []);
            if (covers.length > 0) {
                let image_list = covers.map(e => {
                    return (<div className={styles.item} key={e}>
                        <Image src={`${imagePrefix}/${e}`} rootClassName={styles.item_image}
                               className={styles.item_image2}/>
                    </div>)
                })
                return <Image.PreviewGroup>
                    <div className={styles.list}>
                        {image_list}
                    </div>
                </Image.PreviewGroup>
            }
        }
        return <div className={styles.empty_container}>
            <MyEmpty/>
        </div>;
    }, [anchor]);

    const props = {
        centered: false,
        title: anchor ? <OfflineCoverHeader anchor={anchor} anchorUser={anchor.user}/> : '',
        footer: null,
        open: open,
        destroyOnClose: true,
        onCancel: () => setOpen(false),
        width: 1000,
    }
    return (
        <>
            {children ? React.cloneElement(children, {onClick: () => setOpen(true)}) : ''}
            <Modal {...props}>
                {images}
            </Modal>
        </>
    )
}
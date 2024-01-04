import styles from "@/component/player/flv_container.module.css";
import {LoadingOutlined} from "@ant-design/icons";

export const MyLoading = ({isLoading = true}) => {
    return (
        <>
            {isLoading ?
                <div className={styles.loading}>
                    <LoadingOutlined/>
                </div>
                : ''
            }
        </>
    )
}
import {LoadingOutlined} from "@ant-design/icons";

export const MyLoading = ({isLoading = true}) => {
    const styles = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
    }
    return (
        <>
            {isLoading ?
                <div style={styles}>
                    <LoadingOutlined/>
                </div>
                : ''
            }
        </>
    )
}
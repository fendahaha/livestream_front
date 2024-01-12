'use client'
import {useMemo, useState} from "react";
import {Button, Input} from "antd";
import styles from "@/app/(front)/test/rtc2/live/page.module.css";
import FlvContainer from "@/component/player/FlvContainer";
import {FixWidthDiv} from "@/component/common/WidthDiv";

export default function Component() {
    const [url, setUrl] = useState('');
    const [streamUrl, setStreamUrl] = useState(url)
    const flvPlay = useMemo(() => {
        if (streamUrl) {
            return <FlvContainer url={streamUrl}/>
        }
    }, [streamUrl]);
    const props = {
        value: url,
        onChange: (e) => {
            setUrl(e.target.value)
        },
    }
    const play = () => {
        setStreamUrl(url)
    }
    return (
        <FixWidthDiv>
            <div>
                <div>http://localhost:8080/live/7ad3ab11857348ac9a0e9e1481a40085.flv</div>
                <div style={{margin: '0 auto'}}>
                    <Input {...props}/>
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={play}>play</Button>
                </div>
                <div style={{height: '500px', margin: '0 auto'}}>
                    {flvPlay}
                </div>
            </div>
        </FixWidthDiv>
    );
}
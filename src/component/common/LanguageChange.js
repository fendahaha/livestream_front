'use client'
import {Button, Dropdown, Tooltip} from "antd";
import {setLocaleCookie, supportLocales} from "@/dictionaries";
import {GlobalOutlined} from "@ant-design/icons";

export default function LanguageChange() {
    const languages = supportLocales;
    const onClick = (lang) => {
        setLocaleCookie(lang);
        window.location.reload()
    }
    const items = languages.map(e => (
        {
            key: e,
            label: (
                <Button block={true} onClick={() => onClick(e)}>{e}</Button>
            )
        }
    ))
    const style = {
        margin: '0 5px',
        cursor: 'pointer',
        fontSize: '29px',
        color: '#7CA43C'
    }
    return (
        <Dropdown placement="bottomLeft" arrow menu={{items: items}}>
            <Tooltip placement={"right"} title="choose language">
                <span style={style}>
                    <GlobalOutlined/>
                </span>
            </Tooltip>
        </Dropdown>
    );
}
'use client'
import {Button, Dropdown, Tooltip} from "antd";
import {setLocaleCookie, supportLocales} from "@/dictionaries";
import {GlobalOutlined} from "@ant-design/icons";
import {useMyLocale} from "@/component/context/localeContext";

export default function LanguageChange() {
    const {locale} = useMyLocale();
    const languages = supportLocales;
    const onClick = (lang) => {
        setLocaleCookie(lang);
        window.location.reload()
    }
    const items = languages.map(e => (
        {
            key: e,
            label: (
                <Tooltip placement={"right"} title={e.title}>
                    <Button block={true} type={e.name === locale ? 'primary' : 'text'}
                            onClick={() => onClick(e.name)}>{e.title}</Button>
                </Tooltip>
            )
        }
    ))
    const style = {
        margin: '0 5px',
        cursor: 'pointer',
        fontSize: '29px',
        color: '#1677ff',
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
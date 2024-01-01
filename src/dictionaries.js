import Negotiator from "negotiator";
import {match} from "@formatjs/intl-localematcher";
import Cookies from "js-cookie";

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    zh: () => import('./dictionaries/zh.json').then((module) => module.default),
    vi: () => import('./dictionaries/vi.json').then((module) => module.default),
    th: () => import('./dictionaries/th.json').then((module) => module.default),
    id: () => import('./dictionaries/id.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()

/**
 * getLocale
 * */
//id:印度尼西亚 th:泰国 vi:越南
export const supportLocales = [
    {name: 'en', title: 'English'},
    {name: 'zh', title: '中文'},
    {name: 'vi', title: 'Tiếng Việt'},
    {name: 'th', title: 'แบบไทย'},
    {name: 'id', title: 'Melayu'},
]
export const defaultLocale = 'en';

export function getLocale(locale_cookie, headers) {
    const locales = supportLocales.map(e => e.name);
    if (locale_cookie) {
        if (locales.indexOf(locale_cookie) > -1) {
            return locale_cookie
        } else {
            return defaultLocale
        }
    }
    let locale = defaultLocale;
    try {
        // let headers = {'accept-language': 'en-US,zh-CN;q=0.5'}
        let languages = new Negotiator({headers}).languages()
        // const strings = LookupSupportedLocales(supportLocales, languages);
        locale = match(languages, locales, defaultLocale, {algorithm: 'lookup'})
    } catch (e) {
        // console.log(e);
    }
    return locale
}


/**
 * locale cookie
 * */
export const locale_cookie_config = {
    attribute: {expires: 1, path: '/', sameSite: 'strict'},
    cookie_name: 'fenda-locale',
}

export function setLocaleCookie(locale) {
    Cookies.set(locale_cookie_config.cookie_name, locale, locale_cookie_config.attribute)
}
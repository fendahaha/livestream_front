import Negotiator from "negotiator";
import {match} from "@formatjs/intl-localematcher";

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    zh: () => import('./dictionaries/zh.json').then((module) => module.default),
    vi: () => import('./dictionaries/vi.json').then((module) => module.default),
    th: () => import('./dictionaries/th.json').then((module) => module.default),
    id: () => import('./dictionaries/id.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()

// export const getDictionary = async (locale) => {
//     return import(`@/dictionaries/${locale}.json`).then((module) => module.default)
// }

/**
 * getLocale
 * */
export const supportLocales = ['en', 'zh', 'vi', 'th', 'id']//id:印度尼西亚 th:泰国 vi:越南
export const defaultLocale = 'en';

export function getLocale(headers) {
    // let headers = {'accept-language': 'en-US,zh-CN;q=0.5'}
    let languages = new Negotiator({headers}).languages()
    // const strings = LookupSupportedLocales(supportLocales, languages);
    let locale = defaultLocale;
    try {
        locale = match(languages, supportLocales, defaultLocale, {algorithm: 'lookup'})
    } catch (e) {
        // console.log(e);
    }
    // console.log(locale);
    return locale
}
'use client'
import {createContext, useCallback, useContext, useEffect, useState} from "react";

const contextDefaultValue = {locale: null, dictionary: null};
export const LocaleContext = createContext(contextDefaultValue);
export default function LocaleContextManager({children, locale, dictionary}) {
    const [_locale, setLocale] = useState(locale);
    const [_dictionary, setDictionary] = useState(dictionary);
    return (
        <LocaleContext.Provider value={{locale: _locale, dictionary: _dictionary}}>
            {children}
        </LocaleContext.Provider>
    )
}

function get_dictionary_value(dictionary, ...args) {
    try {
        let r = args.reduce((prev, curr) => {
            return prev[curr]
        }, dictionary)
        return r ? r : ''
    } catch (e) {
        return ''
    }
}

export function useMyLocale(...suffix) {
    const {locale, dictionary} = useContext(LocaleContext);
    const getDict = useCallback((...args) => get_dictionary_value(dictionary, ...suffix, ...args), [dictionary, suffix])
    return {locale, dictionary, getDict}
}
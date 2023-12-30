'use client'
import {createContext, useEffect, useState} from "react";

const contextDefaultValue = {locale: null, dictionary: null};
export const LocaleContext = createContext(contextDefaultValue);
export default function LocaleContextManager({children, locale, dictionary}) {
    const [_locale, setLocale] = useState(locale);
    const [_dictionary, setDictionary] = useState(dictionary);
    useEffect(()=>{
        console.log(_locale);
    })
    return (
        <LocaleContext.Provider value={{locale: _locale, dictionary: _dictionary}}>
            {children}
        </LocaleContext.Provider>
    )
}
'use client'
import {createContext, useContext} from "react";

export const MobilePageContext = createContext({isIos: false});
export const MobilePageContextManager = ({children, isIos}) => {
    return (
        <MobilePageContext.Provider value={{isIos: isIos}}>
            {children}
        </MobilePageContext.Provider>
    )
}
export const useMobilePageContext = () => {
    const {isIos} = useContext(MobilePageContext);
    return {isIos}
}


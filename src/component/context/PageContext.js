'use client'
import {createContext, useContext} from "react";

export const RoomPageContext = createContext({isIos: false});
export const RoomPageContextManager = ({children, isIos}) => {
    return (
        <RoomPageContext.Provider value={{isIos: isIos}}>
            {children}
        </RoomPageContext.Provider>
    )
}
export const useRoomPageContext = () => {
    const {isIos} = useContext(RoomPageContext);
    return {isIos}
}


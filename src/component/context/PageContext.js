'use client'
import {createContext, useContext} from "react";

export const RoomPageContext = createContext({isIos: false});
export const useRoomPageContext = () => {
    const roomPageContext = useContext(RoomPageContext);
    return roomPageContext
}
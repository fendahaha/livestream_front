'use client'
import {createContext, useMemo, useReducer, useState} from "react";

const globalContextDefaultValue = {userInfo: {user: null, anchor: null, client: null}, updateUserInfo: null};
export const GlobalContext = createContext(globalContextDefaultValue);

export function GlobalContextManager({children, userInfo}) {
    const [user_info, dispatchU] = useReducer((prevState, action) => {
        const {user, anchor, client} = prevState
        const _action = action.action;
        const _data = action.data;
        if (_action === 'updateUser') {
            for (const dataKey in _data) {
                user[dataKey] = _data[dataKey]
            }
            return {...prevState, user}
        }
        if (_action === 'updateAnchor') {
            for (const dataKey in _data) {
                anchor[dataKey] = _data[dataKey]
            }
            return {...prevState, anchor}
        }
        if (_action === 'updateClient') {
            for (const dataKey in _data) {
                client[dataKey] = _data[dataKey]
            }
            return {...prevState, client}
        }
        if (_action === 'replace') {
            if (_data) {
                return {..._data}
            }
            return globalContextDefaultValue
        }
    }, userInfo, r => {
        return r ? r : globalContextDefaultValue
    });

    const contextValue = useMemo(() => {
        return {userInfo: user_info, updateUserInfo: dispatchU}
    }, [user_info]);
    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    )
}
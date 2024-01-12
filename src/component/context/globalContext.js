'use client'
import {createContext, useContext, useMemo, useReducer} from "react";

const globalContextDefaultValue = {user: null, updateUser: null};
export const GlobalContext = createContext(globalContextDefaultValue);

export function GlobalContextManager({children, userInfo}) {
    const [user, updateUser] = useReducer((prevState, action) => {
        const _action = action.action;
        const _data = action.data;
        if (_action === 'update') {
            for (const dataKey in _data) {
                prevState[dataKey] = _data[dataKey]
            }
            return {...prevState}
        }
        if (_action === 'replace') {
            return _data
        }
    }, userInfo, r => r);

    const contextValue = useMemo(() => {
        return {user, updateUser}
    }, [user]);
    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useLoginUser() {
    const userContext = useContext(GlobalContext);
    return {user: userContext?.user, updateUser: userContext?.updateUser}
}
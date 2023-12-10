'use client'
import {createContext, useMemo, useReducer} from "react";

export const GlobalContext = createContext({user: null, updateUser: null});

export function GlobalContextManager({children, user}) {
    const [u, dispatchU] = useReducer((prevState, action) => {
        const _action = action.action;
        const _data = action.data;
        if (_action === 'update') {
            for (const dataKey in _data) {
                prevState[dataKey] = _data[dataKey]
            }
            return {...prevState}
        }
        if (_action === 'replace') {
            return {..._data}
        }
    }, user, r => r);
    const contextValue = useMemo(() => {
        return {user: u, updateUser: dispatchU}
    }, [u]);
    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    )
}
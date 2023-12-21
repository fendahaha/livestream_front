import 'server-only'
import {headers} from "next/headers";
import {clientBackendFetch, nodeBackendFetch} from "@/util/requestUtil";

export const setHeaderParam = (headers, params) => {
    const requestHeaders = new Headers(headers);
    for (const paramKey in params) {
        requestHeaders.set(paramKey, params[paramKey]);
    }
    return requestHeaders
}
export const getHeaderParam = (paramName) => {
    const headersList = headers()
    return headersList.get(paramName)
}

export async function getLoginUser() {
    const headersInstance = headers();
    const cookieHeaderValue = headersInstance.get("cookie");
    return await nodeBackendFetch.post('/user/getLoginUser', null, {cookie: cookieHeaderValue})
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(r => {
            if (r) {
                return r.data
            }
        })
}

export const get_anchors = async () => {
    const list = await nodeBackendFetch.postJson("/anchor/allAnchors").then(r => r?.data)
    return list ? list : []
}
export const get_rank_anchors = async () => {
    const list = await nodeBackendFetch.postJson("/anchor/rank").then(r => r?.data)
    return list ? list : []
}

export const is_room_online = async (room_uuid) => {
    return nodeBackendFetch.formPostJson("/room/is_online", {room_uuid}).then(r => r?.data)
}

export const queryAnchorByRoomUuid = (room_uuid) => {
    return nodeBackendFetch.formPostJson("/anchor/query", {room_uuid}).then(r => r?.data)
}

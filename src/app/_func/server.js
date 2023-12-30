import 'server-only'
import {headers} from "next/headers";
import {nodeBackendFetch} from "@/util/requestUtil";
import {getDictionary, getLocale} from "@/dictionaries";

export async function getLocaleInfo() {
    const headers1 = headers();
    const locale = getLocale({'accept-language': headers1.get("accept-language")});
    const dictionary = await getDictionary(locale);
    return {locale, dictionary}
}

export async function getLoginUser() {
    const headersInstance = headers();
    const cookieHeaderValue = headersInstance.get("cookie");
    return await nodeBackendFetch.postJson('/user/getLoginUser', null, {cookie: cookieHeaderValue})
        .then(r => r?.data)
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

import 'server-only'
import {cookies, headers} from "next/headers";
import {nodeBackendFetch} from "@/util/requestUtil";
import {getDictionary, getLocale, locale_cookie_config} from "@/dictionaries";

export async function getLocaleInfo() {
    const accept_language = headers().get("accept-language");
    const locale_cookie = cookies().get(locale_cookie_config.cookie_name)
    const locale = getLocale(locale_cookie?.value, {'accept-language': accept_language});
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

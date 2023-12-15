// 'use client'
import Room from "@/app/(front)/room/[room_uuid]/room";
import {redirect} from "next/navigation";
import {nodeBackendFetch} from "@/util/requestUtil";
import {headers} from "next/headers";

const is_online = async (room_uuid) => {
    return nodeBackendFetch.formPostJson("/room/is_online", {room_uuid}).then(r => {
        if (r && r.data) {
            return r.data
        }
    })
}

export default async function Page() {
    const headersList = headers()
    const room_uuid = headersList.get('room_uuid')
    if (await is_online(room_uuid)) {
        return <Room uuid={room_uuid}></Room>
    } else {
        redirect("/");
    }
}
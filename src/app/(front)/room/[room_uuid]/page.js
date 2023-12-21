import Room from "@/app/(front)/room/[room_uuid]/room";
import {redirect} from "next/navigation";
import {getHeaderParam, is_room_online, queryAnchorByRoomUuid} from "@/app/_func/server";
import {streamServer} from "@/util/requestUtil";


export default async function Page() {
    const room_uuid = getHeaderParam('room_uuid');
    if (await is_room_online(room_uuid)) {
        const anchor = await queryAnchorByRoomUuid(room_uuid);
        if (anchor) {
            const anchorUser = anchor.user;
            const room = anchor.room;
            const streamUrl = `${streamServer}${room.streamAddress}.flv?${room.streamParam}`;
            const topic = `/topic/${room_uuid}`;
            return <Room uuid={room_uuid} anchor={anchor} anchorUser={anchorUser} room={room} streamUrl={streamUrl}
                         topic={topic}></Room>
        } else {
            redirect("/");
        }
    } else {
        redirect("/");
    }
}
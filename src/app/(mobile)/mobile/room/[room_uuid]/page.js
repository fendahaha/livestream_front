import {is_room_online, queryAnchorByRoomUuid} from "@/app/_func/server";
import {streamServer} from "@/util/requestUtil";
import {redirect} from "next/navigation";
import Room from "@/app/(mobile)/mobile/room/[room_uuid]/Room";

export default async function Component({params}) {
    const room_uuid = params['room_uuid'];
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
            redirect("/mobile");
        }
    } else {
        redirect("/mobile");
    }
}
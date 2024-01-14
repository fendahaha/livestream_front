import {redirect} from "next/navigation";
import {is_room_online, queryAnchorByRoomUuid} from "@/app/_func/server";
import {streamServer} from "@/util/requestUtil";
import Room from "../_component/Room";

export default async function Component({params}) {
    const room_uuid = params['room_uuid'];
    if (await is_room_online(room_uuid)) {
        const anchor = await queryAnchorByRoomUuid(room_uuid);
        if (anchor) {
            const anchorUser = anchor.user;
            const room = anchor.room;
            const streamUrl = `${streamServer}${room.streamAddress}`;
            const streamParam = `${room.streamParam}`;
            const topic = `/topic/${room_uuid}`;
            return (
                <Room anchor={anchor}
                      anchorUser={anchorUser}
                      room={room}
                      streamUrl={streamUrl}
                      streamParam={streamParam}
                      topic={topic}>
                </Room>
            )
        } else {
            redirect("/mobile");
        }
    } else {
        redirect("/mobile");
    }
}
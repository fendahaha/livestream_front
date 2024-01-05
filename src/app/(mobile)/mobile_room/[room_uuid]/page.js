import {is_room_online, queryAnchorByRoomUuid} from "@/app/_func/server";
import {streamServer} from "@/util/requestUtil";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {RoomPageContextManager} from "@/component/context/PageContext";
import Room from "@/app/(mobile)/mobile_room/[room_uuid]/Room";

export default async function Component({params}) {
    const isIos = /iPad|iPhone|iPod/.test(headers().get("user-agent"))
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
                <RoomPageContextManager isIos={isIos}>
                    <Room uuid={room_uuid}
                          anchor={anchor}
                          anchorUser={anchorUser}
                          room={room}
                          streamUrl={streamUrl}
                          streamParam={streamParam}
                          topic={topic}>
                    </Room>
                </RoomPageContextManager>
            )
        } else {
            redirect("/mobile");
        }
    } else {
        redirect("/mobile");
    }
}
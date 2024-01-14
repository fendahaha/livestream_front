import {queryAnchorByUserUuid} from "@/app/_func/server";
import {streamServer} from "@/util/requestUtil";
import {redirect} from "next/navigation";
import DoLive from "./DoLive";

export default async function Component({searchParams}) {
    const user_uuid = searchParams['user_uuid'];
    const anchor = await queryAnchorByUserUuid(user_uuid);
    if (anchor) {
        const anchorUser = anchor.user;
        const room = anchor.room;
        const streamUrl = `${streamServer}${room.streamAddress}`;
        const streamParam = `${room.streamParam}`;
        const topic = `/topic/${room.roomUuid}`;
        return (
            <DoLive anchor={anchor}
                    anchorUser={anchorUser}
                    room={room}
                    streamUrl={streamUrl}
                    streamParam={streamParam}
                    topic={topic}>
            </DoLive>
        )
    } else {
        redirect("/mobile");
    }
}
import M3u8Container from "@/component/player/m3u8_container";
import FlvContainer from "@/component/player/flv_container";

export default function Home() {
    const m3u8_url = "https://localhost:8088/live/livestream.m3u8";
    const flv_url = "https://localhost:8088/live/livestream.flv";
    return (
        <main>
            https://b.antdata.cc/sport/api/v1/live/stream?token=xvpApxTuW8J4Cj5zvPHvscfUM5UDX4zsf8xa8WVKVPabGyWjqg
            <M3u8Container url={m3u8_url}></M3u8Container>
            <FlvContainer url={flv_url}></FlvContainer>
        </main>
    )
}

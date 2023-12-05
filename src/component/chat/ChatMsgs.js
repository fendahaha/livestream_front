import ChatMsg from "@/component/chat/ChatMsg";

export default function ChatMsgs({msgs}) {
    return (
        <div>
            {msgs.map(m => {
                return <ChatMsg key={Math.random() + m} data={m}/>
            })}
        </div>
    );
}
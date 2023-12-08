'use client'
import Login from "@/component/common/Login";
import {useRouter} from "next/navigation";

export default function Component() {
    let appRouterInstance = useRouter();
    return (
        <div>
            <Login onSuccess={(user) => {
                appRouterInstance.push("/")
            }}/>
        </div>
    );
}
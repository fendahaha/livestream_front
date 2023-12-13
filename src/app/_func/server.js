import 'server-only'
import {headers} from "next/headers";
import {nodeBackendFetch} from "@/util/requestUtil";

export async function getLoginUser() {
    const headersInstance = headers();
    const cookieHeaderValue = headersInstance.get("cookie");
    return await nodeBackendFetch.post('/user/getLoginUser', null, {cookie: cookieHeaderValue})
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(r => {
            if (r) {
                return r.data
            }
        })
}
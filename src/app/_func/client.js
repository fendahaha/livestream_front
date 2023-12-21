import 'client-only'
import {clientBackendFetch} from "@/util/requestUtil";

export const logout = (successCallback) => {
    clientBackendFetch.post('/user/logout', null)
        .then(res => {
            if (res.status === 200) {
                successCallback && successCallback();
            }
        })
}

export const get_all_gifts = () => {
    return clientBackendFetch.postJson("/gift/all").then(r => r?.data)
}
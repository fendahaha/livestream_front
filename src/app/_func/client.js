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

export function get_attribute_of_anchorConfig(anchorConfig, attributeName, defaultValue) {
    let config = {};
    if (anchorConfig) {
        config = JSON.parse(anchorConfig)
    }
    return config[attributeName] ? config[attributeName] : defaultValue;
}

export function update_attribute_of_anchorConfig(anchorConfig, attributeName, defaultValue, callback) {
    let config = {};
    if (anchorConfig) {
        config = JSON.parse(anchorConfig)
    }
    let v = config[attributeName] ? config[attributeName] : defaultValue;
    config[attributeName] = callback(v)
    return JSON.stringify(config);
}

export const get_anchors = () => {
    return clientBackendFetch.postJson("/anchor/allAnchors")
        .then(r => {
            if (r?.data) {
                return r?.data
            }
            return [];
        })
}
export const get_rank_anchors = () => {
    return clientBackendFetch.postJson("/anchor/rank").then(r => {
        if (r?.data) {
            return r?.data
        }
        return [];
    })
}

export function followAnchor(clientUserUuid, anchorUserUuid) {
    return clientBackendFetch.formPostJson('/follows/follow', {clientUserUuid, anchorUserUuid})
        .then(r => {
            if (r?.data) {
                return true
            }
            return false
        })
}

export function unfollowAnchor(clientUserUuid, anchorUserUuid) {
    return clientBackendFetch.formPostJson('/follows/unfollow', {clientUserUuid, anchorUserUuid})
        .then(r => {
            if (r?.data) {
                return true
            }
            return false
        })
}

export function get_client_followed_anchors(clientUserUuid) {
    clientBackendFetch.getJson(`/follows/client/${clientUserUuid}`)
        .then(r => r?.data)
}
function post(url, data = null, headers = {}) {
    let _data = null;
    if (data) {
        _data = JSON.stringify(data);
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        redirect: "follow",
        credentials: 'include',
        mode: "cors",
        body: _data,
        cache: 'no-store',
    })
}

function formPost(url, data = null, headers = {}) {
    let formData = null;
    if (data) {
        formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key])
        }
    }

    return fetch(url, {
        method: 'POST',
        headers: {
            ...headers
        },
        redirect: "follow",
        credentials: 'include',
        mode: "cors",
        body: formData,
        cache: 'no-store',
    })
}

function get(url, data, headers = {}) {
    const queryString = new URLSearchParams(data).toString();
    const urlWithParams = data !== null ? `${url}?${queryString}` : url;
    return fetch(urlWithParams, {
        method: 'GET',
        redirect: "follow",
        credentials: 'include',
        mode: "cors",
        headers: {
            ...headers
        },
        cache: 'no-store',
    })
}

function postJson(url, data, headers = {}) {
    return post(url, data, headers).then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
}

function formPostJson(url, data, headers = {}) {
    return formPost(url, data, headers).then(res => {
        if (res.ok) {
            return res.json()
        }
    })
}

function getJson(url, data, headers = {}) {
    return get(url, data, headers).then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
}

export const RequestUtil = {get, post, postJson, getJson}

export const clientBackendFetch = {
    prefix: '/backend',
    get(url, data = null, headers = {}) {
        return get(this.prefix + url, data, headers)
    },
    post(url, data = null, headers = {}) {
        return post(this.prefix + url, data, headers)
    },
    postJson(url, data = null, headers = {}) {
        return postJson(this.prefix + url, data, headers)
    },
    getJson(url, data = null, headers = {}) {
        return getJson(this.prefix + url, data, headers)
    },
    formPostJson(url, data = null, headers = {}) {
        return formPostJson(this.prefix + url, data, headers)
    }
}
export const nodeBackendFetch = {
    token: 'EB4QHUgFuiU5huMyAWjQVQ',
    get(url, data = null, headers = {}) {
        headers = {...headers, 'Authorization': 'Bearer ' + this.token};
        return get(backendUrlBase + url, data, headers)
    },
    post(url, data = null, headers = {}) {
        headers = {...headers, 'Authorization': 'Bearer ' + this.token};
        return post(backendUrlBase + url, data, headers)
    },
    postJson(url, data = null, headers = {}) {
        headers = {...headers, 'Authorization': 'Bearer ' + this.token};
        return postJson(backendUrlBase + url, data, headers)
    },
    getJson(url, data = null, headers = {}) {
        headers = {...headers, 'Authorization': 'Bearer ' + this.token};
        return getJson(backendUrlBase + url, data, headers)
    },
    formPostJson(url, data = null, headers = {}) {
        headers = {...headers, 'Authorization': 'Bearer ' + this.token};
        return formPostJson(backendUrlBase + url, data, headers)
    }
}

export const backendUrlBase = process.env.BACKEND_URL_BASE;
export const rtmpServer = process.env.NEXT_PUBLIC_RTMP_SERVER;
export const streamServer = process.env.NEXT_PUBLIC_STREAM_SERVER;
export const imagePrefix = process.env.NEXT_PUBLIC_IMAGE_PREFIX;
export const wsPrefix = process.env.NEXT_PUBLIC_WEBSOCKET_PREFIX;


function post(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        credentials: 'include',
        mode: "cors",
        body: data !== null ? JSON.stringify(data) : null,
    })
}

function get(url, data) {
    const queryString = new URLSearchParams(data).toString();
    const urlWithParams = data !== null ? `${url}?${queryString}` : url;
    return fetch(urlWithParams, {
        method: 'GET',
        redirect: "follow",
        credentials: 'include',
        mode: "cors",
    })
}

function postJson(url, data) {
    return post(url, data).then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
}

function getJson(url, data) {
    return get(url, data).then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
}

export const RequestUtil = {get, post, postJson, getJson}

export const backendFetch = {
    prefix: '/backend',
    get(url, data) {
        return get(this.prefix + url, data)
    },
    post(url, data) {
        return post(this.prefix + url, data)
    },
    postJson(url, data) {
        return postJson(this.prefix + url, data)
    },
    getJson(url, data) {
        return getJson(this.prefix + url, data)
    }
}
export const imagePrefix = "http://localhost:8090/resource";
export const backendUrlBase = `http://localhost:8090`;
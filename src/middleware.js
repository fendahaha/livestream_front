import {NextResponse} from 'next/server'
import {backendUrlBase, RequestUtil} from "@/util/requestUtil";


async function is_login() {
    return await RequestUtil.postJson(backendUrlBase + "/user/is_login", null).then(d => {
        return d.data
        // return true
    });
}

export async function middleware(request) {
    const {headers, method, body, url, cookies} = request;
    const {pathname, origin, searchParams} = request.nextUrl;

    if (pathname.startsWith("/backend")) {
        const backendUrl = url.replace(/^https?:\/\/\S+(:\d+)?\/backend/ig, backendUrlBase);
        console.log('access', backendUrl);
        try {
            // 使用fetch API转发请求
            const response = await fetch(backendUrl, {
                method: method,
                headers: headers,
                body: ['GET', 'HEAD'].includes(method) ? null : body,
            });
            return new Response(await response.text(), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        } catch (error) {
            console.error('access', backendUrl, error);
            return NextResponse.json({error: 'Error forwarding request'}, {
                status: 500,
                statusText: 'server error'
            })
        }
    }

    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-login")) {
        try {
            const JSESSIONID = request.cookies.get('JSESSIONID');
            const response = await fetch(`${backendUrlBase}/user/is_login`, {
                method: 'POST',
                headers: {
                    cookie: `${JSESSIONID.name}=${JSESSIONID.value}`
                },
            });
            let result = await response.json()
            if (!result.data) {
                return NextResponse.redirect("http://localhost:3000/admin-login")
            }
        } catch (e) {
            return NextResponse.redirect("http://localhost:3000/admin-login")
        }
    }

    if (pathname.startsWith("/user")) {
        try {
            const JSESSIONID = request.cookies.get('JSESSIONID');
            const response = await fetch(`${backendUrlBase}/user/is_login`, {
                method: 'POST',
                headers: {
                    cookie: `${JSESSIONID.name}=${JSESSIONID.value}`
                },
            });
            let result = await response.json()
            if (!result.data) {
                return NextResponse.redirect("http://localhost:3000/")
            }
        } catch (e) {
            return NextResponse.redirect("http://localhost:3000/")
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
}
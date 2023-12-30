import {NextResponse} from 'next/server'
import {backendUrlBase} from "@/util/requestUtil";
import {userTypeUtil} from "@/util/commonUtil";

async function get_login_user(request) {
    const JSESSIONID = request.cookies.get('JSESSIONID');
    const response = await fetch(`${backendUrlBase}/user/getLoginUser`, {
        method: 'POST',
        headers: {
            cookie: `${JSESSIONID.name}=${JSESSIONID.value}`
        },
    });
    if (response.status === 200) {
        const user = (await response.json()).data;
        return user
    }
    return null
}

export async function middleware(request) {
    const {headers, method, body, url, cookies} = request;
    const {pathname, origin, searchParams} = request.nextUrl;

    if (pathname.startsWith("/backend")) {
        const backendUrl = url.replace(/^https?:\/\/\S+(:\d+)?\/backend/ig, backendUrlBase);
        // console.log('access', backendUrl);
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
            // console.error('access', backendUrl, error);
            return NextResponse.json({error: 'Error forwarding request'}, {
                status: 500,
                statusText: 'server error'
            })
        }
    }

    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-login")) {
        try {
            const user = await get_login_user(request);
            if (!user || !userTypeUtil.is_admin(user?.userType)) {
                return NextResponse.redirect(`${origin}/admin-login`)
            }
        } catch (e) {
            return NextResponse.redirect(`${origin}/admin-login`)
        }
    }
    if (pathname.startsWith("/user")) {
        try {
            const user = await get_login_user(request);
            if (!user || userTypeUtil.is_admin(user?.userType)) {
                return NextResponse.redirect(`${origin}/login`)
            }
        } catch (e) {
            return NextResponse.redirect(`${origin}/login`)
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
}
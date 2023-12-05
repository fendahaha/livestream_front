import {NextResponse} from 'next/server'

export async function middleware(request) {
    const {headers, method, body, url} = request;
    const {pathname, origin, searchParams} = request.nextUrl;

    if (pathname.startsWith("/backend")) {
        const backendUrlBase = `http://localhost:8090`;
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

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
}
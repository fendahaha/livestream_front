import {Inter} from 'next/font/google'
import './global.css';
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import {getLocaleInfo, getLoginUser} from "@/app/_func/server";
import LocaleContextManager from "@/component/context/localeContext";
import {GlobalContextManager} from "@/component/context/globalContext";
import {headers} from "next/headers";
import {MobilePageContextManager} from "@/component/context/PageContext";


const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'admin',
    description: 'backend',
}
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    minimum: 1,
    maximumScale: 1,
    userScalable: 1,
}

export default async function RootLayout({children}) {
    const {locale, dictionary} = await getLocaleInfo();
    const isIos = /iPad|iPhone|iPod/.test(headers().get("user-agent"))
    return (
        <html lang="en">
        <body className={inter.className}>
        <StyledComponentsRegistry>
            <LocaleContextManager locale={locale} dictionary={dictionary}>
                <GlobalContextManager userInfo={await getLoginUser()}>
                    <MobilePageContextManager isIos={isIos}>
                        {children}
                    </MobilePageContextManager>
                </GlobalContextManager>
            </LocaleContextManager>
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}

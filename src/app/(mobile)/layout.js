import {Inter} from 'next/font/google'
import './global.css';
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import styles from './layout.module.css';
import Footer from "@/app/(mobile)/component/common/Footer";
import Header from "@/app/(mobile)/component/common/Header";
import {getLocaleInfo, getLoginUser} from "@/app/_func/server";
import LocaleContextManager from "@/component/context/localeContext";
import {GlobalContextManager} from "@/component/context/globalContext";


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
    const {locale, dictionary} = await getLocaleInfo()
    return (
        <html lang="en">
        <body className={inter.className}>
        <StyledComponentsRegistry>
            <LocaleContextManager locale={locale} dictionary={dictionary}>
                <GlobalContextManager userInfo={await getLoginUser()}>
                    <div className={styles.main}>
                        <div className={styles.header}>
                            {/*<Header/>*/}
                        </div>
                        <div className={styles.body}>
                            {children}
                        </div>
                        <div className={styles.footer}>
                            <Footer/>
                        </div>
                    </div>
                </GlobalContextManager>
            </LocaleContextManager>
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}

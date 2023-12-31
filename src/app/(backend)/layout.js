import {Inter} from 'next/font/google'
import './global.css';
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import {getLocaleInfo} from "@/app/_func/server";
import LocaleContextManager from "@/component/context/localeContext";


const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'admin',
    description: 'backend',
}

export default async function RootLayout({children}) {
    const {locale, dictionary} = await getLocaleInfo()
    return (
        <html lang="en">
        <body className={inter.className}>
        <StyledComponentsRegistry>
            <LocaleContextManager locale={locale} dictionary={dictionary}>
                {children}
            </LocaleContextManager>
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}

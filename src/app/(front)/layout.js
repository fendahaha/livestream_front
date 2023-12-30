import {Inter} from 'next/font/google'
import Header from "@/component/common/Header";
import './global.css';
import styles from "./layout.module.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import {GlobalContextManager} from "@/component/context/globalContext";
import {getLoginUser} from "@/app/_func/server";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StyledComponentsRegistry>
            <GlobalContextManager userInfo={await getLoginUser()}>
                <div className={styles.main}>
                    <div className={styles.header}>
                        <Header/>
                    </div>
                    <div className={styles.body}>
                        {children}
                    </div>
                </div>
            </GlobalContextManager>
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}

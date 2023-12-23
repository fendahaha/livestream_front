import {Inter} from 'next/font/google'
import './global.css';
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import styles from './layout.module.css';


const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'admin',
    description: 'backend',
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StyledComponentsRegistry>
            <div className={styles.main}>
                <div className={styles.header}>

                </div>
                <div className={styles.body}>
                    {children}
                </div>
                <div className={styles.footer}>

                </div>
            </div>
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}
import {Inter} from 'next/font/google'
import './global.css';
import StyledComponentsRegistry from "@/lib/AntdRegistry";


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
            {children}
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}

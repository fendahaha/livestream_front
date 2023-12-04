import StyledComponentsRegistry from "@/lib/AntdRegistry";

export const metadata = {
    title: 'login',
    description: 'client login',
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body>
        <StyledComponentsRegistry>
            {children}
        </StyledComponentsRegistry>
        </body>
        </html>
    )
}

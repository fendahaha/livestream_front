import StyledComponentsRegistry from "@/lib/AntdRegistry";

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
}

export default function RootLayout({children,}) {
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

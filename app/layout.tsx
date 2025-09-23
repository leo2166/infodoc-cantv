import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { ThemeProvider } from "@/components/theme-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "InfoDoc - Toda la información de interés al alcance",
  description: "Portal de información para jubilados de CANTV con noticias, recursos y asistencia con IA",
  generator: "v0.app",
  keywords: "CANTV, jubilados, pensiones, beneficios, información, Venezuela",
  authors: [{ name: "InfoDoc CANTV" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InfoDoc",
  },
  openGraph: {
    title: "InfoDoc - Portal para Jubilados de CANTV",
    description: "Toda la información de interés al alcance de los jubilados de CANTV",
    type: "website",
    locale: "es_VE",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3TF4NYTG54"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3TF4NYTG54');
          `,
          }}
        />
        <meta name="theme-color" content="#0891b2" />
        <meta name="color-scheme" content="light dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InfoDoc" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary-foreground"
          >
            Saltar al contenido principal
          </a>
          <div id="main-content">{children}</div>
          <AccessibilityToolbar />
        </ThemeProvider>
      </body>
    </html>
  )
}
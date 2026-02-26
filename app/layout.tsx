import { Analytics } from "@vercel/analytics/react"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat, Open_Sans, Anton } from "next/font/google"
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

const anton = Anton({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
  weight: "400",
})

export const metadata: Metadata = {
  title: "InfoDoc - Toda la información de interés al alcance",
  description: "Portal de información para jubilados de CANTV con noticias, recursos y asistencia con IA",
  generator: "v0.app",
  keywords: "CANTV, jubilados, pensiones, beneficios, información, Venezuela",
  authors: [{ name: "InfoDoc CANTV" }],
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0891b2",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable} ${anton.variable}`}>
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NB5RS8VJ');
          `}
        </Script>
        <meta name="theme-color" content="#0891b2" />
        <meta name="color-scheme" content="light dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
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
          {/* AccessibilityToolbar removed from here, now in Navigation */}

        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
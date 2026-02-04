"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Newspaper, MessageCircle, Home, Info, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"


const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/construccion", label: "Documentos" },
  { href: "/enlaces-interes", label: "Enlaces de Interés" },
  { href: "/farmacias", label: "Farmacias Locales" },
  { href: "/convertir-jpg-pdf", label: "Convertir JPG > PDF" },
]

const mobileNavLinks = [
  { href: "/", label: "Inicio" },
  { href: "/construccion", label: "Documentos" },
  { href: "/enlaces-interes", label: "Enlaces de Interés" },
  { href: "/farmacias", label: "Farmacias Locales" },
  { href: "/convertir-jpg-pdf", label: "Convertir JPG > PDF" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-black text-lg">ID</span>
          </div>
          <span className="font-heading font-black text-lg">InfoDoc</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {/* Accessibility Button - Visible on both Mobile and Desktop (Inline) */}
          <div>
            <AccessibilityToolbar inline={true} />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="border-b pb-4 mb-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-black text-lg">ID</span>
                    </div>
                    <span className="font-heading font-black text-lg">InfoDoc</span>
                  </Link>
                </div>
                <nav className="flex flex-col space-y-2 flex-grow">
                  {mobileNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium py-2 px-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

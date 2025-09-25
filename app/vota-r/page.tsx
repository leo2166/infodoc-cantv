"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VotaRPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-primary text-primary-foreground p-4 text-center">
        <h1 className="text-2xl font-bold">Vota por la R</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl">Alexander Muñoz</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Image
                src="/AM.png"
                alt="Campaña Vota por la R - Alexander Muñoz"
                width={800}
                height={1200}
                className="rounded-lg shadow-lg"
                priority
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
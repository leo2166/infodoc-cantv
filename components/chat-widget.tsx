
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function ChatWidget() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href="/chat-ia">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 touch-target shadow-lg"
          aria-label="Abrir chat con IA"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </Link>
    </div>
  )
}

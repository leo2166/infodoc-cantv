"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>(["IA: Hola que quieres saber hoy como puedo ayudarte? 😊"]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setChatHistory((prev) => [...prev, `Tú: ${message}`]);

    try {
      const res = await fetch("/api/chat-deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const { text } = await res.json();
      setChatHistory((prev) => [...prev, `IA: ${text}`]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [...prev, "IA: Lo siento, algo salió mal."]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-secondary text-secondary-foreground p-4 text-center">
        <h1 className="text-2xl font-bold text-black">Chatear con la IA</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto mb-4">
          <Link href="/">
            <Button variant="outline" className="touch-target">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Historial del Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-96 overflow-y-auto p-4 border rounded-md">
              {
                chatHistory.map((msg, index) => {
                  const isUser = msg.startsWith("Tú:");
                  const content = isUser ? msg.substring(3) : msg.substring(4);
                  const sender = isUser ? "Tú" : "IA";
                  return (
                    <div key={index} className={`p-2 my-2 rounded-lg ${isUser ? "bg-green-100 dark:bg-green-900 ml-auto" : "bg-gray-200 dark:bg-gray-700 mr-auto"}`}>
                      <p className="font-bold text-base">{sender}</p>
                      {isUser ? (
                        <p className="text-base">{content}</p>
                      ) : (
                        <div className="text-base prose dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Haz tu pregunta a la IA..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading} className="bg-black text-white hover:bg-gray-800">
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

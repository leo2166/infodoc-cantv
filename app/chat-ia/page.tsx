import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BrainCircuit, Zap } from "lucide-react";

export default function SelectChatModelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Elige tu Asistente de IA
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Selecciona el modelo de inteligencia artificial que prefieras usar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* OpenAI Card */}
        <Link href="/chat-gemini" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
          <Card className="h-full hover:shadow-xl hover:border-primary transition-all duration-300 cursor-pointer">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BrainCircuit className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Usar OpenAI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                El modelo estándar de la industria, potente y versátil para una amplia gama de tareas de conversación y generación de texto.
              </p>
              <Button className="w-full" variant="default">
                Iniciar Chat con OpenAI
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* DeepSeek Card */}
        <Link href="/chat-deepseek" className="focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded-lg">
          <Card className="h-full hover:shadow-xl hover:border-secondary transition-all duration-300 cursor-pointer">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-secondary/10 rounded-full mb-4">
                <Zap className="w-12 h-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-bold">Usar DeepSeek</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Un modelo potente y rápido, excelente para respuestas veloces y una amplia gama de tareas de conversación.
              </p>
              <Button className="w-full" variant="secondary">
                Iniciar Chat con DeepSeek
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
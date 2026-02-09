
"use client";

import { useState } from "react";

export default function UploadPage() {
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus("uploading");
        setLogs([]);
        setMessage("");
        addLog(`Iniciando carga de: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);

        try {
            addLog("Enviando archivo al servidor...");
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error desconocido en el servidor");
            }

            setStatus("success");
            setMessage(data.message);
            addLog("✅ " + data.message);
            addLog("El chatbot ahora tiene acceso a esta nueva información.");

        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setMessage(error.message);
            addLog("❌ Error: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Cargar Documento a Bootie</h1>
                    <p className="text-gray-500 mt-2">Sube archivos .docx para actualizar la base de conocimientos automáticamente.</p>
                </div>

                <div className="mb-6">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span> o arrastra</p>
                            <p className="text-xs text-gray-500">Documentos Word (.docx)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".docx"
                            onChange={handleFileUpload}
                            disabled={status === "uploading"}
                        />
                    </label>
                </div>

                {/* Estado y Logs */}
                {status !== "idle" && (
                    <div className={`mt-4 p-4 rounded-lg text-sm font-medium border ${status === "success" ? "bg-green-50 text-green-700 border-green-200" :
                            status === "error" ? "bg-red-50 text-red-700 border-red-200" :
                                "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                        {status === "uploading" && (
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </div>
                        )}

                        <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center text-xs text-gray-400">
                    Sistema de Automatización InfoDoc v1.0
                </div>
            </div>
        </div>
    );
}

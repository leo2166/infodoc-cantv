"use client";

import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall, PlayCircle, PauseCircle } from "lucide-react";

interface EmergencyGuideModalProps {
  children: React.ReactNode;
}

export function EmergencyGuideModal({ children }: EmergencyGuideModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    // Stop and reset audio when modal is closed
    if (!open) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    }
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">¿Qué hacer en caso de una Emergencia?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-center">
            Sigue estos pasos importantes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center my-4">
          <div className="flex flex-col items-center">
            <Image
              src="/EM.jpg"
              alt="Persona mayor llamando a emergencias y operadora de call center atendiendo"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-lg">
              En una situación de emergencia, lo más importante es mantener la calma.
            </p>
            
            <Button onClick={handlePlayPause} className="w-auto text-lg py-6">
              {isPlaying ? (
                <PauseCircle className="mr-2 h-5 w-5" />
              ) : (
                <PlayCircle className="mr-2 h-5 w-5" />
              )}
              {isPlaying ? "Pausar Narración" : "Reproducir Narración"}
            </Button>

            <p className="text-lg font-semibold text-primary">
              Llama al call center de emergencias y sigue las indicaciones del operador.
            </p>
            <Link href="/emergencias" passHref>
              <Button className="w-auto text-lg py-6">
                <PhoneCall className="mr-2 h-5 w-5" />
                Números de Emergencia
              </Button>
            </Link>
          </div>
        </div>
        <audio ref={audioRef} src="/protocolo.mp3" preload="auto" onEnded={handleAudioEnded} />
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="text-lg py-6">Cerrar</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

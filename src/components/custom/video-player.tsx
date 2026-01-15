"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  isOpen,
  onClose,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video bg-black">
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            controls
            autoPlay
            className="w-full h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        <div className="p-6 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline">Vídeo do Vendedor</Badge>
            <span>•</span>
            <span>Transparência garantida</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

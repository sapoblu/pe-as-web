"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Video, CheckCircle } from "lucide-react";
import type { Comment } from "@/lib/types";

interface VideoCommentsProps {
  announcementId: string;
  comments: Comment[];
  onAddComment: (content: string, videoUrl?: string) => void;
  userHasPurchased?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoComments({
  announcementId,
  comments,
  onAddComment,
  userHasPurchased = false,
  isOpen,
  onClose,
}: VideoCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comentários e Perguntas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Área de novo comentário */}
          <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
            <Textarea
              placeholder={
                userHasPurchased
                  ? "Faça uma pergunta ou deixe seu comentário sobre a peça..."
                  : "Faça uma pergunta ao vendedor (visível para todos)..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            
            {userHasPurchased && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">
                    Você comprou esta peça! Pode postar vídeo de confirmação.
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {userHasPurchased && (
                <Button variant="outline" className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Adicionar Vídeo
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !newComment.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>

          {/* Lista de comentários */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">
              {comments.length} {comments.length === 1 ? "comentário" : "comentários"}
            </h3>

            {sortedComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum comentário ainda.</p>
                <p className="text-sm">Seja o primeiro a fazer uma pergunta!</p>
              </div>
            ) : (
              sortedComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border-2 ${
                    comment.isSellerResponse
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {comment.userName}
                        </span>
                        {comment.isSellerResponse && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Vendedor
                          </Badge>
                        )}
                        {comment.videoUrl && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Com vídeo
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-700 text-sm mb-2">{comment.content}</p>

                      {comment.videoUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden border-2 border-slate-200">
                          <video
                            src={comment.videoUrl}
                            controls
                            className="w-full max-h-[300px]"
                          />
                        </div>
                      )}

                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

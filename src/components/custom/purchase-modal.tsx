"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Barcode, ShoppingCart, Truck, MapPin } from "lucide-react";
import { METODOS_PAGAMENTO, METODOS_ENTREGA } from "@/lib/constants";
import type { AnnouncementType } from "@/lib/types";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    id: string;
    title: string;
    price: number;
    type: AnnouncementType;
    thumbnailUrl: string;
    seller: {
      name: string;
      rating: number;
    };
  };
  onConfirmPurchase: (data: {
    paymentMethod: string;
    deliveryMethod: string;
    zipCode: string;
  }) => void;
}

export function PurchaseModal({
  isOpen,
  onClose,
  announcement,
  onConfirmPurchase,
}: PurchaseModalProps) {
  const [step, setStep] = useState<"payment" | "delivery" | "confirm">("payment");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [zipCode, setZipCode] = useState("");

  const commission = announcement.type === "premium" ? 0.15 : announcement.type === "new" ? 0.05 : 0.08;
  const commissionAmount = announcement.price * commission;
  const sellerAmount = announcement.price - commissionAmount;

  const handleConfirm = () => {
    onConfirmPurchase({
      paymentMethod,
      deliveryMethod,
      zipCode,
    });
  };

  const getPaymentIcon = (id: string) => {
    switch (id) {
      case "credit_card":
        return <CreditCard className="w-5 h-5" />;
      case "pix":
        return <Smartphone className="w-5 h-5" />;
      case "boleto":
        return <Barcode className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Finalizar Compra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do produto */}
          <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
            <img
              src={announcement.thumbnailUrl}
              alt={announcement.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{announcement.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Vendedor: {announcement.seller.name}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-blue-600">
                  R$ {announcement.price.toLocaleString("pt-BR")}
                </span>
                <Badge variant="outline" className="text-xs">
                  Comissão: {(commission * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Etapa 1: Pagamento */}
          {step === "payment" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Escolha a forma de pagamento</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {METODOS_PAGAMENTO.map((metodo) => (
                  <div
                    key={metodo.id}
                    className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <RadioGroupItem value={metodo.id} id={metodo.id} />
                    <Label
                      htmlFor={metodo.id}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      {getPaymentIcon(metodo.id)}
                      <div>
                        <p className="font-medium">{metodo.nome}</p>
                        <p className="text-sm text-gray-600">{metodo.descricao}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Etapa 2: Entrega */}
          {step === "delivery" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Escolha o método de entrega</h3>
              
              <div className="space-y-3">
                <Label htmlFor="zipCode" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  CEP de Entrega
                </Label>
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={9}
                />
              </div>

              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                {METODOS_ENTREGA.map((metodo) => (
                  <div
                    key={metodo.id}
                    className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <RadioGroupItem value={metodo.id} id={`delivery-${metodo.id}`} />
                    <Label
                      htmlFor={`delivery-${metodo.id}`}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <Truck className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{metodo.nome}</p>
                        <p className="text-sm text-gray-600">{metodo.descricao}</p>
                        <p className="text-xs text-gray-500">Prazo: {metodo.prazo}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Etapa 3: Confirmação */}
          {step === "confirm" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Confirme sua compra</h3>
              
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor da peça:</span>
                  <span className="font-semibold">
                    R$ {announcement.price.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comissão da plataforma:</span>
                  <span className="text-gray-600">
                    R$ {commissionAmount.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendedor receberá:</span>
                  <span className="text-gray-600">
                    R$ {sellerAmount.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-blue-600">
                      R$ {announcement.price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Como funciona:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Seu pagamento fica retido com segurança</li>
                  <li>Vendedor envia a peça com vídeo de envio</li>
                  <li>Você recebe e confirma com vídeo</li>
                  <li>Valor é liberado ao vendedor</li>
                  <li>Ambos avaliam a transação</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {step !== "payment" && (
            <Button
              variant="outline"
              onClick={() => {
                if (step === "delivery") setStep("payment");
                if (step === "confirm") setStep("delivery");
              }}
            >
              Voltar
            </Button>
          )}
          
          <Button
            onClick={() => {
              if (step === "payment" && paymentMethod) setStep("delivery");
              else if (step === "delivery" && deliveryMethod && zipCode) setStep("confirm");
              else if (step === "confirm") handleConfirm();
            }}
            disabled={
              (step === "payment" && !paymentMethod) ||
              (step === "delivery" && (!deliveryMethod || !zipCode))
            }
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            {step === "confirm" ? "Confirmar Compra" : "Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

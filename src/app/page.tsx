"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Car, Filter, Video, Star, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VideoPlayer } from "@/components/custom/video-player";
import { VideoComments } from "@/components/custom/video-comments";
import { PurchaseModal } from "@/components/custom/purchase-modal";
import { getAnnouncements, incrementAnnouncementViews, createComment, createPurchase } from "@/lib/supabase-queries";
import type { AnnouncementType } from "@/lib/types";
import { toast } from "sonner";

interface Comment {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  videoUrl?: string;
  isSellerResponse: boolean;
  createdAt: string;
  parentCommentId?: string;
}

interface Announcement {
  id: string;
  title: string;
  price: number;
  type: AnnouncementType;
  videoUrl: string;
  thumbnailUrl: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
  };
  location: {
    city: string;
    state: string;
  };
  vehicleBrand: string;
  views: number;
  comments: Comment[];
  commission: number;
}

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const marcas = [
  "Volkswagen", "Fiat", "Chevrolet", "Ford", "Toyota", "Honda", "Hyundai", 
  "Renault", "Nissan", "Jeep", "Peugeot", "Citroën", "BMW", "Mercedes-Benz"
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [selectedVideoAnnouncement, setSelectedVideoAnnouncement] = useState<Announcement | null>(null);
  const [selectedCommentsAnnouncement, setSelectedCommentsAnnouncement] = useState<Announcement | null>(null);
  const [selectedPurchaseAnnouncement, setSelectedPurchaseAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    setMounted(true);
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements({
        state: selectedState !== 'all' ? selectedState : undefined,
        city: selectedCity !== 'all' ? selectedCity : undefined,
        vehicleBrand: selectedBrand !== 'all' ? selectedBrand : undefined,
        searchTerm: searchTerm || undefined,
      });

      // Transformar dados do Supabase para o formato do componente
      const transformedData: Announcement[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        type: item.type,
        videoUrl: item.video_url,
        thumbnailUrl: item.thumbnail_url,
        seller: {
          id: item.seller.id,
          name: item.seller.name,
          rating: item.seller.rating,
          avatar: item.seller.avatar_url,
        },
        location: {
          city: item.city,
          state: item.state,
        },
        vehicleBrand: item.vehicle_brand,
        views: item.views,
        comments: item.comments?.map((c: any) => ({
          id: c.id,
          announcementId: c.announcement_id,
          userId: c.user_id,
          userName: c.user?.name || 'Usuário',
          userAvatar: c.user?.avatar_url,
          content: c.content,
          videoUrl: c.video_url,
          isSellerResponse: c.is_seller_response,
          createdAt: c.created_at,
          parentCommentId: c.parent_comment_id,
        })) || [],
        commission: item.commission,
      }));

      setAnnouncements(transformedData);
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
      toast.error('Erro ao carregar anúncios. Usando dados de exemplo.');
      
      // Dados de exemplo como fallback
      setAnnouncements([
        {
          id: "1",
          title: "Motor Parcial 1.0 Flex Gol G5",
          price: 1200,
          type: "premium",
          commission: 12,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
          seller: {
            id: "seller1",
            name: "João Silva",
            rating: 4.8,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao"
          },
          location: {
            city: "São Paulo",
            state: "SP"
          },
          vehicleBrand: "Volkswagen",
          views: 245,
          comments: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadAnnouncements();
  };

  const handleVideoClick = async (announcement: Announcement) => {
    setSelectedVideoAnnouncement(announcement);
    try {
      await incrementAnnouncementViews(announcement.id);
      // Atualizar views localmente
      setAnnouncements(prev => prev.map(a => 
        a.id === announcement.id ? { ...a, views: a.views + 1 } : a
      ));
    } catch (error) {
      console.error('Erro ao incrementar views:', error);
    }
  };

  const handleAddComment = async (announcementId: string, content: string, videoUrl?: string) => {
    try {
      // TODO: Implementar autenticação real
      const mockUserId = "user-temp-id";
      
      await createComment({
        announcement_id: announcementId,
        user_id: mockUserId,
        content,
        video_url: videoUrl,
        is_seller_response: false,
      });

      toast.success('Comentário adicionado com sucesso!');
      loadAnnouncements(); // Recarregar para atualizar comentários
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário. Tente novamente.');
    }
  };

  const handleConfirmPurchase = async (data: any) => {
    try {
      // TODO: Implementar autenticação real
      const mockBuyerId = "buyer-temp-id";

      await createPurchase({
        announcement_id: selectedPurchaseAnnouncement!.id,
        buyer_id: mockBuyerId,
        buyer_name: data.name,
        buyer_email: data.email,
        buyer_phone: data.phone,
        buyer_city: data.city,
        buyer_state: data.state,
        status: 'pending',
      });

      toast.success('Compra registrada com sucesso! O vendedor entrará em contato.');
      setSelectedPurchaseAnnouncement(null);
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      toast.error('Erro ao processar compra. Tente novamente.');
    }
  };

  const getTypeLabel = (type: AnnouncementType) => {
    switch (type) {
      case "premium":
        return { label: "Premium", color: "bg-gradient-to-r from-amber-500 to-orange-600" };
      case "new":
        return { label: "Novo", color: "bg-gradient-to-r from-emerald-500 to-teal-600" };
      default:
        return { label: "Normal", color: "bg-gradient-to-r from-blue-500 to-indigo-600" };
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Car className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Minhapecausadaenova</h1>
                <p className="text-xs md:text-sm text-blue-100">Transparência em cada negócio</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Vender
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Entrar
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Busca e Filtros */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar peça (ex: motor, farol, embreagem...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-base border-2 focus:border-blue-500"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 border-2"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
              <Button 
                onClick={handleSearch}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Buscar
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Estado
                  </label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Brasil (Todos)</SelectItem>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Cidade
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="sao-paulo">São Paulo</SelectItem>
                      <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                      <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <Car className="w-4 h-4 inline mr-1" />
                    Marca do Veículo
                  </label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Todas as marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {marcas.map((marca) => (
                        <SelectItem key={marca} value={marca.toLowerCase()}>
                          {marca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Anúncios */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Peças Disponíveis</h2>
          <p className="text-gray-600">
            {loading ? 'Carregando...' : `Encontramos ${announcements.length} anúncios`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {announcements.map((announcement) => {
              const typeInfo = getTypeLabel(announcement.type);
              
              return (
                <Card key={announcement.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2">
                  <CardHeader className="p-0 relative">
                    <Badge className={`absolute top-3 left-3 z-10 ${typeInfo.color} text-white border-0 shadow-lg`}>
                      {typeInfo.label}
                    </Badge>
                    
                    <div 
                      className="relative aspect-video bg-slate-200 group cursor-pointer"
                      onClick={() => handleVideoClick(announcement)}
                    >
                      <img 
                        src={announcement.thumbnailUrl} 
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                          <Video className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        <Video className="w-3 h-3 inline mr-1" />
                        Ver vídeo
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-2 min-h-[3.5rem]">
                      {announcement.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          R$ {formatPrice(announcement.price)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {announcement.vehicleBrand}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={announcement.seller.avatar} />
                        <AvatarFallback>{announcement.seller.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {announcement.seller.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-600">{announcement.seller.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{announcement.location.city} - {announcement.location.state}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <span>{announcement.views} visualizações</span>
                      <button
                        onClick={() => setSelectedCommentsAnnouncement(announcement)}
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{announcement.comments.length} comentários</span>
                      </button>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => setSelectedPurchaseAnnouncement(announcement)}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Comprar Agora
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Sobre</h3>
              <p className="text-sm text-slate-300">
                Marketplace de peças automotivas com transparência total através de vídeos.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Para Vendedores</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Como vender</li>
                <li>Taxas e comissões</li>
                <li>Políticas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Para Compradores</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Como comprar</li>
                <li>Garantias</li>
                <li>Formas de entrega</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Central de ajuda</li>
                <li>Contato</li>
                <li>Termos de uso</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2024 Minhapecausadaenova - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>

      {/* Modais */}
      {selectedVideoAnnouncement && (
        <VideoPlayer
          videoUrl={selectedVideoAnnouncement.videoUrl}
          thumbnailUrl={selectedVideoAnnouncement.thumbnailUrl}
          title={selectedVideoAnnouncement.title}
          isOpen={!!selectedVideoAnnouncement}
          onClose={() => setSelectedVideoAnnouncement(null)}
        />
      )}

      {selectedCommentsAnnouncement && (
        <VideoComments
          announcementId={selectedCommentsAnnouncement.id}
          comments={selectedCommentsAnnouncement.comments}
          onAddComment={(content, videoUrl) => 
            handleAddComment(selectedCommentsAnnouncement.id, content, videoUrl)
          }
          userHasPurchased={false}
          isOpen={!!selectedCommentsAnnouncement}
          onClose={() => setSelectedCommentsAnnouncement(null)}
        />
      )}

      {selectedPurchaseAnnouncement && (
        <PurchaseModal
          isOpen={!!selectedPurchaseAnnouncement}
          onClose={() => setSelectedPurchaseAnnouncement(null)}
          announcement={selectedPurchaseAnnouncement}
          onConfirmPurchase={handleConfirmPurchase}
        />
      )}
    </div>
  );
}

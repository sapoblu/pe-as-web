// Constantes da plataforma

export const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export const MARCAS_VEICULOS = [
  "Volkswagen",
  "Fiat",
  "Chevrolet",
  "Ford",
  "Toyota",
  "Honda",
  "Hyundai",
  "Renault",
  "Nissan",
  "Jeep",
  "Peugeot",
  "Citroën",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Mitsubishi",
  "Kia",
  "Volvo",
  "Land Rover",
  "Porsche",
];

export const CATEGORIAS_PECAS = [
  "Motor e Transmissão",
  "Suspensão e Direção",
  "Freios",
  "Sistema Elétrico",
  "Carroceria e Lataria",
  "Iluminação",
  "Interior",
  "Ar Condicionado",
  "Escapamento",
  "Rodas e Pneus",
  "Vidros e Retrovisores",
  "Acessórios",
];

export const METODOS_ENTREGA = [
  {
    id: "sedex",
    nome: "Sedex / Correios",
    descricao: "Entrega rápida pelos Correios",
    prazo: "2-5 dias úteis",
  },
  {
    id: "transportadora",
    nome: "Transportadora",
    descricao: "Para peças grandes e pesadas",
    prazo: "5-10 dias úteis",
  },
  {
    id: "onibus",
    nome: "Ônibus Rodoviário",
    descricao: "Econômico para peças grandes",
    prazo: "3-7 dias úteis",
  },
];

export const METODOS_PAGAMENTO = [
  {
    id: "credit_card",
    nome: "Cartão de Crédito",
    descricao: "Parcelamento em até 12x",
    icone: "CreditCard",
  },
  {
    id: "pix",
    nome: "PIX",
    descricao: "Aprovação instantânea",
    icone: "Smartphone",
  },
  {
    id: "boleto",
    nome: "Boleto Bancário",
    descricao: "Aprovação em 1-2 dias úteis",
    icone: "Barcode",
  },
];

export const TIPOS_ANUNCIO = {
  normal: {
    nome: "Normal",
    comissao: 8,
    cor: "blue",
    beneficios: ["Anúncio padrão", "Visibilidade normal"],
  },
  premium: {
    nome: "Premium",
    comissao: 15,
    cor: "amber",
    beneficios: [
      "Destaque na busca",
      "Aparece no topo",
      "Badge especial",
      "Mais visibilidade",
    ],
  },
  new: {
    nome: "Peça Nova",
    comissao: 5,
    cor: "emerald",
    beneficios: [
      "Menor comissão",
      "Badge 'Novo'",
      "Confiança extra",
      "Para lojas parceiras",
    ],
  },
};

export const STATUS_TRANSACAO = {
  pending_payment: {
    nome: "Aguardando Pagamento",
    cor: "yellow",
    descricao: "Pagamento ainda não confirmado",
  },
  payment_confirmed: {
    nome: "Pagamento Confirmado",
    cor: "blue",
    descricao: "Aguardando envio do vendedor",
  },
  shipped: {
    nome: "Enviado",
    cor: "purple",
    descricao: "Peça em trânsito",
  },
  delivered: {
    nome: "Entregue",
    cor: "indigo",
    descricao: "Aguardando confirmação do comprador",
  },
  confirmed: {
    nome: "Confirmado",
    cor: "green",
    descricao: "Transação concluída com sucesso",
  },
  disputed: {
    nome: "Em Disputa",
    cor: "red",
    descricao: "Problema reportado",
  },
};

export const CRITERIOS_AVALIACAO = [
  {
    id: "quality",
    nome: "Qualidade da Peça",
    descricao: "A peça estava conforme anunciado?",
  },
  {
    id: "delivery",
    nome: "Cumprimento da Entrega",
    descricao: "A entrega foi feita no prazo?",
  },
  {
    id: "communication",
    nome: "Comunicação",
    descricao: "O vendedor foi atencioso e respondeu rápido?",
  },
  {
    id: "transparency",
    nome: "Transparência no Vídeo",
    descricao: "O vídeo mostrou bem a peça?",
  },
];

export const SCORE_MINIMO_VENDA = 3.0; // Vendedores podem recusar compradores com score < 3.0

export const VIDEO_CONFIG = {
  maxSizeMB: 100,
  maxDurationSeconds: 180, // 3 minutos
  acceptedFormats: ["video/mp4", "video/webm", "video/quicktime"],
  thumbnailQuality: 0.8,
};

export const PHOTO_CONFIG = {
  maxSizeMB: 5,
  maxPhotos: 6,
  acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
  thumbnailSize: { width: 400, height: 300 },
};

/*
  CATÁLOGO DE PRODUTOS
  =====================
  O jeito mais fácil de mexer aqui é pelo admin.html (formulário visual).
  Editando na mão: copie um bloco { ... } inteiro, cole antes do "];"
  no final, e mude os valores.

  Campos:
  - id: código único, sem espaço (ex: "asuka-01")
  - nome: nome do produto
  - categoria: categoria principal (aparece como grupo no menu e na
               página "Ver Todos Produtos"). Se deixar em branco, o
               produto cai em "Todos os Produtos".
  - subcategoria: opcional — se não preencher, o produto aparece só
                  dentro da categoria, sem subgrupo.
  - preco / precoAntigo: números, sem "R$"
  - destaque: true/false — aparece na 1ª faixa grande, logo após o banner
  - destaque2: true/false — aparece na 2ª faixa grande, uma linha abaixo
  - promocao: true/false — aparece na 3ª faixa, com o título "Promoções"
  - nsfw: true/false — marca a peça como versão 18+ (ativa o filtro
          "Versão NSFW" na página de produtos)
  - escala, material, altura: texto livre
  - status: "sob-encomenda" ou "pronta-entrega"
  - prazo: previsão de entrega — só usado se status = "sob-encomenda".
           É por produto, então cada encomenda pode ter uma data
           diferente (não é fixo pro site inteiro).
  - descricao: parágrafo principal
  - cuidados / informacoes: listas de frases curtas
  - imagens: lista de arquivos dentro de /images/
*/

const PRODUTOS = [
  {
    id: "asuka-01",
    nome: "Asuka Langley",
    categoria: "Neon Genesis Evangelion",
    subcategoria: "",
    preco: 1200,
    precoAntigo: 1450,
    destaque: true,
    destaque2: false,
    promocao: true,
    nsfw: false,
    escala: "1:6",
    material: "100% Resina",
    altura: "Aproximadamente 30 cm com base",
    status: "sob-encomenda",
    prazo: "Abril de 2027",
    descricao: "Figure da Asuka Langley, produzida em resina de alta qualidade e pintura 100% artesanal, feita totalmente à mão.",
    cuidados: [
      "Produto delicado — não é brinquedo",
      "Evitar quedas e impactos",
      "Não expor diretamente ao sol por longos períodos",
      "Limpeza apenas com pano seco ou levemente úmido"
    ],
    informacoes: [
      "Peça indicada para exposição",
      "Ideal para colecionadores",
      "Produto artesanal e exclusivo"
    ],
    imagens: ["placeholder-1.jpg", "placeholder-2.jpg"]
  },
  {
    id: "marika-01",
    nome: "Marika",
    categoria: "Elden Ring",
    subcategoria: "",
    preco: 1200,
    destaque: true,
    destaque2: true,
    promocao: false,
    nsfw: false,
    escala: "1:6",
    material: "100% Resina",
    altura: "Aproximadamente 30 cm com base",
    status: "sob-encomenda",
    prazo: "Abril de 2027",
    descricao: "Figure da Marika, produzida em resina de alta qualidade e pintura 100% artesanal, feita totalmente à mão.",
    cuidados: ["Produto delicado — não é brinquedo", "Evitar quedas e impactos"],
    informacoes: ["Peça indicada para exposição", "Produto artesanal e exclusivo"],
    imagens: ["placeholder-1.jpg"]
  },
  {
    id: "thragg-01",
    nome: "Thragg Invencível",
    categoria: "Invencível",
    subcategoria: "",
    preco: 1500,
    destaque: false,
    destaque2: true,
    promocao: true,
    nsfw: false,
    escala: "1:6",
    material: "100% Resina",
    altura: "Aproximadamente 30 cm com base",
    status: "pronta-entrega",
    prazo: "",
    descricao: "Figure do Thragg, da franquia Invencível, produzida em resina de alta qualidade e pintura 100% artesanal.",
    cuidados: ["Produto delicado — não é brinquedo", "Evitar quedas e impactos"],
    informacoes: ["Peça indicada para exposição", "Produto artesanal e exclusivo"],
    imagens: ["placeholder-1.jpg"]
  }
];

// Número de WhatsApp da loja (com código do país + DDD, só números)
const WHATSAPP_NUMERO = "5511999999999";

// Mensagem padrão enviada ao clicar em "Encomendar via WhatsApp"
function mensagemWhatsApp(produto) {
  const linkProduto = window.location.origin + window.location.pathname.replace(/[^/]*$/, "") + "product.html?id=" + produto.id;
  return "Olá! Tenho interesse na figure " + produto.nome + " e gostaria de fazer uma encomenda.\n\n" +
         "Pode me passar mais informações sobre:\n" +
         "• valor final com frete\n" +
         "• prazo de produção\n" +
         "• opções de escala/tamanho\n\n" +
         linkProduto;
}

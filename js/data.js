/*
  CATÁLOGO DE PRODUTOS
  =====================
  Gerado pelo painel admin.html — pra editar de novo, abra admin.html
  no navegador (duplo clique no arquivo) e clique em "Editar" no produto
  desejado, ou edite este arquivo direto se preferir.
*/

const PRODUTOS = [
  {
    "id": "malenia-elden-ring-diorama-8808",
    "nome": "Malenia Elden ring diorama",
    "categoria": "Elden ring",
    "subcategoria": "",
    "preco": 1200,
    "escala": "1:6",
    "material": "100% Resina",
    "altura": "Aproxidamente 28cm",
    "status": "sob-encomenda",
    "prazo": "Novembro de 2026",
    "destaque": true,
    "destaque2": false,
    "promocao": false,
    "nsfw": false,
    "descricao": "Uma das figures mais impressionantes que já passaram no nosso site! malenia em toda sua gloria! \ncom aproxidamente 28cm de altura feita inteiramente em resina, com pintura a mão!",
    "cuidados": [
      "Produto delicado — não é brinquedo",
      "Evitar quedas e impactos",
      "Limpeza apenas com pano seco ou levemente úmido"
    ],
    "informacoes": [
      "Peça indicada para exposição",
      "Produto artesanal e exclusivo"
    ],
    "imagens": [
      "malenia-elden-ring-diorama-1.jpg",
      "malenia-elden-ring-diorama-2.jpg",
      "malenia-elden-ring-diorama-3.jpg",
      "malenia-elden-ring-diorama-4.jpg"
    ]
  }
];

// Número de WhatsApp da loja (com código do país + DDD, só números)
const WHATSAPP_NUMERO = "5511980443553";

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

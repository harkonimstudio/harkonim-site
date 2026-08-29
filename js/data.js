/*
  CATÁLOGO DE PRODUTOS
  =====================
  Gerado pelo painel admin.html — pra editar de novo, abra admin.html
  no navegador (duplo clique no arquivo) e clique em "Editar" no produto
  desejado, ou edite este arquivo direto se preferir.
*/

const PRODUTOS = [
  {
    "id": "lucia-caminos-figure-colecionavel-gta-0207",
    "nome": "Lucia caminos - figure colecionavel GTA",
    "categoria": "Games",
    "subcategoria": "",
    "preco": 650,
    "escala": "1:6",
    "material": "100% Resina",
    "altura": "Aproximadamente 28cm",
    "status": "sob-encomenda",
    "destaque": true,
    "destaque2": false,
    "promocao": false,
    "nsfw": false,
    "descricao": "Ambas as versões disponiveis!",
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
      "lucia-caminos-figure-colecionavel-gta-uaizan69-1.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-2.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-3.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-4.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-5.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-6.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-7.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-8.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-9.jpg",
      "lucia-caminos-figure-colecionavel-gta-uaizan69-10.jpg"
    ]
  }
];

// Número de WhatsApp da loja (com código do país + DDD, só números)
const WHATSAPP_NUMERO = "5511980443553";

// Mensagem padrão enviada ao clicar em "Encomendar via WhatsApp"
function mensagemWhatsApp(produto) {
  const linkProduto = window.location.href.replace(/[^/]*$/, "") + "product.html?id=" + produto.id;
  return "Olá! Tenho interesse na figure " + produto.nome + " e gostaria de fazer uma encomenda.\n\n" +
         "Pode me passar mais informações sobre:\n" +
         "• valor final com frete\n" +
         "• prazo de produção\n" +
         "• opções de escala/tamanho\n\n" +
         linkProduto;
}

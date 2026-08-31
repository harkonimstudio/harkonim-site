/*
  CATÁLOGO DE PRODUTOS
  =====================
  Gerado pelo painel admin.html — pra editar de novo, abra admin.html
  no navegador (duplo clique no arquivo) e clique em "Editar" no produto
  desejado, ou edite este arquivo direto se preferir.
*/

const PRODUTOS = [
  {
    "id": "james-sunderland-silent-hill-2-figure-colecionavel-1626",
    "nome": "James sunderland silent hill 2 - Figure colecionavel",
    "categoria": "Silent hill",
    "subcategoria": "",
    "preco": 600,
    "escala": "1:6",
    "material": "100% Resina",
    "altura": "Aproximadamente 26cm",
    "status": "sob-encomenda",
    "destaque": false,
    "destaque2": false,
    "promocao": true,
    "nsfw": false,
    "descricao": "",
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
      "produto-9nry1gwt-1.jpg",
      "produto-9nry1gwt-2.jpg",
      "produto-9nry1gwt-3.jpg",
      "produto-9nry1gwt-4.jpg",
      "produto-9nry1gwt-5.jpg",
      "produto-9nry1gwt-6.jpg"
    ]
  },
  {
    "id": "dante-and-the-reaper-figure-colecionavel-devil-may-cry-6420",
    "nome": "Dante and the reaper - Figure colecionavel Devil may cry",
    "categoria": "Games",
    "subcategoria": "",
    "preco": 900,
    "escala": "1:9",
    "material": "100% Resina",
    "altura": "",
    "status": "sob-encomenda",
    "destaque": true,
    "destaque2": false,
    "promocao": false,
    "nsfw": false,
    "descricao": "",
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
      "produto-9pzqs2hm-1.jpg",
      "produto-9pzqs2hm-2.jpg",
      "produto-9pzqs2hm-3.jpg",
      "produto-9pzqs2hm-4.jpg",
      "produto-9pzqs2hm-5.jpg",
      "produto-9pzqs2hm-6.jpg",
      "produto-9pzqs2hm-7.jpg"
    ]
  },
  {
    "id": "manyuu-chifusa-peach-figure-figure-colecionavel-7044",
    "nome": "Manyuu Chifusa peach figure - Figure colecionavel",
    "categoria": "+18",
    "subcategoria": "",
    "preco": 550,
    "escala": "1:9",
    "material": "100% Resina",
    "altura": "Aproximadamente 18cm",
    "status": "sob-encomenda",
    "destaque": false,
    "destaque2": false,
    "promocao": false,
    "nsfw": true,
    "descricao": "",
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
      "produto-9r64ta32-1.jpg",
      "produto-9r64ta32-2.jpg",
      "produto-9r64ta32-3.jpg",
      "produto-9r64ta32-4.jpg",
      "produto-9r64ta32-5.jpg"
    ]
  },
  {
    "id": "valus-the-first-colossus-figure-colecionavel-4712",
    "nome": "Valus the First colossus - Figure colecionavel",
    "categoria": "Games",
    "subcategoria": "Shadow of the colossus",
    "preco": 600,
    "escala": "1:12",
    "material": "100% Resina",
    "altura": "Aproximadamente 19cm",
    "status": "sob-encomenda",
    "destaque": false,
    "destaque2": true,
    "promocao": false,
    "nsfw": false,
    "descricao": "",
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
      "produto-9tr1vxl8-1.png",
      "produto-9tr1vxl8-2.png",
      "produto-9tr1vxl8-3.png",
      "produto-9tr1vxl8-4.png"
    ]
  },
  {
    "id": "juri-han-figure-colecionavel-street-fighter-7174",
    "nome": "Juri han - Figure colecionavel Street fighter",
    "categoria": "Street Fighter",
    "subcategoria": "",
    "preco": 600,
    "escala": "1:9",
    "material": "100% Resina",
    "altura": "Aproximadamente 26cm",
    "status": "sob-encomenda",
    "destaque": true,
    "destaque2": false,
    "promocao": false,
    "nsfw": false,
    "descricao": "",
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
      "produto-9w9wscyd-1.jpg",
      "produto-9w9wscyd-2.jpg",
      "produto-9w9wscyd-3.jpg",
      "produto-9w9wscyd-4.jpg",
      "produto-9w9wscyd-5.jpg",
      "produto-9w9wscyd-6.jpg",
      "produto-9w9wscyd-7.jpg"
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

document.getElementById("ultimaAtualizacao").textContent = ULTIMA_ATUALIZACAO_FILA;

// Banner pequeno no topo (opcional — some sozinho se não tiver imagem configurada)
if (SITE_CONFIG.filaImagem) {
  const heroEl = document.getElementById("filaHero");
  const img = document.createElement("img");
  img.src = "images/" + SITE_CONFIG.filaImagem;
  img.alt = "";
  img.onerror = () => img.remove();
  heroEl.insertBefore(img, heroEl.firstChild);
}

const ETAPAS = [
  {
    chave: "aguardando",
    titulo: "Aguardando produção",
    desc: "O pedido está na fila, respeitando a ordem de chegada e a complexidade de cada peça, até começar a ser impresso."
  },
  {
    chave: "impressao",
    titulo: "Em impressão",
    desc: "A peça está sendo impressa em resina, camada por camada, no ateliê."
  },
  {
    chave: "acabamento",
    titulo: "Em acabamento",
    desc: "Passa por lavagem, cura, remoção dos suportes de impressão e lixamento, deixando a superfície pronta pra pintura."
  },
  {
    chave: "pintura",
    titulo: "Pintura",
    desc: "Recebe as cores e o acabamento manual — sombreados, efeitos e os detalhes que dão vida ao personagem."
  },
  {
    chave: "embalagem",
    titulo: "Embalagem",
    desc: "Peça finalizada, sendo embalada com cuidado pra seguir viagem."
  },
  {
    chave: "enviado",
    titulo: "Enviado",
    desc: "Já despachado, a caminho do endereço. O código de rastreamento é enviado assim que disponível."
  }
];

const conteudo = document.getElementById("filaConteudo");

ETAPAS.forEach((etapa, i) => {
  const itens = FILA_PRODUCAO.filter(item => item.etapa === etapa.chave);
  if (!itens.length) return;

  const bloco = document.createElement("div");
  bloco.className = "fila-stage";
  bloco.innerHTML = `
    <span class="fila-stage-num">${String(i + 1).padStart(2, "0")}</span>
    <div class="fila-stage-body">
      <h3>${etapa.titulo}</h3>
      <p class="fila-stage-desc">${etapa.desc}</p>
      ${itens.map(item => `<div class="fila-item"><span>${item.nome}</span><span class="codigo">${item.codigo}</span></div>`).join("")}
    </div>
  `;
  conteudo.appendChild(bloco);
});

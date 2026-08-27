document.getElementById("navEncomenda").href =
  "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO +
  "&text=" + encodeURIComponent("Olá! Gostaria de fazer uma encomenda personalizada.");

document.getElementById("ultimaAtualizacao").textContent = ULTIMA_ATUALIZACAO_FILA;

const ETAPAS = [
  { chave: "aguardando", titulo: "Aguardando Impressão" },
  { chave: "impressao", titulo: "Em Impressão" },
  { chave: "acabamento", titulo: "Em Acabamento" },
  { chave: "pintura", titulo: "Pintura" },
  { chave: "embalagem", titulo: "Embalagem" },
  { chave: "enviado", titulo: "Enviado" }
];

const conteudo = document.getElementById("filaConteudo");

ETAPAS.forEach(etapa => {
  const itens = FILA_PRODUCAO.filter(i => i.etapa === etapa.chave);
  if (!itens.length) return;

  const bloco = document.createElement("div");
  bloco.className = "fila-stage";
  bloco.innerHTML = `<h3>${etapa.titulo}</h3>` +
    itens.map(i => `<div class="fila-item"><span>${i.nome}</span><span class="codigo">${i.codigo}</span></div>`).join("");
  conteudo.appendChild(bloco);
});

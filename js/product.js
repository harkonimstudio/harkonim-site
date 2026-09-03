const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const produto = PRODUTOS.find(p => p.id === id) || PRODUTOS[0];

document.getElementById("pageTitle").textContent = produto.nome + " — Harkonim Studio";
document.getElementById("crumbCat").textContent = produto.categoria;
document.getElementById("crumbName").textContent = produto.nome;

document.getElementById("prodCat").textContent = produto.categoria;
document.getElementById("prodName").textContent = produto.nome;
document.getElementById("prodPrice").innerHTML = produto.precoAntigo
  ? `<span class="price-old">R$ ${produto.precoAntigo.toLocaleString("pt-BR")}</span>R$ ${produto.preco.toLocaleString("pt-BR")}`
  : "R$ " + produto.preco.toLocaleString("pt-BR");
document.getElementById("prodInstallment").textContent =
  "12x de R$ " + (produto.preco / 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

document.getElementById("specNome").textContent = produto.nome;
document.getElementById("specCategoria").textContent = produto.categoria;
document.getElementById("specMaterial").textContent = produto.material;
document.getElementById("specEscala").textContent = produto.escala;
document.getElementById("specAltura").textContent = produto.altura;
document.getElementById("prodDescricao").textContent = produto.descricao;

document.getElementById("cuidadosList").innerHTML =
  produto.cuidados.map(c => `<li>${c}</li>`).join("");
document.getElementById("informacoesList").innerHTML =
  produto.informacoes.map(i => `<li>${i}</li>`).join("");

// Banner de status (sob encomenda / pronta entrega)
const banner = document.getElementById("statusBanner");
if (produto.status === "sob-encomenda") {
  banner.className = "status-banner sob-encomenda";
  banner.textContent = "Produto disponível sob encomenda • entrega prevista para " + SITE_CONFIG.prazoEntregaPadrao;
} else {
  banner.className = "status-banner pronta-entrega";
  banner.textContent = "Produto pronto — envio imediato após confirmação do pagamento";
}

// Galeria
const mainImage = document.getElementById("mainImage");
const thumbs = document.getElementById("thumbs");
mainImage.src = "images/" + produto.imagens[0];
mainImage.alt = produto.nome;

produto.imagens.forEach((img, i) => {
  const thumb = document.createElement("img");
  thumb.src = "images/" + img;
  thumb.className = i === 0 ? "active" : "";
  thumb.addEventListener("click", () => {
    mainImage.src = "images/" + img;
    thumbs.querySelectorAll("img").forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
  });
  thumbs.appendChild(thumb);
});

// Botão do WhatsApp
const btn = document.getElementById("btnWhatsapp");
btn.addEventListener("click", () => {
  const link = "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO +
    "&text=" + encodeURIComponent(mensagemWhatsApp(produto));
  window.open(link, "_blank");
});

// Link de "Faça sua encomenda" do topo

// ---- Calculadora de frete ----
// IMPORTANTE: isso é um placeholder. Calcular o valor real dos Correios
// exige uma API paga/autenticada que não dá pra chamar direto do navegador
// (precisaria de um servidor no meio). Por enquanto, o botão só confirma
// que o CEP é válido e direciona a pessoa a perguntar o valor exato no
// WhatsApp — que é exatamente o que a JC Figures também faz na prática
// (o valor de frete só é fechado na conversa, mesmo lá).
document.getElementById("btnCalcularFrete").addEventListener("click", () => {
  const cep = document.getElementById("cepInput").value.replace(/\D/g, "");
  const resultEl = document.getElementById("shippingResult");
  if (cep.length !== 8) {
    resultEl.textContent = "Digite um CEP válido (8 números).";
    return;
  }
  resultEl.textContent = "Estimativa: R$ 30 via PAC, R$ 60 via Sedex (varia por região). O valor exato é calculado com precisão na hora da compra — clique em \"Encomendar via WhatsApp\" e informe esse CEP.";
});

// ---- Compartilhamento social ----
const paginaAtual = window.location.href;
document.getElementById("shareFacebook").href =
  "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(paginaAtual);
document.getElementById("shareX").href =
  "https://twitter.com/intent/tweet?url=" + encodeURIComponent(paginaAtual) + "&text=" + encodeURIComponent(produto.nome);
document.getElementById("sharePinterest").href =
  "https://pinterest.com/pin/create/button/?url=" + encodeURIComponent(paginaAtual) +
  "&description=" + encodeURIComponent(produto.nome);

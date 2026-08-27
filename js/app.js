// ---- Link genérico do WhatsApp (topo e hero) ----
const linkEncomendaGeral = "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO +
  "&text=" + encodeURIComponent("Olá! Gostaria de fazer uma encomenda personalizada.");
document.getElementById("navEncomenda").href = linkEncomendaGeral;

// ---- Hero, montado a partir do site-config.js ----
document.getElementById("heroEyebrow").textContent = SITE_CONFIG.heroEyebrow;
document.getElementById("heroTitle").innerHTML = SITE_CONFIG.heroTitulo + "<br><em>" + SITE_CONFIG.heroTituloDestaque + "</em>";
document.getElementById("heroSub").textContent = SITE_CONFIG.heroSubtitulo;
const heroBtn = document.getElementById("heroBtn");
heroBtn.textContent = SITE_CONFIG.heroBotaoTexto;
heroBtn.href = linkEncomendaGeral;

const heroImg = document.getElementById("heroImage");
heroImg.src = "images/" + SITE_CONFIG.heroImagem;
heroImg.onerror = () => { heroImg.style.display = "none"; };

// ---- Componente reutilizável: bloco grande edge-to-edge ----
function criarTile(p) {
  const tile = document.createElement("a");
  tile.className = "featured-tile";
  tile.href = "product.html?id=" + p.id;
  tile.innerHTML = `
    ${p.nsfw ? '<span class="badge-nsfw">18+</span>' : ""}
    <img src="images/${p.imagens[0]}" alt="${p.nome}" onerror="this.remove()">
    <div class="tile-overlay">
      <span class="tile-cat">${p.categoria}</span>
      <span class="tile-name">${p.nome}</span>
    </div>
  `;
  return tile;
}

// ---- As 3 faixas: destaque, destaque2, promocao ----
PRODUTOS.filter(p => p.destaque).slice(0, 3)
  .forEach(p => document.getElementById("featuredStrip").appendChild(criarTile(p)));

PRODUTOS.filter(p => p.destaque2).slice(0, 3)
  .forEach(p => document.getElementById("featuredStrip2").appendChild(criarTile(p)));

PRODUTOS.filter(p => p.promocao).slice(0, 3)
  .forEach(p => document.getElementById("featuredStripPromo").appendChild(criarTile(p)));

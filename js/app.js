// ---- Hero: só a imagem, com fade suave ao carregar a página ----
const heroImg = document.getElementById("heroImage");
heroImg.src = "images/" + SITE_CONFIG.heroImagem;
heroImg.onerror = () => { document.getElementById("heroFull").style.display = "none"; };

// ---- Componente reutilizável: bloco grande edge-to-edge, com troca de
//      imagem no hover (crossfade) quando o produto tem uma 2ª foto ----
function criarTile(p) {
  const tile = document.createElement("a");
  tile.className = "featured-tile fade-in-item";
  tile.href = "product.html?id=" + p.id;

  const segundaImagem = p.imagens[1]
    ? `<img class="img-hover" src="images/${p.imagens[1]}" alt="" onerror="this.remove()">`
    : "";

  tile.innerHTML = `
    <div class="tile-media">
      ${p.nsfw ? '<span class="badge-nsfw">18+</span>' : ""}
      <img class="img-base" src="images/${p.imagens[0]}" alt="${p.nome}" onerror="this.remove()">
      ${segundaImagem}
    </div>
    <div class="tile-info">
      <span class="tile-cat">${p.categoria}</span>
      <span class="tile-name">${p.nome}</span>
      <span class="tile-price">R$ ${p.preco.toLocaleString("pt-BR")}</span>
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

// ---- Fade-in suave conforme o usuário rola a página ----
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in-item").forEach(el => observador.observe(el));

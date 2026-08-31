
const params = new URLSearchParams(window.location.search);
let filtroCategoria = params.get("cat") || null;
let filtroSubcategoria = params.get("sub") || null;

// ---- Monta a árvore de categorias > subcategorias na sidebar ----
const grupos = {};
PRODUTOS.forEach(p => {
  const cat = p.categoria || "Todos os Produtos";
  if (!grupos[cat]) grupos[cat] = new Set();
  grupos[cat].add(p.subcategoria || "Todos os Produtos");
});

const listaCategorias = document.getElementById("listaCategorias");

function montarSidebar() {
  listaCategorias.innerHTML = "";

  const linkTodos = document.createElement("a");
  linkTodos.href = "produtos.html";
  linkTodos.textContent = "Todos os Produtos";
  linkTodos.className = !filtroCategoria ? "active" : "";
  linkTodos.style.display = "block";
  linkTodos.style.fontSize = "0.88rem";
  linkTodos.style.padding = "6px 0 12px";
  listaCategorias.appendChild(linkTodos);

  Object.keys(grupos).forEach(cat => {
    const div = document.createElement("div");
    div.className = "sidebar-cat";
    const a = document.createElement("a");
    a.href = "produtos.html?cat=" + encodeURIComponent(cat);
    a.textContent = cat;
    if (filtroCategoria === cat) a.classList.add("active");
    div.appendChild(a);

    if (filtroCategoria === cat) {
      const subList = document.createElement("div");
      subList.className = "sidebar-sub-list";
      [...grupos[cat]].forEach(sub => {
        const subA = document.createElement("a");
        subA.href = "produtos.html?cat=" + encodeURIComponent(cat) + "&sub=" + encodeURIComponent(sub);
        subA.textContent = sub;
        if (filtroSubcategoria === sub) subA.classList.add("active");
        subList.appendChild(subA);
      });
      div.appendChild(subList);
    }
    listaCategorias.appendChild(div);
  });
}

montarSidebar();

// ---- Título da página ----
document.getElementById("tituloListagem").textContent =
  filtroSubcategoria || filtroCategoria || "Todos os Produtos";

// ---- Filtros adicionais (NSFW, preço) ----
document.getElementById("filtroNsfw").addEventListener("change", renderizar);
document.getElementById("precoDe").addEventListener("input", renderizar);
document.getElementById("precoAte").addEventListener("input", renderizar);
document.getElementById("ordenarPor").addEventListener("change", renderizar);

function criarCard(p) {
  const card = document.createElement("a");
  card.className = "card";
  card.href = "product.html?id=" + p.id;
  const statusLabel = p.status === "sob-encomenda" ? "Sob encomenda" : "Pronta entrega";
  const precoHtml = p.precoAntigo
    ? `<span class="price-old">R$ ${p.precoAntigo.toLocaleString("pt-BR")}</span>R$ ${p.preco.toLocaleString("pt-BR")}`
    : `R$ ${p.preco.toLocaleString("pt-BR")}`;

  card.innerHTML = `
    <div class="card-media">
      ${p.nsfw ? '<span class="badge-nsfw">18+</span>' : ""}
      <img class="img-base" src="images/${p.imagens[0]}" alt="${p.nome}" onerror="this.remove()">
      ${p.imagens[1] ? `<img class="img-hover" src="images/${p.imagens[1]}" alt="" onerror="this.remove()">` : ""}
      <span class="fallback-name">${p.nome}</span>
    </div>
    <div class="card-body">
      <span class="card-cat">${p.categoria}</span>
      <span class="card-name">${p.nome}</span>
      <span class="card-status">${statusLabel}</span>
      <span class="card-price">${precoHtml}</span>
    </div>
  `;
  return card;
}

function renderizar() {
  let lista = [...PRODUTOS];

  if (filtroCategoria) lista = lista.filter(p => (p.categoria || "Todos os Produtos") === filtroCategoria);
  if (filtroSubcategoria) lista = lista.filter(p => (p.subcategoria || "Todos os Produtos") === filtroSubcategoria);

  // Conteúdo +18 fica escondido por padrão — só aparece se a pessoa marcar o filtro
  if (!document.getElementById("filtroNsfw").checked) lista = lista.filter(p => !p.nsfw);

  const de = parseFloat(document.getElementById("precoDe").value);
  const ate = parseFloat(document.getElementById("precoAte").value);
  if (!isNaN(de)) lista = lista.filter(p => p.preco >= de);
  if (!isNaN(ate)) lista = lista.filter(p => p.preco <= ate);

  const ordenar = document.getElementById("ordenarPor").value;
  if (ordenar === "menor-preco") lista.sort((a, b) => a.preco - b.preco);
  if (ordenar === "maior-preco") lista.sort((a, b) => b.preco - a.preco);

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  lista.forEach(p => grid.appendChild(criarCard(p)));

  document.getElementById("contagemResultados").textContent =
    lista.length + (lista.length === 1 ? " produto" : " produtos");
}

renderizar();

const params = new URLSearchParams(window.location.search);
let filtroCategoria = params.get("cat") || null;
let filtroSubcategoria = params.get("sub") || null;

// "Sem categoria" é o marcador de produto "fantasma" — existe no catálogo
// (o link direto funciona normalmente), mas nunca aparece navegando por
// categoria nem na lista geral sem filtro.
const PRODUTOS_VISIVEIS = PRODUTOS.filter(p => (p.categoria || "Sem categoria") !== "Sem categoria");

// ---- Monta a árvore de categorias > subcategorias na sidebar ----
// Só entra subcategoria real (não vazia). Uma categoria só ganha submenu
// se tiver 2 ou mais subcategorias diferentes de verdade — senão clicar
// no nome da categoria já mostra tudo, e o submenu seria redundante.
const grupos = {};
PRODUTOS_VISIVEIS.forEach(p => {
  const cat = p.categoria;
  if (!grupos[cat]) grupos[cat] = new Set();
  if (p.subcategoria) grupos[cat].add(p.subcategoria);
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

    const subs = [...grupos[cat]];
    if (filtroCategoria === cat && subs.length >= 2) {
      const subList = document.createElement("div");
      subList.className = "sidebar-sub-list";
      subs.forEach(sub => {
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
// Ativar o filtro +18 pede confirmação antes, com o fundo borrado.
// Depois de confirmado uma vez, fica lembrado enquanto a aba do
// navegador estiver aberta — não pede de novo ao trocar de categoria.
// Fecha a aba (ou passa muito tempo), pede confirmação de novo.
const checkboxNsfw = document.getElementById("filtroNsfw");
const modalNsfw = document.getElementById("modalNsfw");

if (sessionStorage.getItem("nsfwAtivo") === "1") {
  checkboxNsfw.checked = true;
}

checkboxNsfw.addEventListener("change", () => {
  if (checkboxNsfw.checked) {
    if (sessionStorage.getItem("nsfwVerificado") === "1") {
      sessionStorage.setItem("nsfwAtivo", "1");
      renderizar();
    } else {
      checkboxNsfw.checked = false; // só marca de verdade depois da confirmação
      modalNsfw.classList.add("aberto");
    }
  } else {
    sessionStorage.setItem("nsfwAtivo", "0");
    renderizar();
  }
});

document.getElementById("btnNsfwConfirmar").addEventListener("click", () => {
  checkboxNsfw.checked = true;
  sessionStorage.setItem("nsfwVerificado", "1");
  sessionStorage.setItem("nsfwAtivo", "1");
  modalNsfw.classList.remove("aberto");
  renderizar();
});

document.getElementById("btnNsfwCancelar").addEventListener("click", () => {
  modalNsfw.classList.remove("aberto");
});
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
  let lista = [...PRODUTOS_VISIVEIS];

  if (filtroCategoria) lista = lista.filter(p => p.categoria === filtroCategoria);
  if (filtroSubcategoria) lista = lista.filter(p => p.subcategoria === filtroSubcategoria);

  // Por padrão, +18 fica escondido. Marcando o filtro, mostra SÓ os +18
  // (não mistura com o resto do catálogo).
  const quer18 = document.getElementById("filtroNsfw").checked;
  lista = lista.filter(p => quer18 ? p.nsfw : !p.nsfw);

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

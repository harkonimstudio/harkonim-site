// Incluído em index.html, product.html e produtos.html
// (sempre depois de data.js). Monta o dropdown "Ver Todos Produtos"
// agrupando categoria -> subcategorias, a partir de PRODUTOS.
// Se um produto não tem subcategoria definida, ele entra no grupo
// genérico "Todos os Produtos" dentro da categoria dele.

function montarDropdownCategorias() {
  const panel = document.getElementById("dropdownPanel");
  const trigger = document.getElementById("dropdownTrigger");
  const wrapper = document.getElementById("navDropdown");
  if (!panel || !trigger || !wrapper) return;

  const grupos = {};
  PRODUTOS.forEach(p => {
    const cat = p.categoria || "Todos os Produtos";
    if (!grupos[cat]) grupos[cat] = new Set();
    grupos[cat].add(p.subcategoria || "Todos os Produtos");
  });

  panel.innerHTML = "";
  Object.keys(grupos).forEach(categoria => {
    const col = document.createElement("div");
    col.className = "dropdown-group";

    const subs = [...grupos[categoria]];
    const subLinks = subs.map(sub =>
      `<a href="produtos.html?cat=${encodeURIComponent(categoria)}&sub=${encodeURIComponent(sub)}">${sub}</a>`
    ).join("");

    col.innerHTML = `
      <h4><a href="produtos.html?cat=${encodeURIComponent(categoria)}" style="color:inherit; text-transform:none; padding:0;">${categoria}</a></h4>
      ${subLinks}
    `;
    panel.appendChild(col);
  });

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) wrapper.classList.remove("open");
  });
}

montarDropdownCategorias();

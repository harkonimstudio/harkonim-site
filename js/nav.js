// Incluído em index.html, product.html e produtos.html
// (sempre depois de data.js). Monta o dropdown "Ver Todos Produtos"
// agrupando categoria -> subcategorias, a partir de PRODUTOS.
// Se um produto não tem subcategoria definida, ele entra no grupo
// genérico "Todos os Produtos" dentro da categoria dele.
// Também injeta o botão flutuante de WhatsApp, presente em todas as páginas.

function montarBotaoFlutuante() {
  if (document.getElementById("botaoFlutuanteWpp")) return;
  const link = "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO +
    "&text=" + encodeURIComponent("Olá! Gostaria de fazer uma encomenda.");
  const btn = document.createElement("a");
  btn.id = "botaoFlutuanteWpp";
  btn.className = "float-whatsapp";
  btn.href = link;
  btn.target = "_blank";
  btn.rel = "noopener";
  btn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C22 6.45 17.55 2 12.04 2zm5.85 14.05c-.25.7-1.45 1.34-2 1.42-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.26-5.04-4.46-.15-.2-1.21-1.6-1.21-3.06 0-1.45.76-2.16 1.03-2.46.27-.29.6-.37.8-.37h.57c.18 0 .43-.07.67.51.25.6.85 2.06.92 2.21.07.15.12.32.02.52-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.15.28.68 1.12 1.46 1.82 1.01.9 1.86 1.18 2.14 1.31.28.14.44.12.6-.07.17-.2.71-.83.9-1.11.19-.28.38-.24.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.32.07.12.07.68-.18 1.38z"/>
    </svg>
    <span>Encomende</span>
  `;
  document.body.appendChild(btn);

  const footerWpp = document.getElementById("footerWhatsapp");
  if (footerWpp) footerWpp.href = link;
}
montarBotaoFlutuante();

// ---- Menu hambúrguer (mobile) ----
const mobileBtn = document.getElementById("mobileMenuBtn");
const navLinksEl = document.getElementById("navLinks");
if (mobileBtn && navLinksEl) {
  mobileBtn.addEventListener("click", () => {
    const aberto = navLinksEl.classList.toggle("mobile-aberto");
    mobileBtn.textContent = aberto ? "✕" : "☰";
  });
  // Fecha o menu ao clicar em qualquer link dentro dele (exceto o próprio
  // gatilho do dropdown "Ver Todos Produtos", que só abre o submenu)
  navLinksEl.querySelectorAll("a:not(#dropdownTrigger)").forEach(a => {
    a.addEventListener("click", () => {
      navLinksEl.classList.remove("mobile-aberto");
      mobileBtn.textContent = "☰";
    });
  });
}

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

  // Desktop: abre no mouseenter, fecha no mouseleave com uma pequena
  // margem de tempo — assim dá pra mover o mouse do link até o painel
  // sem ele fechar no meio do caminho.
  let timeoutFechar = null;
  wrapper.addEventListener("mouseenter", () => {
    clearTimeout(timeoutFechar);
    wrapper.classList.add("open");
  });
  wrapper.addEventListener("mouseleave", () => {
    timeoutFechar = setTimeout(() => wrapper.classList.remove("open"), 300);
  });

  // Touch (sem hover): primeiro toque abre o painel; toque fora fecha.
  let travadoPorToque = false;
  wrapper.addEventListener("touchstart", (e) => {
    if (!wrapper.classList.contains("open")) {
      e.preventDefault();
      wrapper.classList.add("open");
      travadoPorToque = true;
    }
  }, { passive: false });
  document.addEventListener("click", (e) => {
    if (travadoPorToque && !wrapper.contains(e.target)) {
      wrapper.classList.remove("open");
      travadoPorToque = false;
    }
  });
}

montarDropdownCategorias();

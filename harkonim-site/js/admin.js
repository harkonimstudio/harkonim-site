// Cópia local do catálogo (não mexe no data.js original até você exportar)
let produtosState = JSON.parse(JSON.stringify(PRODUTOS));
let imagensAtuais = []; // [{file, nomeSugerido, url}] pro produto sendo editado no formulário

document.getElementById("fWhatsapp").value = WHATSAPP_NUMERO;

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ---------- Lista de produtos ----------
function renderLista() {
  const list = document.getElementById("productList");
  document.getElementById("countProdutos").textContent = produtosState.length;
  list.innerHTML = "";

  document.getElementById("categoriasExistentes").innerHTML =
    [...new Set(produtosState.map(p => p.categoria))].map(c => `<option value="${c}">`).join("");
  document.getElementById("subcategoriasExistentes").innerHTML =
    [...new Set(produtosState.map(p => p.subcategoria).filter(Boolean))].map(c => `<option value="${c}">`).join("");

  produtosState.forEach((p, i) => {
    const item = document.createElement("div");
    item.className = "plist-item";
    const thumbStyle = p.imagens && p.imagens[0] && p._previewUrls && p._previewUrls[0]
      ? `background-image:url(${p._previewUrls[0]}); background-size:cover; background-position:center;`
      : "";
    item.innerHTML = `
      <div class="plist-thumb" style="${thumbStyle}"></div>
      <div class="plist-info">
        <div class="n">${p.nome}</div>
        <div class="c">${p.categoria} • R$ ${Number(p.preco).toLocaleString("pt-BR")}</div>
      </div>
      <div class="plist-actions">
        <button data-action="edit" data-i="${i}">Editar</button>
        <button data-action="del" data-i="${i}">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll("button[data-action='edit']").forEach(btn =>
    btn.addEventListener("click", () => carregarNoForm(parseInt(btn.dataset.i))));
  list.querySelectorAll("button[data-action='del']").forEach(btn =>
    btn.addEventListener("click", () => {
      if (confirm("Excluir este produto do catálogo?")) {
        produtosState.splice(parseInt(btn.dataset.i), 1);
        renderLista();
      }
    }));
}

// ---------- Imagens (upload + preview + renomeação sugerida) ----------
const imageDrop = document.getElementById("imageDrop");
const imageInput = document.getElementById("imageInput");
const imagePreviews = document.getElementById("imagePreviews");

imageDrop.addEventListener("click", () => imageInput.click());
imageDrop.addEventListener("dragover", e => { e.preventDefault(); imageDrop.style.borderColor = "var(--amber)"; });
imageDrop.addEventListener("dragleave", () => { imageDrop.style.borderColor = "var(--line)"; });
imageDrop.addEventListener("drop", e => {
  e.preventDefault();
  imageDrop.style.borderColor = "var(--line)";
  adicionarImagens(e.dataTransfer.files);
});
imageInput.addEventListener("change", () => adicionarImagens(imageInput.files));

function adicionarImagens(fileList) {
  const nomeBase = slugify(document.getElementById("fNome").value || "produto");
  Array.from(fileList).forEach((file, idx) => {
    const ext = file.name.split(".").pop();
    const nomeSugerido = `${nomeBase}-${imagensAtuais.length + 1}.${ext}`;
    const url = URL.createObjectURL(file);
    imagensAtuais.push({ file, nomeSugerido, url });
  });
  renderPreviews();
}

function renderPreviews() {
  imagePreviews.innerHTML = "";
  imagensAtuais.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "image-preview";
    div.innerHTML = `
      <img src="${img.url}" alt="">
      <span class="fname">${img.nomeSugerido}</span>
      <a href="${img.url}" download="${img.nomeSugerido}">Baixar renomeada ↓</a>
      <a href="#" data-remove="${i}" style="color:var(--text-muted);">remover</a>
    `;
    imagePreviews.appendChild(div);
  });
  imagePreviews.querySelectorAll("[data-remove]").forEach(a =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      imagensAtuais.splice(parseInt(a.dataset.remove), 1);
      renderPreviews();
    }));
}

// ---------- Formulário: salvar / editar / limpar ----------
function limparForm() {
  document.getElementById("editIndex").value = -1;
  document.getElementById("formTitle").textContent = "Novo produto";
  ["fNome","fCategoria","fSubcategoria","fEscala","fPreco","fPrecoAntigo","fMaterial","fAltura","fPrazo"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("fEscala").value = "1:6";
  document.getElementById("fMaterial").value = "100% Resina";
  document.getElementById("fStatus").value = "sob-encomenda";
  document.getElementById("fDestaque").checked = false;
  document.getElementById("fDestaque2").checked = false;
  document.getElementById("fPromocao").checked = false;
  document.getElementById("fNsfw").checked = false;
  document.getElementById("fDescricao").value = "";
  document.getElementById("fCuidados").value = "Produto delicado — não é brinquedo\nEvitar quedas e impactos\nLimpeza apenas com pano seco ou levemente úmido";
  document.getElementById("fInformacoes").value = "Peça indicada para exposição\nProduto artesanal e exclusivo";
  imagensAtuais = [];
  renderPreviews();
}

function carregarNoForm(i) {
  const p = produtosState[i];
  document.getElementById("editIndex").value = i;
  document.getElementById("formTitle").textContent = "Editando: " + p.nome;
  document.getElementById("fNome").value = p.nome;
  document.getElementById("fCategoria").value = p.categoria;
  document.getElementById("fSubcategoria").value = p.subcategoria || "";
  document.getElementById("fEscala").value = p.escala;
  document.getElementById("fPreco").value = p.preco;
  document.getElementById("fPrecoAntigo").value = p.precoAntigo || "";
  document.getElementById("fMaterial").value = p.material;
  document.getElementById("fAltura").value = p.altura;
  document.getElementById("fStatus").value = p.status;
  document.getElementById("fPrazo").value = p.prazo || "";
  document.getElementById("fDestaque").checked = !!p.destaque;
  document.getElementById("fDestaque2").checked = !!p.destaque2;
  document.getElementById("fPromocao").checked = !!p.promocao;
  document.getElementById("fNsfw").checked = !!p.nsfw;
  document.getElementById("fDescricao").value = p.descricao;
  document.getElementById("fCuidados").value = (p.cuidados || []).join("\n");
  document.getElementById("fInformacoes").value = (p.informacoes || []).join("\n");
  // Observação: fotos já salvas anteriormente precisam ser re-anexadas se quiser trocar,
  // já que o navegador não tem acesso ao arquivo original depois de fechar a página.
  imagensAtuais = [];
  renderPreviews();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("btnLimparForm").addEventListener("click", limparForm);

document.getElementById("btnSalvarProduto").addEventListener("click", () => {
  const nome = document.getElementById("fNome").value.trim();
  if (!nome) { alert("Preencha ao menos o nome do produto."); return; }

  const editIndex = parseInt(document.getElementById("editIndex").value);
  const existente = editIndex >= 0 ? produtosState[editIndex] : null;

  const novoProduto = {
    id: existente ? existente.id : slugify(nome) + "-" + Date.now().toString().slice(-4),
    nome,
    categoria: document.getElementById("fCategoria").value.trim() || "Sem categoria",
    subcategoria: document.getElementById("fSubcategoria").value.trim(),
    preco: Number(document.getElementById("fPreco").value) || 0,
    escala: document.getElementById("fEscala").value.trim(),
    material: document.getElementById("fMaterial").value.trim(),
    altura: document.getElementById("fAltura").value.trim(),
    status: document.getElementById("fStatus").value,
    prazo: document.getElementById("fPrazo").value.trim(),
    destaque: document.getElementById("fDestaque").checked,
    destaque2: document.getElementById("fDestaque2").checked,
    promocao: document.getElementById("fPromocao").checked,
    nsfw: document.getElementById("fNsfw").checked,
    descricao: document.getElementById("fDescricao").value.trim(),
    cuidados: document.getElementById("fCuidados").value.split("\n").map(s => s.trim()).filter(Boolean),
    informacoes: document.getElementById("fInformacoes").value.split("\n").map(s => s.trim()).filter(Boolean),
    imagens: imagensAtuais.length ? imagensAtuais.map(i => i.nomeSugerido) : (existente ? existente.imagens : ["placeholder-1.jpg"]),
    _previewUrls: imagensAtuais.length ? imagensAtuais.map(i => i.url) : (existente ? existente._previewUrls : [])
  };

  const precoAntigo = document.getElementById("fPrecoAntigo").value;
  if (precoAntigo) novoProduto.precoAntigo = Number(precoAntigo);

  if (editIndex >= 0) {
    produtosState[editIndex] = novoProduto;
  } else {
    produtosState.push(novoProduto);
  }

  renderLista();
  limparForm();
});

// ---------- Exportar data.js ----------
document.getElementById("btnExportar").addEventListener("click", () => {
  const numero = document.getElementById("fWhatsapp").value.trim() || WHATSAPP_NUMERO;

  const produtosLimpos = produtosState.map(p => {
    const { _previewUrls, ...resto } = p;
    return resto;
  });

  const conteudo = `/*
  CATÁLOGO DE PRODUTOS
  =====================
  Gerado pelo painel admin.html — pra editar de novo, abra admin.html
  no navegador (duplo clique no arquivo) e clique em "Editar" no produto
  desejado, ou edite este arquivo direto se preferir.
*/

const PRODUTOS = ${JSON.stringify(produtosLimpos, null, 2)};

// Número de WhatsApp da loja (com código do país + DDD, só números)
const WHATSAPP_NUMERO = "${numero}";

// Mensagem padrão enviada ao clicar em "Encomendar via WhatsApp"
function mensagemWhatsApp(produto) {
  const linkProduto = window.location.origin + window.location.pathname.replace(/[^/]*$/, "") + "product.html?id=" + produto.id;
  return "Olá! Tenho interesse na figure " + produto.nome + " e gostaria de fazer uma encomenda.\\n\\n" +
         "Pode me passar mais informações sobre:\\n" +
         "• valor final com frete\\n" +
         "• prazo de produção\\n" +
         "• opções de escala/tamanho\\n\\n" +
         linkProduto;
}
`;

  const blob = new Blob([conteudo], { type: "text/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.js";
  a.click();

  alert("Baixado! Agora:\n1. Baixe também cada foto nova pelo link 'Baixar renomeada' antes de sair da página.\n2. No GitHub, substitua js/data.js por este arquivo.\n3. Arraste as fotos baixadas pra pasta images/.\n4. Commit — em 1-2 min o site atualiza sozinho.");
});

// ---------- Inicialização ----------
renderLista();

// =====================================================================
// CONFIGURAÇÕES DO SITE (banner principal, textos, logo)
// =====================================================================

document.getElementById("cfgEyebrow").value = SITE_CONFIG.heroEyebrow;
document.getElementById("cfgTitulo").value = SITE_CONFIG.heroTitulo;
document.getElementById("cfgTituloDestaque").value = SITE_CONFIG.heroTituloDestaque;
document.getElementById("cfgSubtitulo").value = SITE_CONFIG.heroSubtitulo;
document.getElementById("cfgBotaoTexto").value = SITE_CONFIG.heroBotaoTexto;

let novaImagemHero = null; // { file, nomeSugerido, url }
let novaImagemLogo = null;

function configurarUploadUnico(dropId, inputId, previewId, nomeFixo, onSalvar) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  drop.addEventListener("click", () => input.click());
  drop.addEventListener("dragover", e => { e.preventDefault(); drop.style.borderColor = "var(--amber)"; });
  drop.addEventListener("dragleave", () => { drop.style.borderColor = "var(--line)"; });
  drop.addEventListener("drop", e => { e.preventDefault(); drop.style.borderColor = "var(--line)"; processar(e.dataTransfer.files[0]); });
  input.addEventListener("change", () => processar(input.files[0]));

  function processar(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const item = { file, nomeSugerido: nomeFixo, url };
    onSalvar(item);
    preview.innerHTML = `
      <div class="image-preview">
        <img src="${url}" alt="">
        <span class="fname">${nomeFixo}</span>
        <a href="${url}" download="${nomeFixo}">Baixar renomeada ↓</a>
      </div>
    `;
  }
}

configurarUploadUnico("heroImageDrop", "heroImageInput", "heroImagePreview", "hero-banner.jpg", (item) => { novaImagemHero = item; });
configurarUploadUnico("logoImageDrop", "logoImageInput", "logoImagePreview", "logo.svg", (item) => { novaImagemLogo = item; });

document.getElementById("btnExportarConfig").addEventListener("click", () => {
  const config = {
    heroEyebrow: document.getElementById("cfgEyebrow").value,
    heroTitulo: document.getElementById("cfgTitulo").value,
    heroTituloDestaque: document.getElementById("cfgTituloDestaque").value,
    heroSubtitulo: document.getElementById("cfgSubtitulo").value,
    heroBotaoTexto: document.getElementById("cfgBotaoTexto").value,
    heroImagem: novaImagemHero ? novaImagemHero.nomeSugerido : SITE_CONFIG.heroImagem,
    logoImagem: novaImagemLogo ? novaImagemLogo.nomeSugerido : SITE_CONFIG.logoImagem
  };

  const conteudo = `/*
  CONFIGURAÇÕES GERAIS DO SITE
  =============================
  Gerado pelo painel admin.html, aba "Configurações do Site".
*/

const SITE_CONFIG = ${JSON.stringify(config, null, 2)};
`;

  const blob = new Blob([conteudo], { type: "text/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site-config.js";
  a.click();

  let aviso = "Baixado! Agora:\n1. No GitHub, substitua js/site-config.js por este arquivo.";
  if (novaImagemHero || novaImagemLogo) {
    aviso += "\n2. Baixe também a(s) imagem(ns) nova(s) pelo link 'Baixar renomeada' e arraste pra pasta images/.";
  }
  alert(aviso);
});

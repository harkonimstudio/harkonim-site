const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const produto = PRODUTOS.find(p => p.id === id) || PRODUTOS[0];

// Harkonim gallery toggle v1 — optional, compatible with existing products.
const galeriaHibrida = produto.galeriaHibrida === true;
let versaoGaleria = 'sfw';
let nsfwGaleriaConfirmado = false;
function abrirConfirmacaoNsfw(aoConfirmar, aoCancelar) {
  const modal=document.getElementById('modalNsfwProduto');
  modal.classList.add('aberto');
  document.getElementById('btnNsfwProdutoConfirmar').onclick=()=>{
    sessionStorage.setItem('nsfwVerificado','1');modal.classList.remove('aberto');aoConfirmar();
  };
  document.getElementById('btnNsfwProdutoCancelar').onclick=()=>{modal.classList.remove('aberto');aoCancelar();};
  document.getElementById('btnNsfwProdutoConfirmar').focus();
}
// Híbridos abrem somente as fotos SFW. O aviso é mostrado ao pedir NSFW.
// Produtos sem galerias separadas mantêm o comportamento anterior.
const jaVerificadoNaSessao=sessionStorage.getItem('nsfwVerificado')==='1';
const precisaConfirmar=!galeriaHibrida && (produto.nsfwAviso || (produto.nsfw && !jaVerificadoNaSessao));
if(precisaConfirmar){
 document.getElementById('productWrap').style.visibility='hidden';
 abrirConfirmacaoNsfw(()=>{document.getElementById('productWrap').style.visibility='visible';},()=>{window.location.href='produtos.html';});
}

document.getElementById("pageTitle").textContent = produto.nome + " — Harkonim Studio";
document.getElementById("crumbCat").textContent = produto.categoria;
document.getElementById("crumbName").textContent = produto.nome;

document.getElementById("prodCat").textContent = produto.categoria;
document.getElementById("prodName").textContent = produto.nome;
document.getElementById("prodPrice").innerHTML = montarPrecoComPromocao(produto.preco, produto.precoAntigo);
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

// Galeria: a lista existente contém só fotos SFW nos produtos híbridos.
const mainImage=document.getElementById('mainImage');
const thumbs=document.getElementById('thumbs');
function mostrarGaleria(versao){
  versaoGaleria=versao;
  const fotos=(galeriaHibrida && versao==='nsfw')?produto.imagensNsfw:produto.imagens;
  const imagens=Array.isArray(fotos)?fotos:[];
  thumbs.replaceChildren();
  if(imagens.length){mainImage.hidden=false;mainImage.src='images/'+imagens[0];}
  else {mainImage.hidden=true;mainImage.removeAttribute('src');}
  mainImage.alt=produto.nome+(galeriaHibrida?' — '+versao.toUpperCase():'');
  imagens.forEach((img,i)=>{
    const thumb=document.createElement('img');thumb.src='images/'+img;thumb.alt=produto.nome+' — foto '+(i+1);thumb.className=i===0?'active':'';
    thumb.tabIndex=0;thumb.setAttribute('role','button');
    const selecionar=()=>{mainImage.src='images/'+img;thumbs.querySelectorAll('img').forEach(t=>t.classList.remove('active'));thumb.classList.add('active');};
    thumb.addEventListener('click',selecionar);thumb.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selecionar();}});thumbs.append(thumb);
  });
  for(const key of ['sfw','nsfw']){
    const button=document.getElementById(key==='sfw'?'btnGaleriaSfw':'btnGaleriaNsfw');
    if(button){const active=key===versao;button.setAttribute('aria-pressed',String(active));button.style.background=active?'var(--amber-bright, #eee)':'transparent';button.style.color=active?'var(--bg, #222)':'var(--text, #eee)';}
  }
}
if(galeriaHibrida){
 const controls=document.createElement('div');controls.id='galeriaVersoes';controls.setAttribute('role','group');controls.setAttribute('aria-label','Versão das fotos');controls.style.cssText='display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap';
 const label=document.createElement('span');label.textContent='Versão das fotos';label.style.cssText='width:100%;font-size:14px';controls.append(label);
 for(const key of ['sfw','nsfw']){
  const button=document.createElement('button');button.type='button';button.id=key==='sfw'?'btnGaleriaSfw':'btnGaleriaNsfw';button.textContent=key==='sfw'?'SFW':'NSFW (+18)';button.style.cssText='flex:1;min-width:100px;padding:12px 18px;border:1px solid var(--line, #666);border-radius:8px;font:600 14px var(--font-body, sans-serif);cursor:pointer';
  button.onclick=()=>{
   if(key==='nsfw'&&!nsfwGaleriaConfirmado){abrirConfirmacaoNsfw(()=>{nsfwGaleriaConfirmado=true;mostrarGaleria('nsfw');button.focus();},()=>button.focus());}
   else mostrarGaleria(key);
  };
  controls.append(button);
 }
 mainImage.parentElement.before(controls);
}
mostrarGaleria('sfw');

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

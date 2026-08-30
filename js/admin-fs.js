/*
  CONEXÃO COM A PASTA DO PROJETO (opcional)
  ===========================================
  Isso usa uma permissão especial do navegador (File System Access API)
  pra deixar o admin escrever os arquivos direto na pasta do site no seu
  computador — sem precisar baixar e arrastar manualmente.

  Só funciona no Chrome e no Edge (é uma limitação do navegador, não
  nossa). Em qualquer outro navegador, o admin continua funcionando
  normalmente do jeito antigo (baixar arquivo).
*/

let fsDirHandle = null;

function fsDisponivel() {
  return "showDirectoryPicker" in window;
}

function fsPastaConectada() {
  return fsDirHandle !== null;
}

function fsNomePasta() {
  return fsDirHandle ? fsDirHandle.name : null;
}

async function fsConectar() {
  fsDirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
  await fsSalvarHandleNoIndexedDB(fsDirHandle);
  return fsDirHandle;
}

function fsDesconectar() {
  fsDirHandle = null;
  fsRemoverHandleDoIndexedDB();
}

// Tenta reconectar automaticamente na pasta usada da última vez,
// pedindo confirmação de permissão (o navegador exige isso a cada sessão
// por segurança — não dá pra pular essa etapa, mas evita ter que escolher
// a pasta nervamente).
async function fsTentarRestaurar() {
  const handle = await fsLerHandleDoIndexedDB();
  if (!handle) return null;

  try {
    let permissao = await handle.queryPermission({ mode: "readwrite" });
    if (permissao !== "granted") {
      permissao = await handle.requestPermission({ mode: "readwrite" });
    }
    if (permissao === "granted") {
      fsDirHandle = handle;
      return handle;
    }
  } catch (e) {
    // handle inválido/pasta movida — ignora e deixa a pessoa reconectar manualmente
  }
  return null;
}

// Escreve texto ou um File/Blob num caminho relativo dentro da pasta
// conectada, tipo "js/data.js" ou "images/asuka-1.jpg". Cria as
// subpastas automaticamente se precisar.
async function fsEscrever(caminhoRelativo, conteudo) {
  if (!fsDirHandle) throw new Error("Nenhuma pasta conectada.");
  const partes = caminhoRelativo.split("/");
  let pastaAtual = fsDirHandle;
  for (let i = 0; i < partes.length - 1; i++) {
    pastaAtual = await pastaAtual.getDirectoryHandle(partes[i], { create: true });
  }
  const nomeArquivo = partes[partes.length - 1];
  const fileHandle = await pastaAtual.getFileHandle(nomeArquivo, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(conteudo);
  await writable.close();
}

// ---------- Guarda o handle da pasta no IndexedDB pra lembrar entre sessões ----------

function fsSalvarHandleNoIndexedDB(handle) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("harkonim-admin-fs", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("handles");
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction("handles", "readwrite");
      tx.objectStore("handles").put(handle, "pastaProjeto");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

function fsLerHandleDoIndexedDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("harkonim-admin-fs", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("handles");
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction("handles", "readonly");
      const getReq = tx.objectStore("handles").get("pastaProjeto");
      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => reject(getReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}

function fsRemoverHandleDoIndexedDB() {
  const req = indexedDB.open("harkonim-admin-fs", 1);
  req.onsuccess = () => {
    const db = req.result;
    const tx = db.transaction("handles", "readwrite");
    tx.objectStore("handles").delete("pastaProjeto");
  };
}

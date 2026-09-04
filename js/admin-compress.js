/*
  COMPRESSÃO DE IMAGENS
  ======================
  Tudo roda no navegador, sem mandar a foto pra nenhum site externo.
  Redimensiona (se for maior que o necessário pra web) e reencoda como
  JPEG numa qualidade que mantém boa nitidez com arquivo bem menor.
*/

const COMPRESSAO_DIMENSAO_MAX = 1600; // px no lado maior
const COMPRESSAO_QUALIDADE = 0.82;    // 0 a 1 — 0.82 é um bom equilíbrio

function comprimirImagem(file, maxDimensao = COMPRESSAO_DIMENSAO_MAX, qualidade = COMPRESSAO_QUALIDADE) {
  return new Promise((resolve, reject) => {
    // SVG não passa por aqui — não é uma imagem "de pixel", comprimir não faz sentido
    if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name || "")) {
      resolve(file);
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxDimensao || height > maxDimensao) {
        if (width > height) {
          height = Math.round(height * (maxDimensao / width));
          width = maxDimensao;
        } else {
          width = Math.round(width * (maxDimensao / height));
          height = maxDimensao;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { reject(new Error("Falha ao comprimir imagem")); return; }
        // Só usa a versão comprimida se ela for realmente menor —
        // senão fica com o arquivo original.
        resolve(blob.size < file.size ? blob : file);
      }, "image/jpeg", qualidade);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não consegui abrir essa imagem pra comprimir"));
    };

    img.src = url;
  });
}

function formatarBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Arquivos que nunca devem ser comprimidos/reencodados como JPEG —
// são identidade visual (logo, favicon), onde perder transparência
// ou nitidez importa mais do que economizar espaço.
const ARQUIVOS_PROTEGIDOS_COMPRESSAO = [
  "logo.svg", "logo-harkonim.png",
  "favicon.ico", "favicon-16.png", "favicon-32.png", "favicon-512.png",
  "apple-touch-icon.png"
];

// Varre a pasta images/ inteira (na pasta do projeto conectada) e
// comprime cada foto de produto/banner in-place, sobrescrevendo o
// arquivo original com a versão menor.
async function comprimirPastaImagensInteira(aoAtualizarStatus) {
  const arquivos = await fsListarPasta("images");
  const candidatos = arquivos.filter(({ nome }) => {
    if (ARQUIVOS_PROTEGIDOS_COMPRESSAO.includes(nome)) return false;
    return /\.(jpe?g|png|webp)$/i.test(nome);
  });

  let totalAntes = 0;
  let totalDepois = 0;
  let processados = 0;
  let pulados = 0;

  for (const { nome, handle } of candidatos) {
    const file = await handle.getFile();

    // Já é pequena (menos de 150KB) — não vale o esforço de reprocessar
    if (file.size < 150 * 1024) {
      pulados++;
      continue;
    }

    aoAtualizarStatus(`Comprimindo ${nome}... (${processados + pulados + 1}/${candidatos.length})`);

    try {
      const comprimido = await comprimirImagem(file);
      totalAntes += file.size;
      totalDepois += comprimido.size;

      if (comprimido !== file) {
        const writable = await handle.createWritable();
        await writable.write(comprimido);
        await writable.close();
      }
      processados++;
    } catch (e) {
      console.error("Erro comprimindo", nome, e);
    }
  }

  return { processados, pulados, totalAntes, totalDepois };
}

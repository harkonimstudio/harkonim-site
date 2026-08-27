/*
  FILA DE PRODUÇÃO
  =================
  Cada item é uma peça em andamento. Pra mover de etapa, é só trocar
  o campo "etapa" (as opções válidas estão listadas abaixo) — o item
  pula sozinho pro bloco certo na página.

  Etapas, na ordem do processo:
  "aguardando"  → Aguardando Impressão
  "impressao"   → Em Impressão
  "acabamento"  → Em Acabamento
  "pintura"     → Pintura
  "embalagem"   → Embalagem
  "enviado"     → Enviado

  Campos:
  - nome: nome da peça/personagem
  - codigo: código do pedido (o padrão que você usar, ex: "HKM-A001")
  - etapa: uma das opções acima
*/

const FILA_PRODUCAO = [
  { nome: "Asuka Langley", codigo: "HKM-A001", etapa: "pintura" },
  { nome: "Marika", codigo: "HKM-A002", etapa: "impressao" },
  { nome: "Vegeta Super Saiyajin", codigo: "HKM-A003", etapa: "aguardando" }
];

const ULTIMA_ATUALIZACAO_FILA = "25/08/2026";

const campos = [
  "curso", "orientador", "emailOrientador",
  "unidade", "cnpj", "enderecoUnidade", "cepUnidade", "bairroUnidade", "cidadeUnidade", "estadoUnidade",
  "representante", "cargoRepresentante", "telefoneUnidade", "emailUnidade",
  "supervisor", "funcaoSupervisor", "telefoneSupervisor", "emailSupervisor",
  "nomeEstudante", "periodoCurso", "prontuario", "rg", "cpf", "dataNascimento",
  "enderecoEstudante", "cepEstudante", "bairroEstudante", "cidadeEstudante", "estadoEstudante",
  "celularEstudante", "emailEstudante",
  "tipoEstagio", "pcd", "pcdEspecificar",
  "dataInicio", "dataFim", "diasSemana", "periodoEstagio", "horaInicio", "horaFim",
  "estagioEm", "estagioEmOutro", "periodoCursoPlano", "cargaHoraria", "sinteseAtividades", "totalCargaHoraria",
  "diaDocumento", "mesDocumento", "anoDocumento",
  "coordenadorCurso", "responsavelEstagios", "coordenadorInstitucional"
];

const obrigatorios = campos.filter(c => c !== "pcdEspecificar" && c !== "estagioEmOutro");

function valor(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function preencherSaida(id, texto = null) {
  document.querySelectorAll(`[data-out="${id}"]`).forEach(el => {
    el.textContent = texto === null ? (valor(id) || "[preencher]") : texto;
  });
}

function validar() {
  const erros = [];
  document.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("erro"));

  obrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (el && !valor(id)) {
      erros.push(`Preencha o campo obrigatório: ${id}.`);
      el.classList.add("erro");
    }
  });

  if (valor("estagioEm") === "Outros" && !valor("estagioEmOutro")) {
    erros.push("Informe o campo de estágio em Outros.");
    document.getElementById("estagioEmOutro").classList.add("erro");
  }

  return erros;
}

function setMensagem(texto, tipo) {
  const box = document.getElementById("mensagens");
  if (!box) return;
  box.className = `mensagens ${tipo || ""}`;
  box.innerHTML = texto;
}

function gerarDocumento() {
  const erros = validar();

  if (erros.length) {
    setMensagem("<strong>Revise antes de gerar:</strong><br>" + erros.join("<br>"), "erro");
    return false;
  }

  campos.forEach(id => preencherSaida(id));

  const tipo = valor("tipoEstagio");
  preencherSaida(
    "tipoEstagioMarcado",
    tipo === "Obrigatório"
      ? "[X] Obrigatório [ ] Não Obrigatório"
      : "[ ] Obrigatório [X] Não Obrigatório"
  );

  const pcd = valor("pcd");
  preencherSaida("pcdMarcado", pcd === "Sim" ? "[X] Sim [ ] Não" : "[ ] Sim [X] Não");
  preencherSaida("pcdEspecificar", pcd === "Sim" ? ` — ${valor("pcdEspecificar")}` : "");

  const periodo = valor("periodoEstagio");
  const periodoMarcado = ["matutino", "vespertino", "noturno"]
    .map(p => p === periodo ? `[X] ${p}` : `[ ] ${p}`)
    .join(" ");

  preencherSaida("periodoEstagio", periodoMarcado);

  const estagioFinal =
    valor("estagioEm") === "Outros" ? valor("estagioEmOutro") : valor("estagioEm");

  preencherSaida("estagioEmFinal", estagioFinal || "[preencher]");

  setMensagem("Documento gerado com sucesso. Agora você pode imprimir ou salvar em PDF.", "ok");
  return true;
}

function imprimirDocumento() {
  if (gerarDocumento()) {
    window.print();
  }
}

function limparFormulario() {
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.id === "estadoUnidade" || el.id === "estadoEstudante") {
      el.value = "SP";
    } else {
      el.value = "";
    }
    el.classList.remove("erro");
  });

  setMensagem("", "");
}

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
  "diaDocumento", "mesDocumento", "anoDocumento",
  "coordenadorCurso", "responsavelEstagios", "coordenadorInstitucional"
];

const obrigatorios = campos.filter(c => c !== "pcdEspecificar");

const regex = {
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  rg: /^\d{2}\.\d{3}\.\d{3}-[\dXx]$/,
  data: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  cep: /^\d{5}-\d{3}$/,
  hora: /^([01]\d|2[0-3]):[0-5]\d$/,
  ano: /^\d{4}$/,
  dia: /^([1-9]|[12]\d|3[01])$/
};

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function maskCpf(value) {
  value = onlyDigits(value).slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
}

function maskCnpj(value) {
  value = onlyDigits(value).slice(0, 14);
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  return value;
}

function maskRg(value) {
  value = value.replace(/[^\dXx]/g, "").slice(0, 9);
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})([\dXx])$/, "$1.$2.$3-$4");
  return value.toUpperCase();
}

function maskCep(value) {
  value = onlyDigits(value).slice(0, 8);
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  return value;
}

function maskData(value) {
  value = onlyDigits(value).slice(0, 8);
  value = value.replace(/^(\d{2})(\d)/, "$1/$2");
  value = value.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  return value;
}

function maskHora(value) {
  value = onlyDigits(value).slice(0, 4);
  value = value.replace(/^(\d{2})(\d)/, "$1:$2");
  return value;
}

function maskTelefone(value) {
  value = onlyDigits(value).slice(0, 11);
  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }
  return value;
}

document.querySelectorAll("[data-mask]").forEach(input => {
  input.addEventListener("input", () => {
    const mask = input.dataset.mask;
    if (mask === "cpf") input.value = maskCpf(input.value);
    if (mask === "cnpj") input.value = maskCnpj(input.value);
    if (mask === "rg") input.value = maskRg(input.value);
    if (mask === "cep") input.value = maskCep(input.value);
    if (mask === "data") input.value = maskData(input.value);
    if (mask === "hora") input.value = maskHora(input.value);
    if (mask === "telefone") input.value = maskTelefone(input.value);
  });
});

function valor(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function validarDatasReais(data) {
  if (!regex.data.test(data)) return false;
  const [dia, mes, ano] = data.split("/").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

function validarEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validar() {
  const erros = [];
  document.querySelectorAll("input, select").forEach(el => el.classList.remove("erro"));

  obrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (!valor(id)) {
      erros.push(`Preencha o campo obrigatório: ${campoNome(id)}.`);
      el.classList.add("erro");
    }
  });

  const validacoes = [
    ["cpf", regex.cpf, "CPF deve estar no formato 000.000.000-00."],
    ["cnpj", regex.cnpj, "CNPJ deve estar no formato 00.000.000/0000-00."],
    ["rg", regex.rg, "RG deve estar no formato 00.000.000-0."],
    ["cepUnidade", regex.cep, "CEP da unidade deve estar no formato 00000-000."],
    ["cepEstudante", regex.cep, "CEP do estudante deve estar no formato 00000-000."],
    ["horaInicio", regex.hora, "Horário de início deve estar no formato 00:00."],
    ["horaFim", regex.hora, "Horário de término deve estar no formato 00:00."],
    ["anoDocumento", regex.ano, "Ano do documento deve ter 4 dígitos."],
    ["diaDocumento", regex.dia, "Dia do documento deve estar entre 1 e 31."]
  ];

  validacoes.forEach(([id, regra, msg]) => {
    const el = document.getElementById(id);
    if (valor(id) && !regra.test(valor(id))) {
      erros.push(msg);
      el.classList.add("erro");
    }
  });

  ["dataNascimento", "dataInicio", "dataFim"].forEach(id => {
    const el = document.getElementById(id);
    if (valor(id) && !validarDatasReais(valor(id))) {
      erros.push(`${campoNome(id)} deve estar no formato dd/mm/aaaa e ser uma data válida.`);
      el.classList.add("erro");
    }
  });

  ["emailOrientador", "emailUnidade", "emailSupervisor", "emailEstudante"].forEach(id => {
    const el = document.getElementById(id);
    if (valor(id) && !validarEmail(valor(id))) {
      erros.push(`${campoNome(id)} deve conter um e-mail válido.`);
      el.classList.add("erro");
    }
  });

  if (valor("dataInicio") && valor("dataFim") && validarDatasReais(valor("dataInicio")) && validarDatasReais(valor("dataFim"))) {
    const [di, mi, ai] = valor("dataInicio").split("/").map(Number);
    const [df, mf, af] = valor("dataFim").split("/").map(Number);
    const inicio = new Date(ai, mi - 1, di);
    const fim = new Date(af, mf - 1, df);
    if (fim < inicio) {
      erros.push("A data final do estágio não pode ser anterior à data inicial.");
      document.getElementById("dataFim").classList.add("erro");
    }
  }

  if (valor("pcd") === "Sim" && !valor("pcdEspecificar")) {
    erros.push("Informe a especificação da deficiência.");
    document.getElementById("pcdEspecificar").classList.add("erro");
  }

  return erros;
}

function campoNome(id) {
  const el = document.getElementById(id);
  const label = el ? el.previousElementSibling : null;
  return label && label.tagName === "LABEL" ? label.textContent.replace("*", "").trim() : id;
}

function setMensagem(texto, tipo) {
  const box = document.getElementById("mensagens");
  box.className = `mensagens ${tipo || ""}`;
  box.innerHTML = texto;
}

function preencherSaida(id, texto = null) {
  document.querySelectorAll(`[data-out="${id}"]`).forEach(el => {
    el.textContent = texto === null ? (valor(id) || "[preencher]") : texto;
  });
}

function gerarDocumento() {
  const erros = validar();

  if (erros.length) {
    setMensagem("<strong>Revise antes de gerar:</strong><br>" + erros.slice(0, 12).join("<br>"), "erro");
    return false;
  }

  campos.forEach(id => preencherSaida(id));

  const tipo = valor("tipoEstagio");
  preencherSaida("tipoEstagioMarcado",
    tipo === "Obrigatório" ? "[X] Obrigatório [ ] Não Obrigatório" : "[ ] Obrigatório [X] Não Obrigatório"
  );

  const pcd = valor("pcd");
  preencherSaida("pcdMarcado", pcd === "Sim" ? "[X] Sim [ ] Não" : "[ ] Sim [X] Não");
  preencherSaida("pcdEspecificar", pcd === "Sim" ? ` — ${valor("pcdEspecificar")}` : "");

  const periodo = valor("periodoEstagio");
  const marcado = ["matutino", "vespertino", "noturno"]
    .map(p => p === periodo ? `[${p}]` : `[ ] ${p}`)
    .join(" ");
  preencherSaida("periodoEstagio", marcado);

  setMensagem("Documento gerado com sucesso. Agora você pode imprimir ou salvar em PDF.", "ok");
  return true;
}

function imprimirDocumento() {
  if (gerarDocumento()) {
    window.print();
  }
}

function limparFormulario() {
  document.querySelectorAll("input, select").forEach(el => {
    if (el.id === "estadoUnidade" || el.id === "estadoEstudante") {
      el.value = "SP";
    } else {
      el.value = "";
    }
    el.classList.remove("erro");
  });
  setMensagem("", "");
}

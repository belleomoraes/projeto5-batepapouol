//entrando no site
let nomeInserido;
let usuario;

function entrarChat() {
  const nomeInserido = document.querySelector("input").value;

  let usuario = {
    name: nomeInserido,
  };

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
  promise.then(manterConexao);
  promise.catch(retornaErro);
}

//para avaliar possiveis erros do nome do usuario
function retornaErro(error) {
  console.log(error.response.status);
  if (error.response.status === 400) {
    alert("Já existe um usuário online com esse nome. Insira um novo nome!");
    document.querySelector("input").value = "";
  }
}

//para ver se o usuario esta online e pegar as mensagens
function manterConexao() {
  const nomeInserido = document.querySelector("input").value;
  let usuario = {
    name: nomeInserido,
  };
  document.querySelector(".telaEntrada").classList.add("escondido");
  document.querySelector(".batePapo").classList.remove("escondido");
  setInterval(avaliarConexao, 5000);
  let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
  setInterval(buscarMensagens, 3000);
}

//para ver se o usuario está online
function avaliarConexao() {
  const nomeInserido = document.querySelector("input").value;
  let usuario = {
    name: nomeInserido,
  };
  let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
  console.log("usuário conectado")
}

//para pegar as mensagens do servidor
function buscarMensagens() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(popularMensagens);
}

let mensagens;
function popularMensagens(resposta) {
  if (resposta.status === 200) {
  }
  mensagens = resposta.data;
  renderizarMensagens();
}


//para colocar as mensagens do servidos no DOM

function renderizarMensagens() {
  
  const divMensagens = document.querySelector(".mensagensRenderizadas");
  divMensagens.innerHTML = "";
  
  for (const item of mensagens) {
    if (item.type === "status") {
      let msgStatus = `<div class="msg-status">(${item.time}) <strong>${item.from}</strong> entra na sala</div>`;
      divMensagens.innerHTML += msgStatus;}
    
    if (item.type === "message") {
      let msgNormal = `<div class="msg-normal">(${item.time}) <strong>${item.from}</strong> para <strong>${item.to}</strong>: ${item.text}</div>`;
      divMensagens.innerHTML += msgNormal;
    }

    if (item.type === "private_message"  && item.from === nomeInserido) {
      let msgReservada = `<div class="msg-reservada">(${item.time}) <strong>${item.from}</strong> reservadamente para <strong>${item.to}</strong>: ${item.text}</div>`;
      divMensagens.innerHTML += msgReservada;
    }
  }
  document.querySelector(".mensagensRenderizadas").lastChild.scrollIntoView();
}

//para ver se outros participantes do chat estao online
function conexaoParticipantes() {
  const participante = mensagens.from;
  let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", participante);
  for (const item of mensagens) {
    if (!promise) {
      let msgSaiu = `<div class="msg-status">(${item.time}) <strong>${item.from}</strong> saiu da sala</div>`;
      divMensagens.innerHTML += msgSaiu;
    }
    return
}
}

function enviarMsg(elemento) {
  const nomeInserido = document.querySelector("input").value;
  const textoEnviado = document.querySelector(".digitar-msg input").value;

  let msgEnviada = {
    from: nomeInserido,
    to: "Todos",
    text: textoEnviado,
    type: "message",
  };

  console.log(msgEnviada);
  let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msgEnviada);
  promise.then(postarMsg);
  promise.catch(atualizarPagina);
}

function atualizarPagina () {
  window.location.reload()
}
function postarMsg() {
  const nomeInserido = document.querySelector("input").value;
  let textoEnviado = document.querySelector(".digitar-msg input").value;

  let msgEnviada = {
    from: nomeInserido,
    to: "Todos",
    text: textoEnviado,
    type: "message",
  };

  let mensagemUsuario = `<div class="msg-normal"><strong>${msgEnviada.from}</strong> para <strong>${msgEnviada.to}</strong>: ${msgEnviada.text}</div>`;

  document.querySelector(".mensagensRenderizadas").innerHTML += mensagemUsuario;
  document.querySelector(".digitar-msg input").value = "";
}

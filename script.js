//entrando no site
let nomeInserido;
let usuario;
let mensagens;
let nomeMaiusculo;

function entrarChat() {
  const nomeInserido = document.querySelector("input").value;

  let usuario = {
    name: nomeInserido
  };

  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    usuario
  );
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
  document.querySelector(".telaEntrada").classList.add("escondido");
  document.querySelector(".batePapo").classList.remove("escondido");
  setInterval(avaliarConexao, 5000);
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    usuario
  );
  buscarMensagens();
}

//para ver se o usuario está online
function avaliarConexao() {
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    usuario
  );
}

//para pegar as mensagens do servidor
function buscarMensagens(resposta) {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(popularMensagens);
  if (resposta.status === 200) {
    mensagens = resposta.data;
  }
  renderizarMensagens();
}

//para colocar as mensagens do servidos no DOM
function renderizarMensagens() {
  const divMensagens = document.querySelector(".mensagens");
  divMensagens.innerHTML = "";

  if (mensagens.type === status) {
    divMensagens.querySelector(".msg-status");
    let msgStatus = `(${mensagem.time}) <strong>${mensagem.name}<strong> entra na sala`;
  }
  if (mensagens.type === message) {
    divMensagens.querySelector(".msg-normal");
    let msgNormal = `(${mensagem.time}) <strong>${mensagem.name}<strong> para <strong>${mensagem.to}<strong>: ${mensagem.text}`;
  }
  if (mensagens.type === private_message) {
    divMensagens.querySelector(".msg-reservada");
    let msgReservada = `(${mensagem.time}) <strong>${mensagem.name}<strong> para <strong>${mensagem.to}<strong>: ${mensagem.text}`;
  }
}

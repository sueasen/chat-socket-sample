const socket = io();
let socketId;
const chatDiv = document.querySelector('#chat');

// socket.io 接続時イベント connectid
socket.on('connectid', function (id) {
  console.log(socketId + ':' + id);
  socketId = id;
});

// message送信処理
function sendMessage() {
  const now = new Date();
  const json = {
    name: document.querySelector('#nameInput').value,
    message: document.querySelector('#msgInput').value,
    time: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
    socketId: socketId,
  };
  // socket に message イベントで送信
  socket.emit('message', JSON.stringify(json));
  document.getElementById('msgInput').value = '';
}

// socket から message イベント受信時の処理
socket.on('message', function (data) {
  const json = JSON.parse(data);
  if (!json.message) return;
  chatDiv.appendChild(createMessage(json));
  chatDiv.scrollTo(0, chatDiv.scrollHeight);
});

// ここから下は DOM の操作
function createMessage(json) {
  const side = json.socketId === socketId ? 'mine' : 'other';
  const sideElement = createDiv(side);
  const sideTextElement = createDiv(`${side}-text`);
  const timeElement = createDiv('time');
  const nameElement = createDiv('name');
  const textElement = createDiv('text');
  timeElement.textContent = json.time;
  nameElement.textContent = json.name;
  textElement.textContent = json.message;
  sideElement.appendChild(sideTextElement);
  sideTextElement.appendChild(timeElement);
  sideTextElement.appendChild(nameElement);
  sideTextElement.appendChild(textElement);
  return sideElement;
}

function createDiv(className) {
  const element = document.createElement('div');
  element.classList.add(className);
  return element;
}

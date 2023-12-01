const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

// ポート番号
const port = '3000';

// express, socket.io 生成
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// サーバで公開するディレクトリ設定（htmlとか置く場所）
app.use(express.static(path.join(__dirname, 'public')));

// 接続時の処理、socket が接続情報
io.on('connection', (socket) => {
  // socket.id のクライアントのみに socket.id を送信（connectidイベント）
  io.to(socket.id).emit('connectid', socket.id);

  // messageイベント受信
  socket.on('message', (data) => {
    // 接続中のクライアント全員に data を送信（messageイベント）
    io.emit('message', data);
  });

  // 切断時処理
  socket.on('disconnect', () => {});
});

// ポート3000番でサーバを起動します。
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

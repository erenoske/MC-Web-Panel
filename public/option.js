const socket = io();

socket.on('games', function(htmlContent) {
  // Veri geldiğinde yapılacak işlemleri burada gerçekleştirin
  // Örneğin, veriyi bir div'e ekleyebilirsiniz:
  const gameDiv = document.getElementById('gameDiv');
  gameDiv.innerHTML = htmlContent;
});


const socket = io();

// Sunucu durumunu güncelleme
socket.on('serverStatus', function(status) {
  const statusElement = document.getElementById('status');
  const backgroundElement = document.getElementById('background');
  const buttonElement = document.getElementById('button');
  if (status === 'Sunucu kapalı') {
    statusElement.textContent = status;
    buttonElement.textContent = 'Başlat';
    buttonElement.onclick = startServer;
    backgroundElement.className = 'server-offline';
  } else if (status === 'Sunucu açık') {
    statusElement.textContent = status;
    buttonElement.onclick = stopServer;
    buttonElement.textContent = 'Durdur';
    backgroundElement.className = 'server-online';
  }
});
const button = document.getElementById('button');
const loadingElement = document.getElementById('loading');

button.addEventListener('click', function() {
  loadingElement.classList.add('visible'); // "visible" sınıfını ekle
  button.disabled = true; // Butonu devre dışı bırak
  socket.on('serverStatus', function(status) {
  // Simüle edilen sunucu durumu
  const statusElement = document.getElementById('status'); // Sunucu durumu kontrolü burada gerçekleştirilebilir;
  // Sunucu durumu kontrolü için beklemek için setTimeout kullanıyoruz
  setTimeout(function() {
    if(button.textContent == "Durdur") {
      if (status === 'Sunucu açık') {
        loadingElement.classList.remove('visible'); // "visible" sınıfını kaldır
        button.disabled = false; // Butonu etkinleştir
      }
    }
    if(button.textContent == "Başlat") {
      if (status === 'Sunucu kapalı') {
        loadingElement.classList.remove('visible'); // "visible" sınıfını kaldır
        button.disabled = false; // Butonu etkinleştir
      }
    }
  }, 5000); // 1 saniye sonra işlemi gerçekleştir
}); });

// Sunucu durumu bilgisini textarea içine yerleştirme
socket.on('content', function(data) {
  const textarea = document.getElementById("content");
  textarea.value = data;
});


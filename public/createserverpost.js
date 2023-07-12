document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

    const serverName = document.querySelector('input[name="server"]').value; // Formdan komutu al
    const selectedGame = document.getElementById('game').value; // Formdan komutu al

    fetch('/komut', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ serverName , selectedGame}) // Komutu JSON formatında gönder
    })
    .then(response => response.json())
    .then(data => {
      console.log('Sunucudan gelen yanıt:', data);
    })
    .catch(error => {
      console.error('Komut gönderme hatası:', error);
    });
  });


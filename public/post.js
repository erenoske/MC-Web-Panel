document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

    const username = document.querySelector('input[name="username"]').value; // Formdan komutu al
    const password = document.querySelector('input[name="password"]').value; // Formdan komutu al

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username , password }) // Komutu JSON formatında gönder
    })
    .then(response => response.json())
    .then(data => {
      console.log('Sunucudan gelen yanıt:', data);
      location.reload();
    })
    .catch(error => {
      console.error('Komut gönderme hatası:', error);
    });
  });

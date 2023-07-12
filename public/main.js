document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

    const komut = document.querySelector('input[name="komut"]').value; // Formdan komutu al

    fetch('/komut', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ komut }) // Komutu JSON formatında gönder
    })
    .then(response => response.json())
    .then(data => {
      console.log('Sunucudan gelen yanıt:', data);
    })
    .catch(error => {
      console.error('Komut gönderme hatası:', error);
    });
  });

  //log
  function fetchLatestLog() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
  
    fetch(`/logs/latest.log?id=${id}`) // GET isteğini yaparken id'yi query parametresi olarak ekleyin
      .then(response => response.text())
      .then(data => {
        const logContent = document.getElementById('log-content');
        logContent.innerText = data;
      })
      .catch(error => {
        console.error(error);
        const logContent = document.getElementById('log-content');
        logContent.innerText = 'Error occurred while fetching the latest log.';
      });
  }

    setInterval(fetchLatestLog, 1000);
    
    //Server başlatma , kapama

    const controlForm = document.getElementById('controlForm');

    function startServer() {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      fetch(`/server`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'start', id })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error(error);
      });
    }
    
    function stopServer() {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      fetch('/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'stop', id })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error(error);
      });
    }

    document.getElementById('uploadForm').addEventListener('submit', (e) => {
      e.preventDefault(); // Formun otomatik olarak gönderilmesini engelle
    
      const id = document.getElementById('url-id').value; // ID değerini al
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0]; // Seçilen dosyayı al
    
      const formData = new FormData(); // FormData oluştur
      formData.append('id', id); // ID değerini ekle
      formData.append('file', file); // Dosyayı ekle
    
      fetch('/upload', {
        method: 'POST',
        body: formData // FormData'yı gönder
      })
        .then(response => response.json())
        .then(data => {
          console.log('Sunucudan gelen yanıt:', data);
          location.reload();
        })
        .catch(error => {
          console.error('Dosya yükleme hatası:', error);
        });
    });

    function saveContent() {
      const textarea = document.getElementById("content");
      const newData = textarea.value;
    
      fetch('/saveContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newData, id })
      })
      .then(response => response.json())
      .then(data => {
        // Kaydetme işlemi tamamlandıktan sonra yapılacak işlemler
        console.log('Veri kaydedildi.');
        // Örnek: Kullanıcıya bildirim gösterme
        alert('Veri başarıyla kaydedildi.');
        // Başka işlemler ekleme
        // ...
      })
      .catch(error => {
        console.error(error);
      });
    }
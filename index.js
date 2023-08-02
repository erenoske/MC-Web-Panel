const express = require('express');
const app = express();
const Rcon = require('rcon');
const { exec } = require('child_process');
const mysql = require('mysql');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session');
const mcPing = require('mc-ping-updated');
const ejs = require('ejs');
const multer = require('multer');
const AdmZip = require('adm-zip');


app.use(session({
  secret: 'cfhS9YMzKUAqon6o0n2Nsp6F1ypGhxUM', // Oturum verilerinin şifrelenmesi için kullanılan gizli anahtar
  resave: false, // Oturum verilerinin her istekte yeniden kaydedilmemesi
  saveUninitialized: true, // İstekte oturum verisi olmadığında yeni bir oturum oluşturulması
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Oturumun süresi (1 gün)
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Oturumun son kullanma tarihi (1 gün)
    secure: false, // Sadece HTTPS üzerinde çalışacaksa true olarak ayarlanabilir
    httpOnly: true // Tarayıcı tarafından sadece HTTP protokolüyle erişilebilir
  }
}));

app.get('/logout', (req, res) => {
  // Oturum verilerini silme
  req.session.destroy();
  res.send('Çıkış yapıldı');
});

// İstek sınırlaması ayarları
const limiter = rateLimit({
  windowMs: 2 * 1000, // 2 saniye
  max: 1, 
  message: 'Fazla istek.',
});

const Powerlimiter = rateLimit({
  windowMs: 10 * 1000, // 10 saniye
  max: 1, 
  message: 'Fazla istek.',
});


// RCON bağlantısı için gerekli bilgiler
const Rconhost = '127.0.0.1'; //Sunucu İP Adresi
const Rconport = 25575; //RCON port
const Rconpassword = ''; //RCON şifre

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON verilerini işlemek için gerekli

const publicDirectory = path.join(__dirname, './public');
console.log(__dirname);
app.use(express.static(publicDirectory));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
  if (req.session.username) {
    const query = 'SELECT * FROM servers';
    connection.query(query, (err, datax) => {
      if (err) {
        console.error('Verileri alırken hata oluştu', err);
        res.status(500).send('Sunucu hatası');
        return;
      }
    
      // Veritabanı işlemi tamamlandıktan sonra yönlendirme yapma
      const currentPage = 'sunucu'; // Aktif sayfanın adını belirleyin
      res.render('login', { title: 'Sunucular', action: 'list', login: datax, currentPage , username: req.session.username});
    }); 
  } else {
    // Oturum yoksa, giriş sayfasını göster
    res.render('index');
  }
});


app.get("/createserver", (req, res) => {
  // Oturum açık mı kontrolü
  if (req.session.username) {
    // Veritabanından verileri alın
    const query = 'SELECT * FROM games';
    connection.query(query, (err, data) => {
      if (err) {
        console.error('Verileri alırken hata oluştu', err);
        res.status(500).send('Sunucu hatası');
        return;
      }

      // Veritabanı işlemi tamamlandıktan sonra yönlendirme yapma
      const currentPage = 'createserver'; // Aktif sayfanın adını belirleyin
      res.render('createserver', { title: 'Oyun', action: 'list', createserver: data, currentPage, username: req.session.username});
    });
  } else {
    res.render('index');
  }
});

app.get('/modlar', (req, res) => {
   if (req.session.username) {
     const currentPage = 'modlar';
     res.render('modupload', {currentPage, username: req.session.username});
   } else {
    res.render('index');
   }
});

app.get("/sunucu", (req, res) => {
  if (req.session.username) {
    const id = req.query.id;

    if(!id) {
      res.render('index');
    } else {
      const query = 'SELECT * FROM servers WHERE id = ?';
      connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Veri sorgularken hata oluştu:', err);
        return;
      }
      if (results.length === 0) {
        res.render('error', { message: 'ID değeri bulunamadı' });
        return;
      }
      // Alınan verileri kullanma
      if(results[0].durum == 0) {
        const query ="UPDATE servers SET durum = 1 WHERE id = ?";
        connection.query(query, [id], (err, results) => {
         if (err) {
          console.error('Veri sorgularken hata oluştu:', err);
          return;
         }
         if (results.length === 0) {
          res.render('error', { message: 'ID değeri bulunamadı' });
          return;
        }
        });  

        const Directory = path.join(__dirname, 'mc-server', id);
        const Directory2 = path.join(__dirname, 'files', results[0].oyun);

        exec(`mkdir "${Directory}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Klasör oluşturma hatası: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Hata çıktısı: ${stderr}`);
            return;
          }
          console.log(`Klasör başarıyla oluşturuldu: ${stdout}`);
        });
        
        // Dosya kopyalama komutunu çalıştırma
        exec(`xcopy "${Directory2}" "${Directory}" /E`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Dosya kopyalama hatası: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Hata çıktısı: ${stderr}`);
            return;
          }
          console.log(`Dosya başarıyla kopyalandı: ${stdout}`);
        });
        
      } else {
        
      }
      const Directory3 = path.join(__dirname, 'mc-server', id, 'server.properties');

      fs.readFile(Directory3, 'utf8', (err, data) => {
        if (err) {
          console.error('Dosya okuma hatası:', err);
          return;
        }
      
        // HTML sayfasına sunucu durumunu gönder
        io.emit('content', data);
      
        // Socket.IO bağlantısı
        io.on('connection', socket => {
          // HTML sayfasına sunucu durumunu gönderme
          socket.emit('content', data);
          console.log('Socket bağlantısı başarılı.', data);
        });
      
      });

      const currentPage = 'sunucu'; // Aktif sayfanın adını belirleyin
      res.render('sunucu', { title: results[0].kisim, currentPage, username: req.session.username});
});
    }
    // Oturum varsa, başka bir sayfaya yönlendir
  } else {
    // Oturum yoksa, giriş sayfasını göster
    res.render('index');
  }
});

// Kullanıcı girişini doğrula
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Veritabanında kullanıcıyı ara
  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Veritabanında sorgu hatası:', error);
      res.status(500).json({ error: 'Bir hata oluştu' });
      return;
    }

    if (results.length > 0) {
      // Giriş başarılı
      console.log('Giriş Yapıldı. ', username);
      req.session.username = username;
      res.json({ message: 'Giriş başarılı' });
    } else {
      // Kullanıcı adı veya şifre yanlış
      res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış' });
    }
  });
});


app.get("/login", (req, res) => {
  res.render("login");
});


 // POST isteği için özel bir yol oluşturun
app.post('/komut', limiter, (req, res) => {
  const {serverName, selectedGame} = req.body;
  const username = req.session.username;
  if(serverName == null) {
   // RCON bağlantısını oluşturma
   const rcon = new Rcon(Rconhost, Rconport, Rconpassword);
   const command = req.body.komut;
   // Stop komutunu engelle
   if (command.toLowerCase() === 'stop') {
    res.status(403).json({ error: 'Stop komutu yasaklandı' });
    return;
   }
   
   // RCON bağlantısını açma ve komut gönderme
   rcon.on('auth', () => {
     console.log('RCON bağlantısı başarılı.');
   
     rcon.send(command);
       console.log('Komut gönderildi: ' + command);
   });
   
   rcon.on('error', error => {
     console.error('RCON bağlantı hatası:', error);
   });
   rcon.connect();
  } else {
    const insertQuery = 'INSERT INTO servers (isim, kisim, oyun) VALUES (?, ?, ?)';
    const values = [username, serverName, selectedGame];
    
    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Veri ekleme hatası:', err);
        res.json({ message: 'Veri ekleme hatası:',  err});
        return;
      }
      console.log('Veri başarıyla eklendi');
      res.json({ message: 'Veri başarıyla eklendi:'});
    });
  }
});


//log

app.use(express.static('public'));

app.get('/logs/latest.log', (req, res) => {
  const id = req.query.id; // GET isteğinden id'yi almak için req.query kullanın

  if(!id) {
    res.render('index');
  } else {
    const logFilePath = path.join(__dirname, 'mc-server', id, 'logs', 'latest.log');
  
    const readStream = fs.createReadStream(logFilePath, 'utf8');
    readStream.on('open', () => {
      res.set('Content-Type', 'text/plain');
      readStream.pipe(res);
    });
    readStream.on('error', (err) => {
      res.status(500).send('Sunucu Daha Kurulmadı');
    });
  }
});

// Minecraft sunucusunu başlatma fonksiyonu
const startServer = (id) => {
  if (!id) {
    console.log('id bulunamadı.');
  } else {
    const query = 'SELECT * FROM servers WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Veri sorgularken hata oluştu:', err);
        return;
      }
      if (results.length === 0) {
        res.render('error', { message: 'ID değeri bulunamadı' });
        return;
      }
      const drive = path.parse(__dirname).root.replace('\\', '');
      const Directory = path.join(__dirname, 'mc-server', id);

      // X sürücüsüne geçiş yapma
      exec(`cd ${drive} && cd /d ${Directory} && java -Xmx4G -Xms4G -jar server.jar nogui`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Hata oluştu: ${error.message}`);
          return;
        }
        console.log(stdout);
      });
    });
  }
};

const stopServer = () => {

  const command = 'stop';

  const rcon = new Rcon(Rconhost, Rconport, Rconpassword);

  rcon.on('auth', () => {
    console.log('RCON bağlantısı başarılı.');

    rcon.send(command);
    console.log('Komut gönderildi: ' + command);
  });

  rcon.on('error', error => {
    console.error('RCON bağlantı hatası:', error);
  });

  rcon.connect();
};


// HTTP POST isteği için özel bir yol oluşturun
app.post('/server', Powerlimiter, (req, res) => {
  const { action} = req.body;

  if (action === 'start') {
      const rcon = new Rcon(Rconhost, Rconport, Rconpassword);

      rcon.on('auth', () => {
        res.json({ message: 'Sunucu zaten açık' });
      });

      rcon.on('error', (error) => {
      const {id} = req.body;
      startServer(id);
      res.json({ message: 'Sunucu başlatıldı' });
    });

    rcon.connect();
  } else if (action === 'stop') {
    stopServer();
    res.json({ message: 'Sunucu durduruldu' });
  } else {
    res.status(400).json({ error: 'Geçersiz eylem' });
  }
});


// HTTP sunucusunu dinleme
http.listen(80, () => {
  console.log('Sunucu dinleniyor: http://localhost');
});


dotenv.config({ path: './.env'});

// Bağlantı yapılandırması
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST, // MySQL sunucusunun adresi
  user: process.env.DATABASE_USER, // MySQL kullanıcı adı
  password: process.env.DATABASE_PASSWORD, // MySQL kullanıcı parolası
  database: process.env.DATABASE // Kullanılacak veritabanının adı
});

// MySQL sunucusuna bağlanma
connection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantısı başarısız: ' + err.stack);
    return;
  }

  console.log('MySQL bağlantısı başarıyla sağlandı. Bağlantı ID: ' + connection.threadId);

  // Bağlantı başarılı olduğunda burada yapmak istediğiniz işlemleri gerçekleştirebilirsiniz.
});

function checkServerStatus() {
  const serverIP = '127.0.0.1';
  const serverPort = 25565; // Minecraft sunucusunun bağlantı noktası
  let serverStatus = '';

  mcPing(serverIP, serverPort, function(err, res) {
    if (err) {
      serverStatus = 'Sunucu kapalı'; // Hata durumunda sunucunun kapalı olduğunu varsayalım
    } else {
      serverStatus = 'Sunucu açık'; // Varsayılan olarak sunucunun açık olduğunu varsayalım
    }

    // Sunucu durumunu HTML sayfasına gönder
    io.emit('serverStatus', serverStatus);
  });

  // Socket.IO bağlantısı
  io.on('connection', socket => {
    // Sunucu durumu bilgisini gönderme
    socket.emit('serverStatus', serverStatus);
  });
}

// Belirli aralıklarla sunucu durumunu kontrol et
setInterval(checkServerStatus, 5000);

// HTML tarafından gelen içeriği kaydetme



app.post('/saveContent', (req, res) => {
  const id = req.body.id;
  const Directory = path.join(__dirname, 'mc-server', id, 'server.properties');
  const newData = req.body.newData

  fs.writeFile(Directory, newData, 'utf8', (err) => {
    if (err) {
      console.error('Dosya kaydetme hatası:', err);
      return;
    }
    console.log('Dosya başarıyla kaydedildi.');
  });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = req.body.id; // ID değerini al
    const directory = path.join(__dirname, 'mc-server', id, 'mods'); // Klasör yolunu oluştur
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname; // Dosya adını belirle
    cb(null, uniqueName);
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.jar')) {
      cb(null, true); // Uygun dosya uzantısı, dosyayı kabul et
    } else {
      cb(new Error('Sadece .jar uzantılı dosyalar yükleyebilirsiniz!'));
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.jar')) {
      cb(null, true); // Uygun dosya uzantısı, dosyayı kabul et
    } else {
      cb(new Error('Sadece .jar uzantılı dosyalar yükleyebilirsiniz!'));
    }
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  // Yükleme işlemi tamamlandığında yapılacak işlemler
  // req.file ile yüklenen dosyaya erişebilirsiniz
  console.log(req.file);
  res.send('Dosya yüklendi!');
});

app.get("/mods", (req, res) => { 

  const id = req.query.id; // ID değerini get methodu ile mods?id=x şeklinde aldık

  if (!id) {
    res.status(400).send('ID değeri bulunamadı!');
    return;
  }
  const directory = path.join(__dirname, 'mc-server', id, 'mods');

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Klasör okuma hatası:', err);
      return;
    }

  // Dosya listesini HTML sayfasına aktar
  res.render('mods', { files });
});

});


app.get('/download', (req, res) => {
  const id = req.query.id; // ID değerini get methodu ile mods?id=x şeklinde aldık

  if (!id) {
    res.status(400).send('ID değeri bulunamadı!');
    return;
  }

  const directory = path.join(__dirname, 'mc-server', id, 'mods');

  // Klasörü zip arşivine dönüştür
  const zip = new AdmZip();
  zip.addLocalFolder(directory);

  // Zip dosyasını bellekte oluştur
  const zipBuffer = zip.toBuffer();

  // Dosya indirme işlemini gerçekleştir
  res.set('Content-Disposition', 'attachment; filename=klasor1.zip');
  res.set('Content-Type', 'application/octet-stream');
  res.send(zipBuffer);
});


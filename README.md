# Minecraft Web Paneli

Bu proje, bir Minecraft sunucusunun yönetimi için bir web paneli sağlar. Panel aracılığıyla sunucuyu başlatabilir, durdurabilir, komutlar gönderebilir ve diğer işlemleri gerçekleştirebilirsiniz.

## Özellikler

- Sunucunun durumunu izleme ve kontrol etme
- Sunucuyu başlatma ve durdurma
- Oyuncu listesini görüntüleme ve yönetme
- Sunucuya komut gönderme
- Sunucu dosyalarını yönetme
- Mod dosyalarını yükleme ve yönetme
- Kayıtları görüntüleme ve indirme

## Başlangıç

Aşağıdaki adımları takip ederek projeyi yerel makinenizde çalıştırabilirsiniz.

### Gereksinimler

- Node.js
- npm
- MySQL veritabanı


## Kullanılan Kütüphaneler ve Bağımlılıklar

- express
- Rcon
- child_process
- mysql
- dotenv
- express-rate-limit
- fs
- path
- http
- socket.io
- express-session
- mc-ping-updated
- ejs
- multer
- adm-zip

### Kurulum

1. Projeyi yerel makinenize klonlayın:
git clone <repo-link>
2. Proje dizinine gidin:
cd <project-folder>
3. Gerekli bağımlılıkları yükleyin:
npm install
4. Veritabanı bağlantı ayarlarını yapılandırın:
DOSYA: .env

DB_HOST=veritabanı_sunucu_adresi
DB_USER=veritabanı_kullanıcı_adı
DB_PASSWORD=veritabanı_parolası
DB_NAME=veritabanı_adi
5. Proje'yi başlatın:
npm start
6. Web paneline erişmek için tarayıcıda `http://localhost` adresine gidin.

## Kullanım

1. Web paneline erişin `http://localhost`.
2. Giriş yapın veya yeni bir hesap oluşturun.
3. Sunucularınızı ekleyin veya mevcut sunucularınızı yönetin.
4. Sunucu durumunu izleyin, komut gönderin ve diğer işlemleri gerçekleştirin.

## Veritabanı

Proje, MySQL veritabanı kullanmaktadır. Veritabanı şeması ve örnek verileri `etic.sql` adında bir dosyada bulunmaktadır.

## Katkıda Bulunma

Eğer projeye katkıda bulunmak isterseniz, aşağıdaki adımları takip edebilirsiniz:

1. Bu projeyi klonlayın:
git clone <repo-link>
2. Yeni bir dal oluşturun:
git checkout -b yeni-dal
3. Değişikliklerinizi yapın ve bunları taahhüt edin:
git commit -m "Açıklama"
4. Dalınızı ana dala birleştirin:
git merge yeni-dal
5. Değişiklikleri ana repo'ya gönderin:
git push origin ana-dal

Umarım bu size yardımcı olur!


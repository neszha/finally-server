# Instalasi Aplikasi

## Menyiapkan File Environment
Kami telah menyiapkan file example environment `example.env`. Copy file tersebut menjadi `.env` karena program installer hanya dapat membaca file `.env`.

Jalankan perintah berikut unuk melakukan copy file environment:
```
# cp example.env .env
```

File `.env` digunakan sebagai pengaturan utama saat proses instalasi. Seperti pengaturan port aplikasi, screat key, dan zona waktu. Atur konfigurasi pada file ini sesuai dengen kebutuhan, karena setelah proses instalasi konfigurasi tidak dapat diubah secara langsung. Perlu dilakukan proses instalsi ulang.

Jangan lupa untuk mengganti nilai `SERIAL_NUMBER` dengen nomor serial yang diberikan oleh pengembang aplikasi. Serial Number adalah nomor identitas dari kepemilikan aplikasi ini. Sistem akan melakukan verifikasi terhadap serial number yang anda masukan pada file `.env`. Ketika sistem aplikasi gagal melakukan verifikasi serial number, maka sistem aplikasi akan memblokir akses ke halaman panel.

## Cara Instal Aplikasi
Setelah file `.env` siap, anda dapat menjalankan file `instal.sh [ubuntu|debian]` untuk memulai proses instalasi:
```
# ./instal.sh [ubuntu|debian]
# bash instal.sh [ubuntu|debian] # alternative command
```

## Mengakses Aplikasi
Setelah proses instalasi selesai, anda dapat membuka aplikasi pada web browser mengunakan alamant `ip-komputer-server:port`. 

Halaman pengelola ujian dapat diakses pada url `/panel`. Saat pertama kali proses instalasi, secara default telah disiapkan tiga buah akun default. Ada dapat mengunakan akun tersebut untuk masuk ke halaman dashboard pengelola.

Akun default yang disediakan diantaranya:
| USERNAME  | PASSWORD | HAK AKSES |
| --- | --- | --- |
| admin  | admin  | Administrator/Admin |
| teacher  | teacher  | Teacher/Guru |
| supervisor  | supervisor | Supervisor/Pengawas |

## Cara Uninstall Aplikasi
Untuk melakukan penghapusan aplikasi, anda dapat menjalankan file `uninstall.sh` untuk memulai proses penghapusan:
instalasi:
```
# ./uninstall.sh
# bash uninstall.sh # alternative command
```
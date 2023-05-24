// Import modul
const express = require("express");
const mysql = require("mysql");

const app = express();

const port = 5011;

// Koneksi ke database MySQL
var mydb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_sekolah",
});
mydb.connect();

// Middleware yang digunakan untuk parse data dalam request body (format JSON)
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Akses : /");

  res.send("Homepage Backend Sekolah");
});

// Memasukkan data siswa
app.post("/insert_data_siswa", (req, res) => {
  console.log("Akses : /insert_data_siswa");

  // Menerima data dari request body
  var nis = req.body.nis;
  var nama = req.body.nama;
  var umur = req.body.umur;
  var alamat = req.body.alamat;

  // Memasukkan data kedalam database
  // Membuat Query dan Values yang akan dieksekusi
  var query_create = "INSERT INTO tb_siswa (nis, nama, umur, alamat) VALUES (?, ?, ?, ?)";
  var values_create = [nis, nama, umur, alamat];

  // Eksekusi Query
  mydb.query(query_create, values_create, function (err, result, fields) {
    if (err) throw err;
    console.log(result);

    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil memasukkan data siswa",
      mysql_response: result,
    };

    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Melihat data siswa
app.get("/get_data_siswa", (req, res) => {
  console.log("Akses : /get_data_siswa");

  var query_read = "SELECT * FROM tb_siswa WHERE 1 = 1 ";

  // Jika terdapat parameter yang digunakan, tambahkan ke query
  if (req.query.nis) {
    query_read += "AND nis = " + mysql.escape(req.query.nis);
  }

  // Eksekusi query
  mydb.query(query_read, function (err, result, fields) {
    if (err) throw err;

    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil mendapatkan data siswa",
      data: result,
    };

    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Mengupdate data siswa
app.put("/update_data_siswa", (req, res) => {
  console.log("Akses : /update_data_siswa");

  // Menerima data dari request body
  var nis = req.body.nis;
  var nama = req.body.nama;
  var umur = req.body.umur;
  var alamat = req.body.alamat;

  // Membuat Query update

  var query_update = "UPDATE tb_siswa SET nis=nis";

  if (nama) {
    query_update += ", nama= " + mysql.escape(nama);
  }
  if (umur) {
    query_update += ", umur= " + mysql.escape(umur);
  }
  if (alamat) {
    query_update += ", alamat= " + mysql.escape(alamat);
  }

  query_update += "WHERE nis = " + mysql.escape(nis);

  // Eksekusi Query
  mydb.query(query_update, function (err, result, fields) {
    if (err) throw err;
    console.log(result);

    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil mengubah data siswa",
      mysql_response: result,
    };

    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Menghapus data siswa
app.delete("/delete_data_siswa", (req, res) => {
  console.log("Akses : /delete_data_siswa");

  var nis = req.query.nis;
  var query_delete = "DELETE FROM tb_siswa WHERE nis = " + mysql.escape(nis);

  // Eksekusi query
  mydb.query(query_delete, function (err, result, fields) {
    if (err) throw err;

    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil menghapus data siswa",
      data: result,
    };

    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log("Server berjalan pada URL : http://localhost:" + port);
});

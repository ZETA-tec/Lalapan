CREATE DATABASE penjualan_lalapan;

USE penjualan_lalapan;

CREATE TABLE stok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(255) NOT NULL,
    jumlah INT NOT NULL,
    harga DECIMAL(10, 2) NOT NULL
);

CREATE TABLE penjualan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(255) NOT NULL,
    jumlah INT NOT NULL,
    total_harga DECIMAL(10, 2) NOT NULL
);

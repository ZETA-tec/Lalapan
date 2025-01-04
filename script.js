const stok = JSON.parse(localStorage.getItem("stok")) || [];
const penjualan = JSON.parse(localStorage.getItem("penjualan")) || [];

// Fungsi untuk format harga ke Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

// Menambah baris untuk stok barang
function addRow() {
  const namaBarang = prompt("Masukkan nama barang:");
  const jumlahBarang = parseInt(prompt("Masukkan jumlah barang:"), 10);
  const hargaBarang = parseInt(prompt("Masukkan harga barang:"), 10);

  if (namaBarang && jumlahBarang > 0 && hargaBarang > 0) {
    const existingItem = stok.find((item) => item.nama === namaBarang);

    if (existingItem) {
      existingItem.jumlah += jumlahBarang;
      existingItem.harga = hargaBarang;
    } else {
      stok.push({ nama: namaBarang, jumlah: jumlahBarang, harga: hargaBarang });
    }

    localStorage.setItem("stok", JSON.stringify(stok));
    renderStokTable();
    updateBarangDropdown();
  }
}

// Render tabel stok barang
function renderStokTable() {
  const tbody = document.getElementById("stok-table-body");
  tbody.innerHTML = stok
    .map(
      (item) => `
        <tr>
            <td>${item.nama}</td>
            <td>${item.jumlah}</td>
            <td>${formatRupiah(item.harga)}</td>
        </tr>
    `
    )
    .join("");
}

// Update dropdown barang
function updateBarangDropdown() {
  const dropdown = document.getElementById("nama-barang");
  dropdown.innerHTML = '<option value="">Pilih Barang</option>';
  stok.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.nama;
    option.textContent = item.nama;
    dropdown.appendChild(option);
  });
}

// Menjual barang
function sellItem() {
  const namaBarang = document.getElementById("nama-barang").value;
  const jumlahBarang = parseInt(
    document.getElementById("jumlah-barang").value,
    10
  );

  const item = stok.find((item) => item.nama === namaBarang);

  if (!item || jumlahBarang <= 0 || item.jumlah < jumlahBarang) {
    showNotification("Stok tidak cukup atau barang tidak ditemukan.");
    return;
  }

  item.jumlah -= jumlahBarang;
  const totalHarga = jumlahBarang * item.harga;

  penjualan.push({ nama: namaBarang, jumlah: jumlahBarang, total: totalHarga });
  localStorage.setItem("stok", JSON.stringify(stok));
  localStorage.setItem("penjualan", JSON.stringify(penjualan));

  renderStokTable();
  renderPenjualanTable();
}

// Menjual barang manual
function sellManualItem() {
  const namaBarang = document.getElementById("manual-nama-barang").value;
  const jumlahBarang = parseFloat(
    document.getElementById("manual-jumlah-barang").value
  );
  const hargaBarang = parseFloat(
    document.getElementById("manual-harga-barang").value
  );

  if (!namaBarang || jumlahBarang <= 0 || hargaBarang <= 0) {
    showNotification("Nama barang, jumlah, atau harga tidak valid.");
    return;
  }

  const totalHarga = jumlahBarang * hargaBarang;

  penjualan.push({ nama: namaBarang, jumlah: jumlahBarang, total: totalHarga });
  localStorage.setItem("penjualan", JSON.stringify(penjualan));

  renderPenjualanTable();
  renderTotalPenjualan();
  showNotification("Barang manual berhasil dijual.");
}

// Render tabel penjualan
function renderPenjualanTable() {
  const tbody = document.getElementById("penjualan-table-body");
  tbody.innerHTML = penjualan
    .map(
      (item) => `
        <tr>
            <td>${item.nama}</td>
            <td>${item.jumlah}</td>
            <td>${formatRupiah(item.total)}</td>
        </tr>
    `
    )
    .join("");
  renderTotalPenjualan();
}

// Render total penjualan
function renderTotalPenjualan() {
  const tbody = document.getElementById("total-penjualan-body");
  tbody.innerHTML = penjualan
    .map(
      (item) => `
        <tr>
            <td>${item.nama}</td>
            <td>${item.jumlah}</td>
            <td>${formatRupiah(item.total)}</td>
        </tr>
    `
    )
    .join("");

  const grandTotal = penjualan.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("grand-total").textContent = formatRupiah(grandTotal);
}

// Tampilkan notifikasi
function showNotification(message) {
  const notification = document.getElementById("notification");
  const messageElement = document.getElementById("notification-message");
  messageElement.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Reset semua data
function resetData() {
  localStorage.removeItem("stok");
  localStorage.removeItem("penjualan");
  stok.length = 0;
  penjualan.length = 0;
  renderStokTable();
  renderPenjualanTable();
  updateBarangDropdown();
  renderTotalPenjualan();
  showNotification("Data berhasil direset.");
}

// Ekspor data ke Excel
function exportToExcel(type) {
  const rows = type === "stok" ? stok : penjualan;

  const columns =
    type === "stok"
      ? [["Nama Barang", "Jumlah Barang", "Harga Barang"]]
      : [["Nama Barang", "Jumlah Barang", "Total Harga"]];

  const data = rows.map((row) =>
    type === "stok"
      ? [row.nama, row.jumlah, formatRupiah(row.harga)]
      : [row.nama, row.jumlah, formatRupiah(row.total)]
  );

  const worksheetData = [...columns, ...data];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const date = new Date().toISOString().split("T")[0];
  const filename = `${type}-${date}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

// Initial rendering
renderStokTable();
renderPenjualanTable();
updateBarangDropdown();

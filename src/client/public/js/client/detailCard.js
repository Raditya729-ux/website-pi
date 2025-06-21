function openModal(nama, harga, imageUrl, deskripsi) {
    document.getElementById("modalNama").innerText = nama;
    document.getElementById("modalHarga").innerText = "Rp " + Number(harga).toLocaleString('id-ID');
    document.getElementById("modalImage").src = imageUrl;
    document.getElementById('modalDeskripsi').textContent = deskripsi || 'Tidak ada deskripsi.';
    document.getElementById("detailModal").classList.remove("hidden");
}


function closeModal() {
    document.getElementById("detailModal").classList.add("hidden");
}


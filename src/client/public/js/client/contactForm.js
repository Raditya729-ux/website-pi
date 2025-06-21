document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama || !email || !pesan) {
        alert('Harap isi semua kolom sebelum mengirim.');
        return;
    }

    const nomorWa = '6281395945958'; // Nomor WA tanpa plus, awali dengan kode negara
    const teks = `Halo RA KITCHEN,%0ASaya *${nama}* (${email}) ingin mengirimkan pesan:%0A${pesan}`;
    const linkWa = `https://wa.me/${nomorWa}?text=${teks}`;

    window.open(linkWa, '_blank');
});
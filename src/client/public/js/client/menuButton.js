document.querySelectorAll('.add-to-cart-form').forEach(form => {
    const jumlahInput = form.querySelector('.jumlah-input');
    const btnAddCart = form.querySelector('.btn-add-cart');
    const jumlahControl = form.querySelector('.jumlah-control');
    const kurangBtn = form.querySelector('.kurang');
    const tambahBtn = form.querySelector('.tambah');
    const jumlahView = form.querySelector('.jumlah-view');

    let jumlah = 1;

    btnAddCart.addEventListener('click', () => {
        btnAddCart.classList.add('hidden');
        jumlahControl.classList.remove('hidden');
        jumlah = 1;
        jumlahInput.value = jumlah;
        jumlahView.textContent = jumlah;
    });

    tambahBtn.addEventListener('click', () => {
        jumlah++;
        jumlahInput.value = jumlah;
        jumlahView.textContent = jumlah;
    });

    kurangBtn.addEventListener('click', () => {
        if (jumlah > 1) {
            jumlah--;
            jumlahInput.value = jumlah;
            jumlahView.textContent = jumlah;
        } else {
            jumlah = 1;
            jumlahInput.value = jumlah;
            btnAddCart.classList.remove('hidden');
            jumlahControl.classList.add('hidden');
        }
    });
});
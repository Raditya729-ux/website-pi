const dashboardBtn = document.getElementById('menuDashboardBtn');
const crudBtn = document.getElementById('menuCRUDBtn');
const dashboardSection = document.getElementById('dashboardSection');
const crudSection = document.getElementById('crudSection');

dashboardBtn.addEventListener('click', () => {
  dashboardSection.classList.remove('hidden');
  crudSection.classList.add('hidden');
});

crudBtn.addEventListener('click', (e) => {
  e.preventDefault();
  crudSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
});

const editButtons = document.querySelectorAll('.edit-button');
const popup = document.getElementById('edit-popup');
const closeBtn = document.getElementById('close-popup');
const form = document.getElementById('edit-form');
const namaInput = document.getElementById('edit-nama');
const deskripsiInput = document.getElementById('deskripsi');
const hargaInput = document.getElementById('edit-harga');
const idInput = document.getElementById('edit-id');


editButtons.forEach(button => {
  button.addEventListener('click', (e) => {

    const id = button.dataset.id;
    const nama = button.dataset.nama;
    const harga = button.dataset.harga;
    const deskripsi = button.dataset.deskripsi;


    namaInput.value = nama;
    hargaInput.value = harga;
    idInput.value = id;
    deskripsiInput.value = deskripsi;

    form.action = `/adminDashboard/edit/${id}`;

    popup.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

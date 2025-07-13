  // ======== DOM ELEMENTS (Edit Menu) ========
  const editButtons = document.querySelectorAll('.edit-button');
  const editPopup = document.getElementById('edit-popup');
  const closeEditBtn = document.getElementById('close-popup');
  const editForm = document.getElementById('edit-form');
  const namaInput = document.getElementById('edit-nama');
  const deskripsiInput = document.getElementById('deskripsi');
  const hargaInput = document.getElementById('edit-harga');
  const idInput = document.getElementById('edit-id');

  // ======== SHOW EDIT POPUP ========
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const nama = button.dataset.nama;
      const harga = button.dataset.harga;
      const deskripsi = button.dataset.deskripsi;

      // Set value ke form input
      idInput.value = id;
      namaInput.value = nama;
      hargaInput.value = harga;
      deskripsiInput.value = deskripsi;

      // Set action ke form edit
      editForm.action = `/adminDashboard/edit/${id}`;

      // Tampilkan popup edit
      editPopup.classList.remove('hidden');
    });
  });

  // ======== CLOSE EDIT POPUP ========
  closeEditBtn.addEventListener('click', () => {
    editPopup.classList.add('hidden');
  });


  // ======== DOM ELEMENTS (Delete Menu) ========
  const deleteButtons = document.querySelectorAll('.delete-button');
  const deletePopup = document.getElementById('delete-popup');
  const deleteForm = document.getElementById('delete-form');
  const cancelDeleteBtn = document.getElementById('cancel-delete');

  // ======== SHOW DELETE POPUP ========
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;

      // Set action delete form
      deleteForm.action = `/adminDashboard/delete/${id}`;

      // Tampilkan popup hapus
      deletePopup.classList.remove('hidden');
    });
  });

  // ======== CLOSE DELETE POPUP ========
  cancelDeleteBtn.addEventListener('click', () => {
    deletePopup.classList.add('hidden');
  });

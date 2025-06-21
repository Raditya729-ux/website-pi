document.addEventListener('DOMContentLoaded', function () {
  const profileBtn = document.getElementById('profileBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Supaya gak langsung ketutup
      dropdownMenu.classList.toggle('hidden');
    });

    // Klik di luar ➝ tutup menu
    document.addEventListener('click', function (e) {
      if (!dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
      }
    });

    // Supaya klik di menu gak nutup langsung
    dropdownMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
});

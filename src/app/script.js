// script.js

document.getElementById('services-link').addEventListener('click', function() {
  const form = document.getElementById('service-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Initialiser CKEditor pour la description complète
ClassicEditor
  .create(document.querySelector('#descriptionComplete'))
  .catch(error => {
    console.error(error);
  });

// Réinitialiser le formulaire
document.getElementById('resetBtn').addEventListener('click', function() {
  document.getElementById('serviceForm').reset();
});

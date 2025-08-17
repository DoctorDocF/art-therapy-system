document.addEventListener('DOMContentLoaded', async () => {
  // Проверка авторизации
  const response = await fetch('/api/auth/check');
  
  if (response.ok) {
    loadMainInterface();
  } else {
    showLoginForm();
  }
});

function loadMainInterface() {
  document.querySelector('.main-content').innerHTML = `
    <div class="dashboard">
      <nav class="sidebar">...</nav>
      <section class="patient-management">...</section>
    </div>
  `;
}
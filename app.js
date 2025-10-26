// --- Manejo del modal de login (funciona en cualquier página) ---
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
    };
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
  }
});

// Capturamos el formulario
const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cuenta: login,
        contrasena: contrasena
      })
    });

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.warn("Respuesta no JSON del servidor", parseErr);
      data = {};
    }

    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        Swal.fire({
          icon: "success",
          title: "Acceso permitido",
          text: `Bienvenido ${cuenta}!`,
          confirmButtonColor: "#222"
        });

        //guardar en el localstorage 
        localStorage.setItem("login", login);
        localStorage.setItem("contrasena", contrasena);

        console.log("Usuario recibido:", data.usuario);

        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = cuenta;

        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
      } else {
        Swal.fire({
          icon: "warning",
          title: "Error inesperado",
          text: "Respuesta incompleta del servidor. No se permite el acceso."
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`
      });
      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
    }
  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor."
    });
  }
});

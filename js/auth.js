/**
 * Shared authentication utilities
 */

function loginUser(email, password) {
  const raw = localStorage.getItem("monstra_users") || "{}";
  const users = JSON.parse(raw);

  if (!users[email]) {
    alert("No account found. Try registering.");
    return false;
  }

  if (users[email].password !== password) {
    alert("Wrong password.");
    return false;
  }

  localStorage.setItem("monstra_currentUser", email);
  return true;
}

function registerUser(username, email, password, confirm) {
  if (!username || !email || !password) {
    alert("All fields are required.");
    return false;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return false;
  }

  const raw = localStorage.getItem("monstra_users") || "{}";
  const users = JSON.parse(raw);

  if (users[email]) {
    alert("Email already exists. Try logging in.");
    return false;
  }

  users[email] = {
    username,
    password,
    monstraBytes: 0,
    ownedMonsters: []
  };

  localStorage.setItem("monstra_users", JSON.stringify(users));
  localStorage.setItem("monstra_currentUser", email);
  return true;
}

function checkAuthGuard() {
  const email = localStorage.getItem("monstra_currentUser");
  if (!email) {
    window.location.href = "../index.html";
    return null;
  }
  return email;
}

function getCurrentUser() {
  const email = localStorage.getItem("monstra_currentUser");
  if (!email) return null;

  const users = JSON.parse(localStorage.getItem("monstra_users") || "{}");
  return users[email] || null;
}

function saveUser(email, userData) {
  const users = JSON.parse(localStorage.getItem("monstra_users") || "{}");
  users[email] = userData;
  localStorage.setItem("monstra_users", JSON.stringify(users));
}

function logout() {
  localStorage.removeItem("monstra_currentUser");
  window.location.href = "../index.html";
}

function resetAllData() {
  const confirmReset = confirm("Delete ALL saved users and logins?");
  if (!confirmReset) return false;

  localStorage.clear();
  alert("All users cleared. Register again!");
  location.reload();
  return true;
}

// Initialize auth forms if they exist on the page
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form.auth-form");
  const resetBtn = document.getElementById("resetAllBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;

      if (loginUser(email, password)) {
        window.location.href = "./monsters/";
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetAllData);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

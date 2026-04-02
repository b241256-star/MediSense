// ============================================================
//  AUTH.JS — MediSense AI Authentication Module (Backend Connected)
//  Handles: login, registration, session, password toggle
// ============================================================

const API_URL = 'http://localhost:5000/api';

/** Get the currently logged-in user session */
function getSession() {
  try {
    return JSON.parse(localStorage.getItem('medisense_session') || 'null');
  } catch (e) {
    return null;
  }
}

/** Save the logged-in user to session */
function saveSession(user) {
  localStorage.setItem('medisense_session', JSON.stringify(user));
}

/** Clear session */
function clearSession() {
  localStorage.removeItem('medisense_session');
}

/** Get JWT Token */
function getToken() {
  const session = getSession();
  return session ? session.token : null;
}

// ===== FORM TAB SWITCHING =====
function switchTab(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('tab-register').style.display = tab === 'register' ? 'block' : 'none';
}

function switchTabManual(tab) {
  const btn = document.querySelector('.auth-tab-wrap .auth-tab:' + (tab === 'login' ? 'first-child' : 'last-child'));
  if (btn) switchTab(tab, btn);
}

// ===== PASSWORD SHOW/HIDE TOGGLE =====
function togglePass(inputId, icon) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
}

// ===== ERROR MESSAGES =====
function showErr(boxId, message) {
  const el = document.getElementById(boxId);
  if (!el) return;
  el.querySelector('span').textContent = message;
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// ===== LOGIN =====
async function doLogin() {
  const email = document.getElementById('li-email').value.trim().toLowerCase();
  const password = document.getElementById('li-pass').value;

  if (!email || !password) return showErr('login-err', 'Please enter your email and password.');

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    loginSuccess(data);
  } catch (err) {
    showErr('login-err', err.message);
  }
}

// ===== REGISTER =====
async function doRegister() {
  const name = document.getElementById('re-name').value.trim();
  const email = document.getElementById('re-email').value.trim().toLowerCase();
  const password = document.getElementById('re-pass').value;
  const age = document.getElementById('re-age').value;
  const gender = document.getElementById('re-gender').value;

  if (!name || !email || !password) return showErr('reg-err', 'Please fill required fields.');
  if (password.length < 6) return showErr('reg-err', 'Password must be at least 6 characters.');

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, age, gender })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    loginSuccess(data);
  } catch (err) {
    showErr('reg-err', err.message);
  }
}

function doGoogleLogin() {
  alert('Google Login is normally handled via OAuth flow on backend.');
}

// ===== LOGIN SUCCESS =====
function loginSuccess(user) {
  if (!window.App) window.App = {};
  App.user = user;
  saveSession(user);

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('navAvatar').textContent = initials;
  document.getElementById('navName').textContent = user.name.split(' ')[0];
  document.getElementById('ddName').textContent = user.name;
  document.getElementById('ddEmail').textContent = user.email;

  if (user.age) document.getElementById('patientAge').value = user.age;
  if (user.gender) document.getElementById('patientGender').value = user.gender;

  const authPage = document.getElementById('auth-page');
  authPage.classList.remove('active');
  authPage.style.display = 'none';
  document.getElementById('main-app').style.display = 'block';

  // We check if renderHospitals is defined because they might load in different order
  if (typeof renderHospitals === 'function') renderHospitals('all');
  if (typeof renderSymptomCategories === 'function') renderSymptomCategories();
  if (typeof showPage === 'function') showPage('home');
  if (typeof loadChatHistory === 'function') loadChatHistory();
}

// ===== LOGOUT =====
function doLogout() {
  if (!confirm('Sign out of MediSense AI?')) return;
  clearSession();
  App.user = null;
  if(App.convMsgs) App.convMsgs = [];
  if(App.chips) App.chips.clear();

  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  if (document.getElementById('chatMessages')) document.getElementById('chatMessages').innerHTML = '';

  document.getElementById('main-app').style.display = 'none';
  const authPage = document.getElementById('auth-page');
  authPage.style.display = 'flex';
  authPage.classList.add('active');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const sess = getSession();
  if (sess) {
    loginSuccess(sess);
  } else {
    document.getElementById('auth-page').style.display = 'flex';
    document.getElementById('auth-page').classList.add('active');
  }

  const bindEnter = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') fn(); });
  };
  
  bindEnter('li-email', doLogin);
  bindEnter('li-pass', doLogin);
  bindEnter('re-name', doRegister);
  bindEnter('re-email', doRegister);
  bindEnter('re-pass', doRegister);
});

// ============================================================
//  APP.JS — MediSense AI Core App Logic
// ============================================================

const API_BASE = 'http://localhost:5000/api';

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link[data-page]').forEach(a => a.classList.remove('active'));

  const page = document.getElementById('page-' + id);
  if (!page) return;
  page.classList.add('active');

  const link = document.querySelector('[data-page="' + id + '"]');
  if (link) link.classList.add('active');

  App.currentPage = id;

  if (id === 'chat') {
    if (typeof loadChatHistory === 'function') loadChatHistory();
  }
  if (id === 'symptoms') {
    if (typeof renderSymptomCategories === 'function') renderSymptomCategories();
  }

  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function quickSearch(symptomsText) {
  showPage('chat');
  setTimeout(() => processMsg('I have ' + symptomsText), 350);
}

function toggleMobileMenu() { document.getElementById('navLinks').classList.toggle('open'); }
function closeMobileMenu() { document.getElementById('navLinks').classList.remove('open'); }
function toggleDropdown() { document.getElementById('profileDropdown').classList.toggle('open'); }
function closeDropdown() { document.getElementById('profileDropdown').classList.remove('open'); }

document.addEventListener('click', function(e) {
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn && !profileBtn.contains(e.target)) closeDropdown();
});

// ===== PROFILE MODAL =====
function openProfileModal() {
  if (!App.user) return;
  const u = App.user;
  const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('profileBigAvatar').textContent = initials;
  document.getElementById('profileInfoName').textContent   = u.name;
  document.getElementById('profileInfoEmail').textContent  = u.email;
  document.getElementById('profileInfoAge').textContent    = u.age    || 'Not set';
  document.getElementById('profileInfoGender').textContent = u.gender ? capitalize(u.gender) : 'Not set';
  document.getElementById('profileInfoSince').textContent  = 'Member since: Active Session';
  document.getElementById('profileInfoChats').textContent  = 'Cloud saved';
  document.getElementById('profileModal').classList.add('open');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('open');
  const edit = document.getElementById('profileEditForm');
  if (edit && edit.style.display !== 'none') toggleProfileEdit();
}

function toggleProfileEdit() {
  const view = document.getElementById('profileDetailsView');
  const edit = document.getElementById('profileEditForm');
  const acts = document.getElementById('profileActionsRow');
  if (!view || !edit) return;
  if (edit.style.display === 'none') {
    view.style.display = 'none';
    acts.style.display = 'none';
    edit.style.display = 'block';
    const u = App.user;
    document.getElementById('editProfileName').value   = u.name   || '';
    document.getElementById('editProfileAge').value    = u.age    || '';
    document.getElementById('editProfileGender').value = u.gender || '';
  } else {
    edit.style.display = 'none';
    view.style.display = 'block';
    acts.style.display = 'flex';
  }
}

async function saveProfile() {
  const name   = document.getElementById('editProfileName').value.trim();
  const age    = document.getElementById('editProfileAge').value;
  const gender = document.getElementById('editProfileGender').value;
  if (!name) { alert('Name cannot be empty.'); return; }
  const token = App.user && App.user.token;
  if (!token) { alert('Not logged in.'); return; }
  try {
    const res = await fetch(API_BASE + '/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ name, age, gender })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');
    App.user.name   = data.name;
    App.user.age    = data.age;
    App.user.gender = data.gender;
    saveSession(App.user);
    const initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('navAvatar').textContent = initials;
    document.getElementById('navName').textContent   = data.name.split(' ')[0];
    document.getElementById('ddName').textContent    = data.name;
    toggleProfileEdit();
    openProfileModal();
    alert('Profile updated!');
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== HISTORY MODAL — loads real data from DB =====
async function openHistoryModal() {
  document.getElementById('historyModal').classList.add('open');
  const body = document.getElementById('historyModalBody');
  body.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:1rem;">Loading...</p></div>';

  try {
    const session = JSON.parse(localStorage.getItem('medisense_session') || '{}');
    const token = session.token;
    if (!token) throw new Error('Not logged in');

    const res = await fetch(API_BASE + '/chat/history', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const history = await res.json();

    const userMsgs = Array.isArray(history) ? history.filter(function(m) { return m.role === 'user'; }) : [];

    if (userMsgs.length === 0) {
      body.innerHTML = '<div class="history-empty"><i class="fas fa-comments"></i><p>No chat history yet.</p><button onclick="closeHistoryModal();showPage(\'chat\');" style="margin-top:1rem;padding:0.6rem 1.5rem;background:var(--primary);color:white;border:none;border-radius:50px;cursor:pointer;font-weight:600;">Start Chat</button></div>';
      return;
    }

    var html = '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">' + userMsgs.length + ' message(s) saved</p>';
    userMsgs.forEach(function(msg, i) {
      var date = new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      var preview = msg.message.length > 80 ? msg.message.slice(0, 80) + '...' : msg.message;
      html += '<div class="history-session" onclick="loadAndScrollToMessage(' + i + ');" style="cursor:pointer;">';
      html += '<div class="history-session-label">Message #' + (i + 1) + ' &nbsp;&middot;&nbsp; ' + date + '</div>';
      html += '<div class="history-session-msg user"><i class="fas fa-user" style="margin-right:5px;"></i>' + preview + '</div>';
      html += '</div>';
    });
    body.innerHTML = html;

  } catch (err) {
    body.innerHTML = '<div class="history-empty"><i class="fas fa-exclamation-circle"></i><p>Could not load history.</p></div>';
  }
}

function closeHistoryModal() {
  document.getElementById('historyModal').classList.remove('open');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeProfileModal();
    closeHistoryModal();
    closeDropdown();
  }
});

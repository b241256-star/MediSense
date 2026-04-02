// ============================================================
//  CHAT.JS — MediSense AI Chat Module
// ============================================================

const API_CHAT_URL = 'http://localhost:5000/api/chat';

function getAuthToken() {
  const session = JSON.parse(localStorage.getItem('medisense_session') || '{}');
  return session.token || null;
}

if (!window.App) window.App = { convMsgs: [], chips: new Set(), isTyping: false };

// ============================================================
//  LOAD HISTORY
// ============================================================
async function loadChatHistory() {
  const token = getAuthToken();
  if (!token) return;
  try {
    const res = await fetch(`${API_CHAT_URL}/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed');
    const history = await res.json();
    const messageArea = document.getElementById('chatMessages');
    if (!messageArea) return;
    
    messageArea.innerHTML = '';
    App.convMsgs = [];
    
    if (history.length === 0) {
      initChat();
    } else {
      history.forEach(msg => {
        if (msg.role === 'user') addUserMsg(msg.message);
        else addBotMsg(formatBotText(msg.message));
      });
    }
  } catch (err) {
    initChat();
  }
}

/**
 * Load chat history and scroll to a specific user message
 * Called when user clicks on a message in the history modal
 * @param {number} messageIndex - Index of the user message to scroll to
 */
/**
 * Unified function to load history and properly navigate + scroll
 * This ensures async operations complete in the right order
 */
async function loadAndScrollToMessage(messageIndex) {
  // Step 1: Close modal and navigate to chat page
  closeHistoryModal();
  showPage('chat');
  
  // Step 2: Wait a moment for page transition
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Step 3: Load history and scroll
  await loadHistoryUpToMessage(messageIndex);
}

async function loadHistoryUpToMessage(messageIndex) {
  const token = getAuthToken();
  if (!token) return;
  try {
    const res = await fetch(`${API_CHAT_URL}/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed');
    const history = await res.json();
    const messageArea = document.getElementById('chatMessages');
    if (!messageArea) return;
    
    messageArea.innerHTML = '';
    App.convMsgs = [];
    
    if (history.length === 0) {
      initChat();
      return;
    }

    let userMsgCount = 0;
    let targetDiv = null;
    history.forEach((msg, idx) => {
      if (msg.role === 'user') {
        const msgDiv = addUserMsg(msg.message);
        if (userMsgCount === messageIndex && msgDiv) {
          targetDiv = msgDiv;
        }
        userMsgCount++;
      } else {
        addBotMsg(formatBotText(msg.message));
      }
    });

    // Scroll to target message after a small delay to ensure DOM is updated
    if (targetDiv) {
      setTimeout(() => {
        targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetDiv.style.backgroundColor = 'rgba(10,79,110,0.1)';
        setTimeout(() => {
          targetDiv.style.backgroundColor = '';
        }, 2000);
      }, 100);
    }
  } catch (err) {
    initChat();
  }
}


// ============================================================
//  MARKDOWN FORMATTER — FIXED
// ============================================================
function formatBotText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#{1,3} (.+)/gm, '<div class="bot-heading">$1</div>')
    .replace(/^(\d+)\. (.+)/gm, '<div class="bot-list-num"><span class="bot-num">$1.</span><span>$2</span></div>')
    .replace(/^[•·\-] (.+)/gm, '<div class="bot-list-item"><span class="bot-bullet">›</span><span>$1</span></div>')
    .replace(/---/g, '<hr class="bot-divider">')
    .replace(/\n/g, '<br>');
}

// ============================================================
//  CHAT UI
// ============================================================
function initChat() {
  const name = App.user?.name?.split(' ')[0] || 'there';
  addBotMsg(`
    👋 <strong>Hello, ${name}! I'm MediSense AI — your personal health assistant.</strong><br><br>
    I understand <strong>English</strong> and <strong>Hinglish</strong>!<br><br>
    <div style="background:var(--bg);border-radius:10px;padding:10px 14px;margin-top:4px;font-size:0.85rem;line-height:2;border:1px solid var(--border);">
      💬 <em>"I have fever and headache since 2 days"</em><br>
      💬 <em>"Mujhe bukhaar hai, sar dard bhi ho raha hai"</em>
    </div><br>
    Tap symptom chips on the left or type below!<br>
    <small style="color:var(--text-muted);">⚠️ Educational only — always see a real doctor.</small>
  `);
}

function addUserMsg(text) {
  const area = document.getElementById('chatMessages');
  if (!area) return null;
  const div = document.createElement('div');
  div.className = 'msg user-msg';
  div.innerHTML = `
    <div class="msg-avatar-sm usr"><i class="fas fa-user"></i></div>
    <div class="bubble">${text}</div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
  return div;
}

function addBotMsg(html) {
  const area = document.getElementById('chatMessages');
  if (!area) return;
  const div = document.createElement('div');
  div.className = 'msg bot-msg';
  div.innerHTML = `
    <div class="msg-avatar-sm bot"><i class="fas fa-heartbeat"></i></div>
    <div class="bubble">${html}</div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = document.getElementById('chatMessages');
  if (!area) return;
  const div = document.createElement('div');
  div.className = 'msg bot-msg';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-avatar-sm bot"><i class="fas fa-heartbeat"></i></div>
    <div class="typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text || App.isTyping) return;
  input.value = '';
  input.style.height = 'auto';
  processMsg(text);
}

function sendChips() {
  if (!App.chips.size) return;
  const symsText = 'I have ' + [...App.chips].join(', ');
  const input = document.getElementById('chatInput');
  input.value = symsText;
  input.focus();
  autoResize(input);
}

// ============================================================
//  SEND TO BACKEND
// ============================================================
async function processMsg(text) {
  addUserMsg(text);
  App.isTyping = true;
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) sendBtn.disabled = true;
  showTyping();

  const token = getAuthToken();
  if (!token) {
    removeTyping();
    addBotMsg("⚠️ Please log in to chat.");
    App.isTyping = false;
    if (sendBtn) sendBtn.disabled = false;
    return;
  }

  try {
    const res = await fetch(`${API_CHAT_URL}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    removeTyping();
    if (!res.ok) {
      addBotMsg("⚠️ Error: " + (data.message || 'Something went wrong.'));
    } else {
      addBotMsg(formatBotText(data.message));
    }
  } catch (err) {
    removeTyping();
    addBotMsg("⚠️ Network Error: Make sure backend server is running.");
  } finally {
    App.isTyping = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}

// ============================================================
//  CHIP SELECTION — FIXED
// ============================================================
function toggleChip(el, sym) {
  el.classList.toggle('selected');
  if (App.chips.has(sym)) {
    App.chips.delete(sym);
  } else {
    App.chips.add(sym);
  }
  updateChipsButton();
}

function updateChipsButton() {
  const btn = document.getElementById('sendChipsBtn');
  if (!btn) return;
  if (App.chips.size > 0) {
    btn.style.display = 'flex';
    btn.innerHTML = `<i class="fas fa-paper-plane"></i> Send ${App.chips.size} Symptom${App.chips.size > 1 ? 's' : ''}`;
  } else {
    btn.style.display = 'none';
  }
}

function clearChat() {
  const area = document.getElementById('chatMessages');
  if (area) area.innerHTML = '';
  App.convMsgs = [];
  App.chips.clear();
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  updateChipsButton();
  initChat();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

/**
 * Fill the textarea with text and prepare to send
 * Called when user clicks on quick-pill suggestions
 * @param {string} text - The text to fill in the textarea
 */
function fillInput(text) {
  const input = document.getElementById('chatInput');
  if (!input) return;
  input.value = text;
  autoResize(input);
  input.focus();
}

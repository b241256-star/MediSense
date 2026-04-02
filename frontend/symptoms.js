// ============================================================
//  SYMPTOMS.JS — MediSense AI Symptoms Page Module
//  Handles: rendering symptom categories, symptom search/filter,
//           clicking a symptom to start AI diagnosis
//  Data comes from: data.js → SymData array
// ============================================================


/**
 * Render the symptom categories grid
 * Only runs once (checks if grid is already populated)
 */
function renderSymptomCategories() {
  const grid = document.getElementById('symptomCategoriesGrid');
  if (!grid) return;

  // Don't re-render if already populated
  if (grid.children.length > 0) return;

  grid.innerHTML = SymData.map(cat => `
    <div class="sym-cat-card">
      <!-- Category header: icon + name + count -->
      <div class="sym-cat-header">
        <div class="sym-cat-icon" style="background:${cat.bg}; color:${cat.color};">
          ${cat.icon}
        </div>
        <div>
          <div class="sym-cat-title">${cat.name}</div>
          <div class="sym-cat-count">${cat.syms.length} symptom${cat.syms.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <!-- Symptom rows: click to start AI diagnosis -->
      <div class="sym-list">
        ${cat.syms.map(s => {
          // Get severity label and colors
          const sevStyle = getSeverityStyle(s.s);
          // Extract just the English part of the symptom name for the AI query
          const cleanName = s.n.split('(')[0].trim().toLowerCase();
          return `
            <div class="sym-row" onclick="diagnoseSym('${cleanName}')">
              <span class="sym-name">${s.n}</span>
              <span class="sym-severity" style="background:${sevStyle.bg}; color:${sevStyle.color};">
                ${sevStyle.label}
              </span>
            </div>`;
        }).join('')}
      </div>
    </div>`).join('');
}


/**
 * Get severity badge styles based on severity level
 * @param {string} s - 'high' | 'medium' | 'low'
 * @returns {Object} - { bg, color, label }
 */
function getSeverityStyle(s) {
  if (s === 'high') {
    return { bg: '#fee2e2', color: '#991b1b', label: '🔴 Serious' };
  } else if (s === 'medium') {
    return { bg: '#fef9c3', color: '#854d0e', label: '🟡 Moderate' };
  } else {
    return { bg: '#dcfce7', color: '#166534', label: '🟢 Mild' };
  }
}


/**
 * Navigate to the chat page and start a diagnosis for a specific symptom
 * Called when user clicks a symptom row
 * @param {string} symptom - symptom name string (English)
 */
function diagnoseSym(symptom) {
  showPage('chat');
  // Small delay to let the page transition complete before sending
  setTimeout(() => processMsg('I have ' + symptom), 300);
}


/**
 * Filter symptom rows based on search input
 * Called on every keystroke in the symptom search bar
 * @param {string} query - search string from input
 */
function filterSymptoms(query) {
  const q = query.toLowerCase().trim();

  document.querySelectorAll('.sym-row').forEach(row => {
    const name = row.querySelector('.sym-name').textContent.toLowerCase();
    // Show row if query matches symptom name, else hide
    row.style.display = name.includes(q) ? 'flex' : 'none';
  });

  // Show/hide entire category cards based on whether any symptoms are visible
  document.querySelectorAll('.sym-cat-card').forEach(card => {
    const visibleRows = card.querySelectorAll('.sym-row:not([style*="display: none"])');
    card.style.display = visibleRows.length > 0 ? 'block' : 'none';
  });
}

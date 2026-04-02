// ============================================================
//  HOSPITALS.JS — MediSense AI Hospital Module (Backend Connected)
// ============================================================

const API_HOSP_URL = 'http://localhost:5000/api/hospitals';

let currentHospitals = [];
let userLocation = null;

async function fetchHospitals() {
  try {
    const payload = {};
    if (userLocation) {
      payload.lat = userLocation.lat;
      payload.lng = userLocation.lng;
    }

    const res = await fetch(`${API_HOSP_URL}/nearby`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to fetch hospitals');
    currentHospitals = await res.json();
    return currentHospitals;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function renderHospitals(filter = 'all') {
  const grid = document.getElementById('hospitalsGrid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Loading hospitals...</p></div>';

  let data = await fetchHospitals();

  if (filter !== 'all') {
    data = data.filter(h => h.type && h.type.toLowerCase() === filter.toLowerCase());
  }

  if (!data.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
        <i class="fas fa-hospital" style="font-size:3rem;opacity:0.3;display:block;margin-bottom:1rem;"></i>
        <p>No hospitals found for this filter.</p>
      </div>`;
    return;
  }

  const typeIcons  = { government: '🏛️', private: '🏥', clinic: '🩺', emergency: '🚨' };

  grid.innerHTML = data.map(h => {
    const typeKey = h.type ? h.type.toLowerCase() : 'private';
    const icon = typeIcons[typeKey] || '🏥';
    
    const distText = h.distance_km ? `📏 ${h.distance_km} km` : '';

    return `
      <div class="hosp-card">
        <div class="hosp-card-top ${typeKey === 'government' ? 'govt' : 'pvt'}">
          <div class="hosp-top-icon">${icon}</div>
          <span class="hosp-top-badge">${h.type || 'Hospital'}</span>
          <span class="hosp-dist-badge">${distText}</span>
        </div>
        <div class="hosp-body">
          <div class="hosp-name">${h.name}</div>
          <div class="hosp-addr">
            <i class="fas fa-map-marker-alt"></i>
            <span>${h.address}</span>
          </div>
          <div class="hosp-meta-row">
            <span class="hosp-rating">⭐ ${h.rating || '4.0'}</span>
          </div>
          <div class="hosp-actions">
            <button class="hosp-btn hosp-btn-dir" onclick="openDirections('${h.name.replace(/'/g, "\\'")}', '${(h.address||'').replace(/'/g, "\\'")}')">
              <i class="fas fa-directions"></i> Directions
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterHospitals(btn, type) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHospitals(type);
}

function openDirections(name, address) {
  const query = encodeURIComponent(name + ', ' + address);
  window.open('https://www.google.com/maps/search/?api=1&query=' + query, '_blank');
}

function locateMe() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  const btn = event.currentTarget || event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    position => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      const searchInput = document.getElementById('locationSearchInput');
      if (searchInput) {
        searchInput.value = `${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E`;
      }
      btn.innerHTML = '<i class="fas fa-crosshairs"></i> My Location';
      btn.disabled = false;
      renderHospitals('all'); // Re-fetch with distance
    },
    () => {
      alert('Could not get your location. Please check browser permissions and try again.');
      btn.innerHTML = originalText;
      btn.disabled = false;
    },
    { timeout: 8000 }
  );
}

function searchHospitals() {
  const location = document.getElementById('locationSearchInput')?.value || 'Jaipur';
  const query = encodeURIComponent('hospitals near ' + location);
  window.open('https://www.google.com/maps/search/' + query, '_blank');
}

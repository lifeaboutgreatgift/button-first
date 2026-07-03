/* ==========================================
   TABS
   ========================================== */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');

    // refresh display when switching tabs
    renderLocal();
    renderSession();
    renderCookies();
    renderIDB();
  });
});

/* ==========================================
   HELPER — render a storage item row
   ========================================== */
function makeItem(key, value, onDelete) {
  const item = document.createElement('div');
  item.className = 'storage-item';
  item.innerHTML = `
    <span class="item-key">${key}</span>
    <span class="item-value">${value}</span>
    <button class="item-delete">delete</button>
  `;
  item.querySelector('.item-delete').addEventListener('click', onDelete);
  return item;
}

function showEmpty(el) {
  el.innerHTML = '<div class="empty-msg">nothing stored yet</div>';
}

/* ==========================================
   1. localStorage
   ========================================== */
function addLocal() {
  const key   = document.getElementById('local-key').value.trim();
  const value = document.getElementById('local-value').value.trim();
  if (!key || !value) return;

  localStorage.setItem(key, value);
  document.getElementById('local-key').value   = '';
  document.getElementById('local-value').value = '';
  renderLocal();
}

function clearLocal() {
  localStorage.clear();
  renderLocal();
}

function renderLocal() {
  const display = document.getElementById('local-display');
  display.innerHTML = '';

  if (localStorage.length === 0) return showEmpty(display);

  for (let i = 0; i < localStorage.length; i++) {
    const key   = localStorage.key(i);
    const value = localStorage.getItem(key);

    display.appendChild(makeItem(key, value, () => {
      localStorage.removeItem(key);
      renderLocal();
    }));
  }
}

/* ==========================================
   2. sessionStorage
   ========================================== */
function addSession() {
  const key   = document.getElementById('session-key').value.trim();
  const value = document.getElementById('session-value').value.trim();
  if (!key || !value) return;

  sessionStorage.setItem(key, value);
  document.getElementById('session-key').value   = '';
  document.getElementById('session-value').value = '';
  renderSession();
}

function clearSession() {
  sessionStorage.clear();
  renderSession();
}

function renderSession() {
  const display = document.getElementById('session-display');
  display.innerHTML = '';

  if (sessionStorage.length === 0) return showEmpty(display);

  for (let i = 0; i < sessionStorage.length; i++) {
    const key   = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);

    display.appendChild(makeItem(key, value, () => {
      sessionStorage.removeItem(key);
      renderSession();
    }));
  }
}

/* ==========================================
   3. Cookies
   ========================================== */
function addCookie() {
  const name   = document.getElementById('cookie-key').value.trim();
  const value  = document.getElementById('cookie-value').value.trim();
  const days   = parseInt(document.getElementById('cookie-expiry').value);
  if (!name || !value) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + days);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;

  document.getElementById('cookie-key').value   = '';
  document.getElementById('cookie-value').value = '';
  renderCookies();
}

function clearCookies() {
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
  renderCookies();
}

function renderCookies() {
  const display = document.getElementById('cookie-display');
  display.innerHTML = '';

  const raw = document.cookie;
  if (!raw) return showEmpty(display);

  raw.split(';').forEach(pair => {
    const [name, value] = pair.trim().split('=');
    if (!name) return;

    display.appendChild(makeItem(name, value || '', () => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      renderCookies();
    }));
  });
}

/* ==========================================
   4. IndexedDB
   ========================================== */
let db;

const dbRequest = indexedDB.open('StorageExplorer', 1);

dbRequest.onupgradeneeded = (e) => {
  db = e.target.result;
  if (!db.objectStoreNames.contains('people')) {
    db.createObjectStore('people', { keyPath: 'id', autoIncrement: true });
  }
};

dbRequest.onsuccess = (e) => {
  db = e.target.result;
  renderIDB();
};

dbRequest.onerror = () => {
  console.error('IndexedDB failed to open');
};

function addIDB() {
  const name = document.getElementById('idb-name').value.trim();
  const age  = parseInt(document.getElementById('idb-age').value);
  const role = document.getElementById('idb-role').value.trim();
  if (!name || !age || !role) return;

  const tx    = db.transaction(['people'], 'readwrite');
  const store = tx.objectStore('people');
  store.add({ name, age, role });

  tx.oncomplete = () => {
    document.getElementById('idb-name').value = '';
    document.getElementById('idb-age').value  = '';
    document.getElementById('idb-role').value = '';
    renderIDB();
  };
}

function clearIDB() {
  const tx    = db.transaction(['people'], 'readwrite');
  const store = tx.objectStore('people');
  store.clear();
  tx.oncomplete = renderIDB;
}

function renderIDB() {
  const display = document.getElementById('idb-display');
  display.innerHTML = '';

  if (!db) return;

  const tx      = db.transaction(['people'], 'readonly');
  const store   = tx.objectStore('people');
  const request = store.getAll();

  request.onsuccess = () => {
    const people = request.result;
    if (people.length === 0) return showEmpty(display);

    people.forEach(person => {
      display.appendChild(makeItem(
        `#${person.id} ${person.name}`,
        `age: ${person.age} · role: ${person.role}`,
        () => {
          const delTx = db.transaction(['people'], 'readwrite');
          delTx.objectStore('people').delete(person.id);
          delTx.oncomplete = renderIDB;
        }
      ));
    });
  };
}

/* ==========================================
   INITIAL RENDER
   ========================================== */
renderLocal();
renderSession();
renderCookies();
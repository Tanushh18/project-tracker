const API = '/api';
let projects = [];
let accounts = [];
let editingProjectId = null;
let editingAccountId = null;

// ---- Tabs ----
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('view-' + btn.dataset.tab).classList.add('active');
  });
});

// ---- Modal helpers ----
function openModal(el) { el.classList.add('open'); }
function closeModal(el) { el.classList.remove('open'); }
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.remove('open'));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
});

const STATUS_LABEL = {
  planning: 'Planning', in_progress: 'In progress', deployed: 'Deployed',
  broken: 'Broken', paused: 'Paused', archived: 'Archived'
};

// =========================================================
// PROJECTS
// =========================================================
async function loadProjects() {
  const res = await fetch(`${API}/projects`);
  projects = await res.json();
  renderProjects();
}

function renderProjects() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = '';

  const filtered = projects.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (!q) return true;
    const dbText = (p.databases || []).map(d => `${d.provider} ${d.type} ${d.account_email}`).join(' ');
    const haystack = [
      p.name, p.tags, p.hosting_provider, dbText,
      p.hosting_account_email, p.category, p.tech_stack,
      p.firebase_project_id, p.google_cloud_project_id, p.play_store_package_name
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });

  if (!filtered.length) {
    grid.innerHTML = `<p style="color:var(--muted)">No projects found. Click "+ Add Project" to create one.</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-top">
        <h3>${escapeHtml(p.name)}</h3>
        <span class="badge ${p.status}">${STATUS_LABEL[p.status] || p.status}</span>
      </div>
      <p class="desc">${escapeHtml(p.description || 'No description')}</p>
      <div class="meta">
        ${p.hosting_provider ? `<span><b>Host:</b> ${escapeHtml(p.hosting_provider)}${p.hosting_account_email ? ' · ' + escapeHtml(p.hosting_account_email) : ''}</span>` : ''}
        ${p.databases && p.databases.length ? `<span><b>DB:</b> ${escapeHtml(p.databases.map(d => d.provider || d.type).filter(Boolean).join(', '))}</span>` : ''}
        ${p.live_url ? `<span><b>URL:</b> ${escapeHtml(p.live_url)}</span>` : ''}
      </div>
    `;
    card.addEventListener('click', () => openDetail(p._id));
    grid.appendChild(card);
  });
}

document.getElementById('search').addEventListener('input', renderProjects);
document.getElementById('filterStatus').addEventListener('change', renderProjects);

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---- Project form ----
const PROJECT_FIELDS = [
  'name','description','category','tech_stack','status','priority','tags',
  'repo_url','repo_account','live_url','custom_domain',
  'hosting_provider','hosting_account_email','hosting_account_label','hosting_service_name','hosting_plan','hosting_region','auto_deploy_branch',
  'firebase_project_id','firebase_account_email','google_cloud_project_id','google_cloud_account_email',
  'play_store_package_name','play_store_account_email','play_store_url','play_store_status',
  'dns_provider','dns_account_email',
  'env_vars_location','env_var_names',
  'monitoring_provider','monitoring_account_email',
  'last_deployed_at','notes'
];

function resetProjectForm() {
  editingProjectId = null;
  document.getElementById('p_id').value = '';
  PROJECT_FIELDS.forEach(f => {
    const el = document.getElementById('p_' + f);
    if (el) el.value = f === 'status' ? 'planning' : f === 'priority' ? 'medium' : '';
  });
  document.getElementById('extraFields').innerHTML = '';
  document.getElementById('dbEntries').innerHTML = '';
  document.getElementById('btnDeleteProject').style.display = 'none';
  document.getElementById('projectModalTitle').textContent = 'Add Project';
}

function fillProjectForm(p) {
  editingProjectId = p._id;
  document.getElementById('p_id').value = p._id;
  PROJECT_FIELDS.forEach(f => {
    const el = document.getElementById('p_' + f);
    if (el) el.value = p[f] || (f === 'status' ? 'planning' : f === 'priority' ? 'medium' : '');
  });
  document.getElementById('extraFields').innerHTML = '';
  (p.extra_fields || []).forEach(f => addExtraFieldRow(f.label, f.value));
  document.getElementById('dbEntries').innerHTML = '';
  const dbs = p.databases || [];
  if (dbs.length) dbs.forEach(d => addDbRow(d)); else addDbRow();
  document.getElementById('btnDeleteProject').style.display = 'inline-block';
  document.getElementById('projectModalTitle').textContent = 'Edit Project';
}

function addExtraFieldRow(label = '', value = '') {
  const wrap = document.getElementById('extraFields');
  const row = document.createElement('div');
  row.className = 'extra-field-row';
  row.innerHTML = `
    <input placeholder="Label (e.g. Payment gateway)" class="ef-label" value="${escapeHtml(label)}" />
    <input placeholder="Value" class="ef-value" value="${escapeHtml(value)}" />
    <button type="button" class="secondary tiny">✕</button>
  `;
  row.querySelector('button').addEventListener('click', () => row.remove());
  wrap.appendChild(row);
}

function addDbRow(d = {}) {
  const wrap = document.getElementById('dbEntries');
  const row = document.createElement('div');
  row.className = 'db-entry-row';
  row.innerHTML = `
    <div class="row">
      <label>Label<input class="db-label" placeholder="e.g. main / analytics / auth" value="${escapeHtml(d.label || '')}" /></label>
      <label>Provider<input class="db-provider" placeholder="MongoDB Atlas / Firebase / Supabase..." value="${escapeHtml(d.provider || '')}" /></label>
      <label>Type<input class="db-type" placeholder="Mongo / Postgres / Firestore..." value="${escapeHtml(d.type || '')}" /></label>
      <label>Account email<input class="db-account" value="${escapeHtml(d.account_email || '')}" /></label>
    </div>
    <label>Notes<input class="db-notes" placeholder="cluster/instance name, where connection string lives (not the secret)" value="${escapeHtml(d.notes || '')}" /></label>
    <div class="db-entry-foot"><button type="button" class="secondary tiny">Remove database</button></div>
  `;
  row.querySelector('button').addEventListener('click', () => row.remove());
  wrap.appendChild(row);
}

document.getElementById('btnAddField').addEventListener('click', () => addExtraFieldRow());
document.getElementById('btnAddDb').addEventListener('click', () => addDbRow());
document.getElementById('btnNewProject').addEventListener('click', () => {
  resetProjectForm();
  addDbRow();
  openModal(document.getElementById('projectModal'));
});

document.getElementById('projectForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {};
  PROJECT_FIELDS.forEach(f => { body[f] = document.getElementById('p_' + f).value; });
  body.extra_fields = Array.from(document.querySelectorAll('#extraFields .extra-field-row')).map(row => ({
    label: row.querySelector('.ef-label').value,
    value: row.querySelector('.ef-value').value
  })).filter(f => f.label.trim());

  body.databases = Array.from(document.querySelectorAll('#dbEntries .db-entry-row')).map(row => ({
    label: row.querySelector('.db-label').value,
    provider: row.querySelector('.db-provider').value,
    type: row.querySelector('.db-type').value,
    account_email: row.querySelector('.db-account').value,
    notes: row.querySelector('.db-notes').value
  })).filter(d => d.provider.trim() || d.type.trim() || d.label.trim());

  const id = document.getElementById('p_id').value;
  const url = id ? `${API}/projects/${id}` : `${API}/projects`;
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) { const err = await res.json(); alert('Error: ' + err.error); return; }

  closeModal(document.getElementById('projectModal'));
  await loadProjects();
});

document.getElementById('btnDeleteProject').addEventListener('click', async () => {
  if (!editingProjectId) return;
  if (!confirm('Delete this project? This cannot be undone.')) return;
  await fetch(`${API}/projects/${editingProjectId}`, { method: 'DELETE' });
  closeModal(document.getElementById('projectModal'));
  await loadProjects();
});

// ---- Detail view ----
function openDetail(id) {
  const p = projects.find(x => x._id === id);
  if (!p) return;
  document.getElementById('detailTitle').textContent = p.name;

  const sections = [
    { title: 'Basics', items: [
      ['Status', STATUS_LABEL[p.status] || p.status], ['Priority', p.priority], ['Category', p.category],
      ['Tech stack', p.tech_stack], ['Tags', p.tags], ['Description', p.description]
    ]},
    { title: 'Repo & Live URL', items: [
      ['Repo URL', linkify(p.repo_url)], ['Repo account', p.repo_account],
      ['Live URL', linkify(p.live_url)], ['Custom domain', p.custom_domain]
    ]},
    { title: 'Hosting', items: [
      ['Provider', p.hosting_provider], ['Account email', p.hosting_account_email],
      ['Account label', p.hosting_account_label], ['Service name', p.hosting_service_name],
      ['Plan', p.hosting_plan], ['Region', p.hosting_region], ['Auto-deploy branch', p.auto_deploy_branch]
    ]},
    { title: 'Firebase / Google Cloud', items: [
      ['Firebase project ID', p.firebase_project_id], ['Firebase account email', p.firebase_account_email],
      ['Google Cloud project ID', p.google_cloud_project_id], ['Google Cloud account email', p.google_cloud_account_email]
    ]},
    { title: 'Play Store', items: [
      ['Package name', p.play_store_package_name], ['Play Console account email', p.play_store_account_email],
      ['Play Store URL', linkify(p.play_store_url)], ['Status', p.play_store_status]
    ]},
    { title: 'DNS', items: [
      ['Provider', p.dns_provider], ['Account email', p.dns_account_email]
    ]},
    { title: 'Environment variables', items: [
      ['Where they live', p.env_vars_location], ['Var names', p.env_var_names]
    ]},
    { title: 'Monitoring', items: [
      ['Provider', p.monitoring_provider], ['Account email', p.monitoring_account_email],
      ['Last deployed', p.last_deployed_at]
    ]},
  ];

  let html = '';

  if (p.databases && p.databases.length) {
    html += `<div class="detail-section"><h4>Databases (${p.databases.length})</h4><div class="detail-grid">`;
    p.databases.forEach(d => {
      const parts = [d.provider, d.type].filter(Boolean).join(' · ');
      html += `<div class="detail-item"><b>${escapeHtml(d.label || 'Database')}</b><span>${escapeHtml(parts)}${d.account_email ? ' — ' + escapeHtml(d.account_email) : ''}${d.notes ? '<br><small>' + escapeHtml(d.notes) + '</small>' : ''}</span></div>`;
    });
    html += `</div></div>`;
  }

  sections.forEach(sec => {
    const items = sec.items.filter(([, v]) => v);
    if (!items.length) return;
    html += `<div class="detail-section"><h4>${sec.title}</h4><div class="detail-grid">`;
    items.forEach(([label, value]) => {
      html += `<div class="detail-item"><b>${label}</b><span>${value}</span></div>`;
    });
    html += `</div></div>`;
  });

  if (p.notes) {
    html += `<div class="detail-section"><h4>Notes</h4><div class="detail-item"><span>${escapeHtml(p.notes)}</span></div></div>`;
  }

  if (p.extra_fields && p.extra_fields.length) {
    html += `<div class="detail-section"><h4>Custom fields</h4><div class="detail-grid">`;
    p.extra_fields.forEach(f => {
      html += `<div class="detail-item"><b>${escapeHtml(f.label)}</b><span>${escapeHtml(f.value)}</span></div>`;
    });
    html += `</div></div>`;
  }

  document.getElementById('detailBody').innerHTML = html || '<p style="color:var(--muted)">No details yet.</p>';
  document.getElementById('btnEditFromDetail').onclick = () => {
    closeModal(document.getElementById('detailOverlay'));
    fillProjectForm(p);
    openModal(document.getElementById('projectModal'));
  };
  openModal(document.getElementById('detailOverlay'));
}

function linkify(url) {
  if (!url) return '';
  const safe = escapeHtml(url);
  return `<a href="${safe}" target="_blank" rel="noopener">${safe}</a>`;
}

// =========================================================
// ACCOUNTS
// =========================================================
async function loadAccounts() {
  const res = await fetch(`${API}/accounts`);
  accounts = await res.json();
  renderAccounts();
}

function renderAccounts() {
  const q = document.getElementById('searchAccounts').value.trim().toLowerCase();
  const tbody = document.querySelector('#accountsTable tbody');
  tbody.innerHTML = '';
  const filtered = accounts.filter(a => !q || (a.service + ' ' + a.email).toLowerCase().includes(q));

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:var(--muted)">No accounts yet.</td></tr>`;
    return;
  }

  filtered.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(a.service)}</td>
      <td>${escapeHtml(a.email)}</td>
      <td>${escapeHtml(a.label)}</td>
      <td>${escapeHtml(a.plan)}</td>
      <td>${escapeHtml(a.notes)}</td>
      <td><button class="secondary tiny" data-edit="${a._id}">Edit</button></td>
    `;
    tr.querySelector('[data-edit]').addEventListener('click', () => {
      editingAccountId = a._id;
      document.getElementById('a_id').value = a._id;
      document.getElementById('a_service').value = a.service || '';
      document.getElementById('a_email').value = a.email || '';
      document.getElementById('a_label').value = a.label || '';
      document.getElementById('a_plan').value = a.plan || '';
      document.getElementById('a_notes').value = a.notes || '';
      document.getElementById('accountModalTitle').textContent = 'Edit Account';
      document.getElementById('btnDeleteAccount').style.display = 'inline-block';
      openModal(document.getElementById('accountModal'));
    });
    tbody.appendChild(tr);
  });
}

document.getElementById('searchAccounts').addEventListener('input', renderAccounts);
document.getElementById('btnNewAccount').addEventListener('click', () => {
  editingAccountId = null;
  document.getElementById('accountForm').reset();
  document.getElementById('a_id').value = '';
  document.getElementById('accountModalTitle').textContent = 'Add Account';
  document.getElementById('btnDeleteAccount').style.display = 'none';
  openModal(document.getElementById('accountModal'));
});

document.getElementById('accountForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    service: document.getElementById('a_service').value,
    email: document.getElementById('a_email').value,
    label: document.getElementById('a_label').value,
    plan: document.getElementById('a_plan').value,
    notes: document.getElementById('a_notes').value
  };
  const id = document.getElementById('a_id').value;
  const url = id ? `${API}/accounts/${id}` : `${API}/accounts`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) { const err = await res.json(); alert('Error: ' + err.error); return; }
  closeModal(document.getElementById('accountModal'));
  await loadAccounts();
});

document.getElementById('btnDeleteAccount').addEventListener('click', async () => {
  if (!editingAccountId) return;
  if (!confirm('Delete this account entry?')) return;
  await fetch(`${API}/accounts/${editingAccountId}`, { method: 'DELETE' });
  closeModal(document.getElementById('accountModal'));
  await loadAccounts();
});

// ---- init ----
loadProjects();
loadAccounts();

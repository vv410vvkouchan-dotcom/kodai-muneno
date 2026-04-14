const STORAGE_KEY = "basegym24_crm_leads";

const form = document.getElementById("leadForm");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEdit");
const filterSelect = document.getElementById("statusFilter");
const tableBody = document.getElementById("leadTableBody");
const emptyState = document.getElementById("emptyState");

const fields = {
  leadId: document.getElementById("leadId"),
  companyName: document.getElementById("companyName"),
  contactPerson: document.getElementById("contactPerson"),
  contactInfo: document.getElementById("contactInfo"),
  industry: document.getElementById("industry"),
  firstContactDate: document.getElementById("firstContactDate"),
  status: document.getElementById("status"),
  proposalTheme: document.getElementById("proposalTheme"),
  meetingDate: document.getElementById("meetingDate"),
  seminarDate: document.getElementById("seminarDate"),
  nextAction: document.getElementById("nextAction"),
  memo: document.getElementById("memo"),
};

function loadLeads() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLeads(leads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function clearForm() {
  form.reset();
  fields.leadId.value = "";
  formTitle.textContent = "案件登録";
  cancelEditBtn.hidden = true;
  fields.status.value = "未接触";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRows() {
  const leads = loadLeads();
  const filter = filterSelect.value;
  const filteredLeads = filter === "all" ? leads : leads.filter((lead) => lead.status === filter);

  tableBody.innerHTML = filteredLeads
    .map(
      (lead) => `
      <tr>
        <td>${escapeHtml(lead.companyName)}</td>
        <td>${escapeHtml(lead.contactPerson)}</td>
        <td>${escapeHtml(lead.contactInfo)}</td>
        <td>${escapeHtml(lead.industry)}</td>
        <td>${escapeHtml(lead.firstContactDate)}</td>
        <td><span class="tag">${escapeHtml(lead.status)}</span></td>
        <td>${escapeHtml(lead.proposalTheme)}</td>
        <td>${escapeHtml(lead.meetingDate)}</td>
        <td>${escapeHtml(lead.seminarDate)}</td>
        <td>${escapeHtml(lead.nextAction)}</td>
        <td>${escapeHtml(lead.memo)}</td>
        <td>
          <div class="row-actions">
            <button class="secondary" data-action="edit" data-id="${lead.id}">編集</button>
            <button class="danger" data-action="delete" data-id="${lead.id}">削除</button>
          </div>
        </td>
      </tr>
    `,
    )
    .join("");

  const shouldShowEmpty = filteredLeads.length === 0;
  emptyState.hidden = !shouldShowEmpty;
}

function getFormPayload() {
  return {
    id: fields.leadId.value || crypto.randomUUID(),
    companyName: fields.companyName.value.trim(),
    contactPerson: fields.contactPerson.value.trim(),
    contactInfo: fields.contactInfo.value.trim(),
    industry: fields.industry.value.trim(),
    firstContactDate: fields.firstContactDate.value,
    status: fields.status.value,
    proposalTheme: fields.proposalTheme.value.trim(),
    meetingDate: fields.meetingDate.value,
    seminarDate: fields.seminarDate.value,
    nextAction: fields.nextAction.value.trim(),
    memo: fields.memo.value.trim(),
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = getFormPayload();
  const leads = loadLeads();
  const existingIndex = leads.findIndex((lead) => lead.id === payload.id);

  if (existingIndex >= 0) {
    leads[existingIndex] = payload;
  } else {
    leads.unshift(payload);
  }

  saveLeads(leads);
  clearForm();
  renderRows();
});

cancelEditBtn.addEventListener("click", () => {
  clearForm();
});

filterSelect.addEventListener("change", renderRows);

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, id } = button.dataset;
  const leads = loadLeads();

  if (action === "delete") {
    const confirmed = window.confirm("この案件を削除しますか？");
    if (!confirmed) return;
    const nextLeads = leads.filter((lead) => lead.id !== id);
    saveLeads(nextLeads);
    renderRows();
    return;
  }

  if (action === "edit") {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;

    Object.entries(fields).forEach(([key, element]) => {
      element.value = lead[key] ?? "";
    });

    formTitle.textContent = "案件編集";
    cancelEditBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

clearForm();
renderRows();

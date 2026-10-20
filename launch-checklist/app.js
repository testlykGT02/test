const STORAGE_KEY = "team-launch-checklist-v1";

const DEFAULT_SECTIONS = [
  {
    id: "planning",
    title: "Planning",
    items: [
      "Define launch goals and success metrics",
      "Confirm launch date and timeline",
      "Assign owners for each workstream",
      "Identify risks and mitigation plan",
    ],
  },
  {
    id: "content",
    title: "Content",
    items: [
      "Write announcement blog post",
      "Prepare social media posts",
      "Update product documentation",
      "Create screenshots and demo assets",
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    items: [
      "Product sign-off",
      "Legal and compliance review",
      "Marketing copy approval",
      "Executive go/no-go decision",
    ],
  },
  {
    id: "launch-day",
    title: "Launch Day",
    items: [
      "Deploy release to production",
      "Publish announcement and social posts",
      "Monitor metrics and support channels",
      "Share launch recap with the team",
    ],
  },
];

let nextId = 1;

function createItem(text, done = false) {
  return { id: `item-${Date.now()}-${nextId++}`, text, done };
}

function defaultState() {
  return DEFAULT_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items.map((text) => createItem(text)),
  }));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // Ignore unreadable saved data and fall back to defaults.
  }
  return defaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (e.g. some private browsing modes); the app still works for this visit.
  }
}

let state = loadState();

const sectionsEl = document.querySelector("#sections");
const template = document.querySelector("#sectionTemplate");
const overallText = document.querySelector("#overallText");
const overallBar = document.querySelector("#overallBar");

function percent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function renderItem(section, item) {
  const li = document.createElement("li");
  li.className = item.done ? "item done" : "item";

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.done;
  checkbox.addEventListener("change", () => {
    item.done = checkbox.checked;
    update();
  });

  const text = document.createElement("span");
  text.textContent = item.text;
  label.append(checkbox, text);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "link";
  remove.textContent = "×";
  remove.setAttribute("aria-label", `Remove "${item.text}"`);
  remove.addEventListener("click", () => {
    section.items = section.items.filter((other) => other.id !== item.id);
    update();
  });

  li.append(label, remove);
  return li;
}

function render() {
  sectionsEl.replaceChildren();
  let totalDone = 0;
  let total = 0;

  for (const section of state) {
    const node = template.content.firstElementChild.cloneNode(true);
    const done = section.items.filter((item) => item.done).length;
    totalDone += done;
    total += section.items.length;

    node.dataset.section = section.id;
    node.querySelector(".section-title").textContent = section.title;
    node.querySelector(".section-count").textContent = `${done} / ${section.items.length}`;
    node.querySelector(".bar-fill").style.width = `${percent(done, section.items.length)}%`;
    node.querySelector(".items").append(...section.items.map((item) => renderItem(section, item)));

    const input = node.querySelector(".add-input");
    node.querySelector(".add-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      section.items.push(createItem(text));
      update();
      sectionsEl.querySelector(`[data-section="${section.id}"] .add-input`).focus();
    });

    sectionsEl.append(node);
  }

  overallText.textContent = `${totalDone} / ${total} (${percent(totalDone, total)}%)`;
  overallBar.style.width = `${percent(totalDone, total)}%`;
}

function update() {
  saveState();
  render();
}

document.querySelector("#resetButton").addEventListener("click", () => {
  if (confirm("Reset the checklist to the default tasks? This clears your progress.")) {
    state = defaultState();
    update();
  }
});

render();

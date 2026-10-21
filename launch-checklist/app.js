const STORAGE_KEY = "team-launch-checklist-v1";

const DEFAULT_SECTIONS = [
  {
    id: "planning",
    title: "Planning",
    items: [
      "Define launch goals and success metrics",
      "Confirm target audience",
      "Set launch date and timeline",
      "Assign owners for each workstream",
    ],
  },
  {
    id: "content",
    title: "Content",
    items: [
      "Write announcement blog post",
      "Prepare social media posts",
      "Update product docs and FAQ",
      "Create screenshots and demo video",
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    items: [
      "Legal review",
      "Security and privacy sign-off",
      "Leadership approval",
      "Final go/no-go decision",
    ],
  },
  {
    id: "launch-day",
    title: "Launch Day",
    items: [
      "Ship release to production",
      "Publish announcement and social posts",
      "Notify customers and support team",
      "Monitor metrics and feedback",
    ],
  },
];

function createDefaultState() {
  return DEFAULT_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items.map((text, index) => ({ id: `${section.id}-${index}`, text, done: false })),
  }));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // Fall back to defaults when storage is unavailable or corrupted.
  }
  return createDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be blocked (e.g. some file:// contexts); the app still works for the session.
  }
}

let state = loadState();

const sectionsEl = document.querySelector("#sections");
const overallText = document.querySelector("#overallText");
const overallBar = document.querySelector("#overallBar");
const resetButton = document.querySelector("#resetButton");

function percent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  children.forEach((child) => node.append(child));
  return node;
}

function render() {
  sectionsEl.replaceChildren();
  let totalDone = 0;
  let total = 0;

  state.forEach((section) => {
    const done = section.items.filter((item) => item.done).length;
    totalDone += done;
    total += section.items.length;

    const list = el("ul");
    section.items.forEach((item) => {
      const checkboxId = `item-${item.id}`;
      const checkbox = el("input", { type: "checkbox", id: checkboxId, checked: item.done });
      checkbox.addEventListener("change", () => {
        item.done = checkbox.checked;
        saveState();
        render();
      });

      const remove = el("button", { type: "button", className: "link", textContent: "✕", title: "Remove item" });
      remove.setAttribute("aria-label", `Remove "${item.text}"`);
      remove.addEventListener("click", () => {
        section.items = section.items.filter((other) => other.id !== item.id);
        saveState();
        render();
      });

      const label = el("label", { htmlFor: checkboxId, textContent: item.text });
      list.append(el("li", { className: item.done ? "done" : "" }, [checkbox, label, remove]));
    });

    const input = el("input", { type: "text", placeholder: "Add a task…", required: true });
    input.setAttribute("aria-label", `Add a task to ${section.title}`);
    const form = el("form", { className: "add-form" }, [input, el("button", { type: "submit", textContent: "Add" })]);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      section.items.push({ id: `${section.id}-${Date.now()}`, text, done: false });
      saveState();
      render();
    });

    const bar = el("div", { className: "bar" }, [el("div", { className: "bar-fill" })]);
    bar.firstChild.style.width = `${percent(done, section.items.length)}%`;

    sectionsEl.append(
      el("section", { className: "section" }, [
        el("div", { className: "section-header" }, [
          el("h2", { textContent: section.title }),
          el("span", { className: "count", textContent: `${done}/${section.items.length}` }),
        ]),
        bar,
        list,
        form,
      ])
    );
  });

  overallText.textContent = `${totalDone} of ${total} done (${percent(totalDone, total)}%)`;
  overallBar.style.width = `${percent(totalDone, total)}%`;
}

resetButton.addEventListener("click", () => {
  if (!confirm("Reset the checklist to the default tasks? This clears your progress.")) return;
  state = createDefaultState();
  saveState();
  render();
});

render();

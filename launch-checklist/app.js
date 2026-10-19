const STORAGE_KEY = "team-launch-checklist-v1";

const checklist = [
  {
    id: "planning",
    title: "Planning",
    tasks: [
      { id: "planning-goals", label: "Agree on launch goals and success metrics" },
      { id: "planning-audience", label: "Define target audience and key message" },
      { id: "planning-timeline", label: "Lock the launch date and milestone timeline" },
      { id: "planning-owners", label: "Assign an owner for each workstream" },
      { id: "planning-risks", label: "List top risks and mitigation plans" },
    ],
  },
  {
    id: "content",
    title: "Content",
    tasks: [
      { id: "content-announcement", label: "Draft the announcement post" },
      { id: "content-docs", label: "Update product docs and help center articles" },
      { id: "content-demo", label: "Record demo video or screenshots" },
      { id: "content-faq", label: "Write customer FAQ and support macros" },
      { id: "content-social", label: "Prepare social and email copy" },
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    tasks: [
      { id: "approvals-legal", label: "Legal review of claims and naming" },
      { id: "approvals-brand", label: "Brand and design sign-off on assets" },
      { id: "approvals-security", label: "Security and privacy review complete" },
      { id: "approvals-exec", label: "Executive sponsor approves go/no-go" },
      { id: "approvals-pricing", label: "Pricing and packaging confirmed" },
    ],
  },
  {
    id: "launch-day",
    title: "Launch day",
    tasks: [
      { id: "launch-deploy", label: "Ship the release and verify in production" },
      { id: "launch-publish", label: "Publish announcement, docs, and social posts" },
      { id: "launch-support", label: "Support and on-call rotation staffed" },
      { id: "launch-monitor", label: "Monitor dashboards, errors, and feedback" },
      { id: "launch-retro", label: "Schedule the post-launch retro" },
    ],
  },
];

const sectionsEl = document.querySelector("#sections");
const statusFilter = document.querySelector("#statusFilter");
const resetButton = document.querySelector("#resetButton");
const progressFill = document.querySelector("#progressFill");
const progressLabel = document.querySelector("#progressLabel");

const allTaskIds = new Set(checklist.flatMap((section) => section.tasks.map((task) => task.id)));

function loadCompleted() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => allTaskIds.has(id)) : []);
  } catch (error) {
    // Storage can be unavailable (private mode, blocked file:// access); fall back to memory only.
    return new Set();
  }
}

function saveCompleted() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch (error) {
    /* ignore persistence failures */
  }
}

let completed = loadCompleted();

function matchesFilter(taskId) {
  const filter = statusFilter.value;
  if (filter === "open") return !completed.has(taskId);
  if (filter === "done") return completed.has(taskId);
  return true;
}

function renderProgress() {
  const total = allTaskIds.size;
  const done = [...completed].length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = `${percent}%`;
  progressLabel.textContent = `${done} of ${total} tasks complete (${percent}%)`;
}

function createTaskItem(task) {
  const item = document.createElement("li");
  item.className = completed.has(task.id) ? "task done" : "task";

  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed.has(task.id);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      completed.add(task.id);
    } else {
      completed.delete(task.id);
    }
    saveCompleted();
    render();
  });

  const text = document.createElement("span");
  text.textContent = task.label;

  label.append(checkbox, text);
  item.append(label);
  return item;
}

function createSection(section) {
  const wrapper = document.createElement("section");
  wrapper.className = "section";

  const header = document.createElement("div");
  header.className = "section-header";

  const heading = document.createElement("h2");
  heading.textContent = section.title;

  const count = document.createElement("span");
  count.className = "meta";
  const doneInSection = section.tasks.filter((task) => completed.has(task.id)).length;
  count.textContent = `${doneInSection}/${section.tasks.length}`;

  header.append(heading, count);
  wrapper.append(header);

  const visibleTasks = section.tasks.filter((task) => matchesFilter(task.id));
  if (visibleTasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No tasks match this filter.";
    wrapper.append(empty);
    return wrapper;
  }

  const list = document.createElement("ul");
  list.className = "tasks";
  visibleTasks.forEach((task) => list.append(createTaskItem(task)));
  wrapper.append(list);
  return wrapper;
}

function render() {
  sectionsEl.replaceChildren(...checklist.map(createSection));
  renderProgress();
}

statusFilter.addEventListener("change", render);

resetButton.addEventListener("click", () => {
  completed = new Set();
  saveCompleted();
  render();
});

render();

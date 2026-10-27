const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const cards = document.querySelector("#cards");
const filters = {
  priority: priorityFilter.value,
  status: statusFilter.value,
};

function render() {
  const visible = requests.filter((item) => {
    const matchesPriority = filters.priority === "all" || item.priority === filters.priority;
    const matchesStatus = filters.status === "all" || item.status === filters.status;
    return matchesPriority && matchesStatus;
  });

  cards.innerHTML = visible.length
    ? visible.map((item) => `
      <article class="card">
        <h2>${item.id}</h2>
        <p>${item.title}</p>
        <p class="meta">Priority: ${item.priority}</p>
        <p class="meta">Status: ${item.status}</p>
        <p class="meta">Owner: ${item.owner}</p>
      </article>
    `).join("")
    : '<p class="empty-state">No feature requests match the selected filters.</p>';
}

priorityFilter.addEventListener("change", (event) => {
  filters.priority = event.target.value;
  render();
});

statusFilter.addEventListener("change", (event) => {
  filters.status = event.target.value;
  render();
});

render();

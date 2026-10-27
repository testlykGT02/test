const storageKey = "team-launch-checklist";
const checkboxes = [...document.querySelectorAll("[data-task-id]")];
const progressBar = document.querySelector("#progressBar");
const progressTrack = document.querySelector(".progress-track");
const progressText = document.querySelector("#progressText");
const resetButton = document.querySelector("#resetButton");

function getSavedTasks() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveTasks() {
  const taskState = Object.fromEntries(
    checkboxes.map((checkbox) => [checkbox.dataset.taskId, checkbox.checked]),
  );
  localStorage.setItem(storageKey, JSON.stringify(taskState));
}

function updateProgress() {
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percentage = Math.round((completed / checkboxes.length) * 100);
  const taskLabel = completed === 1 ? "task" : "tasks";

  progressBar.style.width = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", completed);
  progressText.textContent = `${completed} of ${checkboxes.length} ${taskLabel} complete`;
}

function restoreTasks() {
  const savedTasks = getSavedTasks();
  checkboxes.forEach((checkbox) => {
    checkbox.checked = Boolean(savedTasks[checkbox.dataset.taskId]);
  });
  updateProgress();
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    saveTasks();
    updateProgress();
  });
});

resetButton.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  localStorage.removeItem(storageKey);
  updateProgress();
});

restoreTasks();

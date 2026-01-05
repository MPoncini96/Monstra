const KEY = "monstra_state_v1";

function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

function saveAll(all) {
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getMonsterState(id) {
  const all = loadAll();
  if (!all[id]) {
    all[id] = {
      stage: 1,
      active: false,
      startCapital: 1000,
      currentCapital: 1000,
      resolved: false,
      lastOutcome: null
    };
    saveAll(all);
  }
  return all[id];
}

export function setMonsterState(id, next) {
  const all = loadAll();
  all[id] = next;
  saveAll(all);
}

export function resetMonsterState(id) {
  const all = loadAll();
  delete all[id];
  saveAll(all);
}

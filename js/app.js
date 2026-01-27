import { getMonsterState, setMonsterState, resetMonsterState } from "./state.js";
import { simulateOnce } from "./sim.js";

async function loadMonsters() {
  const res = await fetch("../data/monsters.json");
  return res.json();
}

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function clampStage(stage, maxStage) {
  return Math.max(1, Math.min(stage, maxStage));
}

function render(monster, state) {
  const maxStage = monster.stages.length;
  const stage = clampStage(state.stage, maxStage);
  const img = monster.stages.find(s => s.stage === stage)?.img ?? monster.stages[0].img;

  document.getElementById("monsterName").textContent = monster.name;
  document.getElementById("monsterImg").src = `../${img}`;
  document.getElementById("monsterStrategy").textContent = monster.strategy;

  document.getElementById("stage").textContent = String(stage);
  document.getElementById("active").textContent = state.active ? "Yes" : "No";
  document.getElementById("capital").textContent = `$${state.currentCapital.toFixed(2)}`;
  document.getElementById("lastOutcome").textContent = state.lastOutcome ?? "-";

  // Button states
  document.getElementById("activateBtn").disabled = state.active;
  document.getElementById("simulateBtn").disabled = !state.active;
}

function bind(monster, state) {
  const id = monster.id;

  document.getElementById("activateBtn").onclick = () => {
    const s = getMonsterState(id);
    if (s.active) return;
    s.active = true;
    s.resolved = false;
    s.lastOutcome = null;
    setMonsterState(id, s);
    render(monster, s);
  };

  document.getElementById("simulateBtn").onclick = () => {
    const s = getMonsterState(id);
    if (!s.active) return;

    const result = simulateOnce(); // win/loss once
    s.currentCapital = s.currentCapital * result.multiplier;
    s.lastOutcome = result.outcome;

    // resolve session
    s.active = false;
    s.resolved = true;

    // evolve on win
    if (result.outcome === "win") {
      s.stage = Math.min(s.stage + 1, monster.stages.length);
    }

    setMonsterState(id, s);
    render(monster, s);
  };

  document.getElementById("resetBtn").onclick = () => {
    resetMonsterState(id);
    const s = getMonsterState(id);
    render(monster, s);
  };
}

(async function main() {
  const monsters = await loadMonsters();
  const id = getIdFromQuery();
  const monster = monsters.find(m => m.id === id);

  if (!monster) {
    document.body.innerHTML = `<p>Monster not found. <a href="./index.html">Back</a></p>`;
    return;
  }

  const state = getMonsterState(monster.id);
  render(monster, state);
  bind(monster, state);
})();

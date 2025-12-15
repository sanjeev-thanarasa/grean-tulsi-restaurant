/* Grean Tulsi landing - no frameworks */

const CONFIG = {
  whatsappNumber: "94775515510", // TODO: change if needed (country code + number, no +)
  callNumber1: "94262228578",
  callNumber2: "94775515510",
  callNumber3: "94772269504",
  hoursText: "10:00 AM – 10:00 PM (Daily)",
};

function waLink(number, message) {
  const msg = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${msg}`;
}

function telLink(number) {
  return `tel:+${number}`;
}

function moneyLKR(value) {
  // Menu PDF shows 2 decimals, but display clean LKR
  const n = Math.round(Number(value));
  return `LKR ${n.toLocaleString("en-US")}`;
}

function $(id){ return document.getElementById(id); }

function setLinks() {
  const msg = "Hi Grean Tulsi! I want to order.\n\nItems: (type here)\nQuantity: \nName: \nDelivery/Pickup: \nLocation: ";
  const wa = waLink(CONFIG.whatsappNumber, msg);

  const waEls = ["btnWhatsAppTop","btnWhatsAppHero","btnWhatsAppInfo","btnWhatsAppSticky"].map($);
  waEls.forEach(el => { if(el){ el.href = wa; } });

  const callEls = ["btnCallTop","btnCallHero","btnCallSticky"].map($);
  callEls.forEach(el => { if(el){ el.href = telLink(CONFIG.callNumber2); } });

  $("telLink1").href = telLink(CONFIG.callNumber1);
  $("telLink2").href = telLink(CONFIG.callNumber2);
  $("telLink3").href = telLink(CONFIG.callNumber3);

  $("hotlineText").textContent = "0" + CONFIG.callNumber2.slice(-9);
  $("hoursText").textContent = CONFIG.hoursText;
}

let MENU = [];
let activeSection = "All";

function uniq(arr){ return [...new Set(arr)]; }

function buildChips(sections) {
  const wrap = $("chips");
  wrap.innerHTML = "";

  const all = document.createElement("div");
  all.className = "chip isActive";
  all.textContent = "All";
  all.onclick = () => { activeSection = "All"; updateChips(); renderMenu(); };
  wrap.appendChild(all);

  sections.forEach(sec => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = sec;
    chip.onclick = () => { activeSection = sec; updateChips(); renderMenu(); };
    wrap.appendChild(chip);
  });
}

function updateChips() {
  const chips = Array.from(document.querySelectorAll(".chip"));
  chips.forEach(c => c.classList.remove("isActive"));
  chips.forEach(c => {
    if ((activeSection === "All" && c.textContent === "All") || c.textContent === activeSection) {
      c.classList.add("isActive");
    }
  });
}

function groupBySection(items) {
  const map = new Map();
  items.forEach(it => {
    const sec = it.section || "Menu";
    if (!map.has(sec)) map.set(sec, []);
    map.get(sec).push(it);
  });
  // keep original insertion order
  return map;
}

function renderMenu() {
  const q = $("searchInput").value.trim().toLowerCase();

  let items = MENU;
  if (activeSection !== "All") {
    items = items.filter(i => i.section === activeSection);
  }
  if (q) {
    items = items.filter(i => i.item.toLowerCase().includes(q));
  }

  $("menuMeta").textContent = `${items.length} items • ${activeSection === "All" ? "All categories" : activeSection}${q ? ` • Search: "${q}"` : ""}`;

  const grouped = groupBySection(items);
  const wrap = $("menuWrap");
  wrap.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "note";
    empty.textContent = "No items match your search.";
    wrap.appendChild(empty);
    return;
  }

  for (const [sec, secItems] of grouped.entries()) {
    const block = document.createElement("div");
    block.className = "sectionBlock";

    const head = document.createElement("div");
    head.className = "sectionBlock__head";
    head.innerHTML = `<h3>${sec}</h3><div class="sectionBlock__count">${secItems.length} items</div>`;
    head.onclick = () => block.classList.toggle("isOpen");

    const body = document.createElement("div");
    body.className = "sectionBlock__body";

    secItems.forEach(it => {
      const row = document.createElement("div");
      row.className = "itemRow";
      row.innerHTML = `<div class="itemRow__name">${escapeHtml(it.item)}</div><div class="itemRow__price">${moneyLKR(it.price)}</div>`;
      body.appendChild(row);
    });

    block.appendChild(head);
    block.appendChild(body);

    // auto-open if user is searching or filtered into one section
    if (q || activeSection !== "All") block.classList.add("isOpen");

    wrap.appendChild(block);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function initMenu() {
  try {
    if (Array.isArray(window.MENU_DATA)) {
      MENU = window.MENU_DATA;
    } else {
      const res = await fetch("assets/menu.json", { cache: "no-store" });
      MENU = await res.json();
    }

    const sections = uniq(MENU.map(m => m.section)).sort((a,b) => a.localeCompare(b));
    buildChips(sections);

    renderMenu();
  } catch (e) {
    console.error(e);
    $("menuMeta").textContent = "Failed to load menu data. Make sure assets/menu-data.js or assets/menu.json exists.";
  }
}

function initSearch() {
  const input = $("searchInput");
  input.addEventListener("input", () => renderMenu());
}

setLinks();
initSearch();
initMenu();

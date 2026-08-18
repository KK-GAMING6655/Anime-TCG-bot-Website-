/* ============================================================
   ANIME TCG — site behaviour
   ============================================================ */

/* ---------- slide-in menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const menuPanel  = document.getElementById('menuPanel');
const menuScrim  = document.getElementById('menuScrim');

function openMenu(){
  menuPanel.classList.add('active');
  menuScrim.classList.add('active');
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuPanel.setAttribute('aria-hidden', 'false');
}
function closeMenu(){
  menuPanel.classList.remove('active');
  menuScrim.classList.remove('active');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuPanel.setAttribute('aria-hidden', 'true');
}
menuToggle.addEventListener('click', () => {
  menuPanel.classList.contains('active') ? closeMenu() : openMenu();
});
menuScrim.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ---------- view switching (home <-> commands) ---------- */
const viewHome     = document.getElementById('view-home');
const viewCommands = document.getElementById('view-commands');
const backBtn      = document.getElementById('backBtn');

function showView(name){
  if (name === 'commands'){
    viewHome.hidden = true;
    viewCommands.hidden = false;
  } else {
    viewCommands.hidden = true;
    viewHome.hidden = false;
  }
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  closeMenu();
}

document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showView(el.getAttribute('data-view'));
  });
});
backBtn.addEventListener('click', () => showView('home'));

/* ---------- holo card cursor tilt ---------- */
const holoCard = document.getElementById('holoCard');
const stage = document.querySelector('.hero-stage');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (stage && holoCard && !reduceMotion){
  stage.addEventListener('mousemove', e => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    holoCard.style.transform = `rotateY(${x * 18}deg) rotateX(${y * -18}deg) translateZ(10px)`;
  });
  stage.addEventListener('mouseleave', () => {
    holoCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/* ---------- scroll reveal for binder slots ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

/* ---------- commands data (mirrors the bot's /help command) ---------- */
const COMMANDS = [
  {
    group: "Economy & Basics",
    items: [
      ["/balance [user]", "Check your (or another user's) coin balance."],
      ["/beg", "Ask for coins. 30 minute cooldown."],
      ["/daily", "Claim your daily coins. Resets at midnight."],
      ["/account", "Set your profile to Public or Private."],
      ["/rank", "Check your collection points and rank."],
      ["/burn", "Burn a card to receive 50% of its value in coins."],
      ["/bulk_burn", "Burn multiple cards at once, filtered by rarity and anime."],
      ["/cointoss", "Bet your coins on a heads-or-tails coin flip."],
    ]
  },
  {
    group: "Gacha & Collecting",
    items: [
      ["/gacha", "Spend coins to pull a random card."],
      ["/bulk_gacha", "Pull multiple cards at once, sorted by rarity."],
      ["/inventory [user]", "View a collection with sorting and filters."],
      ["/card_list", "Browse every card in the bot with sorting and filters."],
      ["/view_card", "Inspect a specific card's details and image."],
      ["/rarity_list", "View all card rarities and their drop chances."],
      ["/crate", "Open one of your crates from a select menu."],
      ["/level", "Check your level and XP progress as an image."],
    ]
  },
  {
    group: "Social & Trading",
    items: [
      ["/gift_card", "Give a card to another player, free of charge."],
      ["/gift_coin", "Give coins to another player."],
      ["/trade", "Trade cards directly with another player."],
    ]
  },
  {
    group: "Market & Leaderboards",
    items: [
      ["/market", "Browse cards currently for sale."],
      ["/market_sell", "List one of your cards for sale."],
      ["/remove_market", "Cancel your own market listing."],
      ["/leaderboard", "View the Balance, Card, or Level leaderboard as an image."],
    ]
  },
  {
    group: "Getting Started",
    items: [
      ["/help", "List all available commands and how to play."],
    ]
  }
];

const cmdGroupsEl = document.getElementById('cmdGroups');
if (cmdGroupsEl){
  COMMANDS.forEach(section => {
    const groupEl = document.createElement('div');
    groupEl.className = 'cmd-group';

    const title = document.createElement('div');
    title.className = 'cmd-group-title';
    title.textContent = section.group;
    groupEl.appendChild(title);

    section.items.forEach(([name, desc]) => {
      const row = document.createElement('div');
      row.className = 'cmd-row';
      row.innerHTML = `<span class="cmd-name">${name}</span><span class="cmd-desc">${desc}</span>`;
      groupEl.appendChild(row);
    });

    cmdGroupsEl.appendChild(groupEl);
  });
}

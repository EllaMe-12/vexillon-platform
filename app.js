/* ══════════════════════════════════════════════════════
   VEXILLON — Application State & Sequencing Layer
   ══════════════════════════════════════════════════════ */

'use strict';

const SYSTEM_VALID_ACCOUNTS = {
  "operator@vexillon.ai": "VEX2026",
  "name@work.edu": "PASSWORD123"
};

const API_URL = 'https://vexillon-platform.onrender.com';

const S = {
  cart: [],
  cartDuration: 3,
  region: 'IN',
  authenticatedUser: null,
  activeTelemetryChart: null
};

// BOT 02 ADJUSTED AND LOGICALLY VALUED HIGHER THAN BOT 03 AS REQUESTED
const ENGINES = [
  { name: 'The Email & Draft Assistant ✉️', baseRates: { IN: 1499, US: 19, GB: 15, EU: 18, JP: 2800 }, tag: 'Bot 01 · Automated Messaging', desc: 'Reads incoming emails safely and writes accurate draft replies for you automatically.', caps: ['Reads and organizes messages', 'Prepares personalized drafts'] },
  { name: 'The Autonomous Meeting Representative 📝', baseRates: { IN: 2499, US: 35, GB: 29, EU: 32, JP: 4500 }, tag: 'Bot 02 · Full Attendance Coverage', desc: 'Joins active video conference interfaces autonomously on your behalf, recording accurate summaries and detailed task listings.', caps: ['Attends live virtual meeting rooms', 'Assembles actionable file transcripts'] },
  { name: 'The Voice Task Multitasker 🎙️', baseRates: { IN: 1999, US: 25, GB: 20, EU: 22, JP: 3800 }, tag: 'Bot 03 · Audio To-Dos', desc: 'Converts quick spoken voice notes on your phone straight into organized checklist items.', caps: ['Saves quick audio thoughts', 'Builds step-by-step checklists'] }
];

const REGIONS = {
  IN: { code: 'INR', sym: '₹' },
  US: { code: 'USD', sym: '$' },
  GB: { code: 'GBP', sym: '£' },
  EU: { code: 'EUR', sym: '€' },
  JP: { code: 'JPY', sym: '¥' }
};

/* ── SMOOTH ELASTIC MOUSE MATRIX TRAIL DRIVER ── */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if(dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
});

(function animTrailRing() {
  rx += (mx - rx) * 0.08; // Retained lag index creates custom fluid momentum
  ry += (my - ry) * 0.08;
  if(ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animTrailRing);
})();

/* ── LIGHT / DARK HARDENED SWITCH DESIGN ── */
function initThemeEngine() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('vexillon-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  toggleBtn.textContent = savedTheme === 'light' ? '☀' : '☾';

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('vexillon-theme', targetTheme);
    toggleBtn.textContent = targetTheme === 'light' ? '☀' : '☾';
  });
}

/* ── CINEMATIC INITIAL SEQUENCE ── */
function triggerCinematicIntroSequence() {
  const tl = gsap.timeline();
  tl.to('.intro-brand-text', { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" });
  tl.to('.left-wing', { x: '-160%', rotation: 12, opacity: 0, duration: 1.2, ease: "power3.inOut" }, "-=0.5");
  tl.to('.right-wing', { x: '160%', rotation: -12, opacity: 0, duration: 1.2, ease: "power3.inOut" }, "-=1.2");
  tl.to('.intro-brand-text', { letterSpacing: "0.5em", opacity: 0, scale: 1.04, filter: "blur(6px)", duration: 0.9, ease: "power3.in" }, "-=0.8");
  tl.to('#intro-portal', { opacity: 0, duration: 0.5, onComplete: () => {
    document.getElementById('intro-portal').style.display = 'none';
  }});
  tl.to('#main-public-room', { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4");
}

/* ── DUAL TERMINAL TRANSITIONS ── */
const publicRoom = document.getElementById('main-public-room');
const terminalRoom = document.getElementById('authenticated-terminal-room');
const terminalTrigger = document.getElementById('nav-terminal-trigger');
const terminalDisconnect = document.getElementById('terminal-disconnect-btn');

if (terminalTrigger) {
  terminalTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to(publicRoom, { opacity: 0, duration: 0.4, onComplete: () => {
      publicRoom.style.display = 'none';
      terminalRoom.style.display = 'block';
      gsap.to(terminalRoom, { opacity: 1, duration: 0.5 });
      if (!S.authenticatedUser) {
        document.getElementById('terminal-auth-checkpoint').style.display = 'block';
        document.getElementById('terminal-workspace-view').style.display = 'none';
      }
    }});
  });
}

if (terminalDisconnect) {
  terminalDisconnect.addEventListener('click', () => {
    gsap.to(terminalRoom, { opacity: 0, duration: 0.4, onComplete: () => {
      terminalRoom.style.display = 'none';
      publicRoom.style.display = 'block';
      gsap.to(publicRoom, { opacity: 1, duration: 0.5 });
    }});
  });
}

/* ── TERMINAL LOGIC AUTHENTICATION ── */
/* ── UPDATED AUTH LAYER WITH CORRESPONDING KEYBOARD TRIGGERS ── */
/* ── PERSISTENT SECURE AUTHENTICATION LOOP ── */
window.attemptTerminalAuthentication = async function() {
  const emailInput = document.getElementById('term-uid-input');
  const pwdInput = document.getElementById('term-pwd-input');
  
  if (!emailInput || !pwdInput) return;

  const email = emailInput.value.trim();
  const password = pwdInput.value.trim();

  if (!email || !password) return alert("Please fill in all security credentials.");

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Authentication failed.");
    }

    // Persist session to local storage browser matrix
    localStorage.setItem('vexillon_session', JSON.stringify(data.user));
    S.authenticatedUser = data.user;

    // Execute transitions smoothly using your GSAP config
    document.getElementById('terminal-operator-badge').innerText = `Operator: ${data.user.name}`;
    
    gsap.to('#terminal-auth-checkpoint', { opacity: 0, duration: 0.3, onComplete: () => {
      document.getElementById('terminal-auth-checkpoint').style.display = 'none';
      document.getElementById('terminal-workspace-view').style.display = 'block';
      gsap.to('#terminal-workspace-view', { opacity: 1, duration: 0.4 });
      renderTerminalWorkspaceEngines();
      initializeTelemetryChartCanvas();
    }});

  } catch (error) {
    console.error('[Login Connection Error]:', error);
    alert(error.message);
  }
};

/* ── SESSION RESTORATION CHECK (Paste this at the bottom of app.js) ── */
window.addEventListener('DOMContentLoaded', () => {
  const cachedSession = localStorage.getItem('vexillon_session');
  if (cachedSession) {
    const userData = JSON.parse(cachedSession);
    S.authenticatedUser = userData;
    
    const badge = document.getElementById('terminal-operator-badge');
    if (badge) badge.innerText = `Operator: ${userData.name}`;
    
    const checkpoint = document.getElementById('terminal-auth-checkpoint');
    const workspace = document.getElementById('terminal-workspace-view');
    
    if (checkpoint && workspace) {
      checkpoint.style.display = 'none';
      workspace.style.display = 'block';
      workspace.style.opacity = 1;
      renderTerminalWorkspaceEngines();
      setTimeout(() => initializeTelemetryChartCanvas(), 100);
    }
  }
});
// Attach listeners to login inputs so hitting Enter immediately signs you in
document.getElementById('term-uid-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') attemptTerminalAuthentication();
});
document.getElementById('term-pwd-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') attemptTerminalAuthentication();
});

/* ── UPDATED COMPONENT WITH LIVE INTERACTION LOOP ── */
function renderTerminalWorkspaceEngines() {
  const grid = document.getElementById('terminal-allocated-engines-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ENGINES.forEach((eng, idx) => {
    const isOwned = S.authenticatedUser.ownedEngines.includes(idx);
    
    // Map indices to the exact routes we set up on your backend
    const routeMap = { 0: 'email', 1: 'notes', 2: 'voice' };
    const targetRoute = routeMap[idx];

    grid.innerHTML += `
      <div style="background: var(--surface); border: 1px solid ${isOwned ? 'var(--border-acc)' : 'var(--border)'}; padding: 2.5rem; opacity: ${isOwned ? 1 : 0.4};">
        <span style="font-size:0.7rem; text-transform:uppercase; color:var(--text-3); display:block; margin-bottom:0.5rem;">${eng.tag}</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 400; margin-bottom: 1rem;">${eng.name}</h4>
        ${isOwned ? `
          <div style="margin-bottom: 2rem; font-size: 0.85rem; color: var(--text-2); line-height:1.6;">
            <p>Active Bot Identifier: <span style="color:var(--acc);">VE-NODE-SYNC-${idx}</span></p>
            <p>Connection Integrity: <span style="color:#5cb85c;">SECURE</span></p>
          </div>
          
          <!-- Test Execution Interface Built-in -->
          <div style="margin-bottom: 1.5rem;">
            <textarea 
  id="input-bot-${idx}" 
  placeholder="Enter test payload structure here..." 
  style="width:100%; background:var(--surface-2); border:1px solid var(--border); color:var(--text); padding:0.5rem; font-size:0.8rem; min-height:60px; outline:none; resize:none;"
  onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); triggerLiveBotExecution(${idx}, '${targetRoute}'); }"
></textarea>
            <button onclick="triggerLiveBotExecution(${idx}, '${targetRoute}')" style="margin-top:0.5rem; background:var(--acc); color:#050505; border:none; padding:0.4rem 1rem; font-size:0.75rem; font-weight:600; cursor:pointer; text-transform:uppercase;">Execute Live Test</button>
          </div>
          
          <div id="output-bot-${idx}" style="font-size:0.8rem; color:var(--text-2); background:#050505; padding:1rem; border:1px solid var(--border); max-height:150px; overflow-y:auto; white-space:pre-wrap; display:none;"></div>
        ` : `
          <p style="font-size:0.85rem; color:var(--text-3); margin-bottom:2rem;">Instance locked. Purchase from primary portal to authorize sync parameters.</p>
        `}
      </div>
    `;
  });
}

// Global invocation handler for live cockpit streaming
window.triggerLiveBotExecution = async function(idx, route) {
  const inputEl = document.getElementById(`input-bot-${idx}`);
  const outputEl = document.getElementById(`output-bot-${idx}`);
  if (!inputEl || !inputEl.value.trim()) return alert("Please supply text input to test.");

  outputEl.style.display = "block";
  outputEl.innerText = "Processing through telemetry pipeline...";

  try {
    // Construct request object depending on which bot is called
    let bodyData = {};
    if (idx === 0) bodyData = { sender: "test@operator.ai", subject: "Dashboard Run", body: inputEl.value };
    if (idx === 1) bodyData = { text: inputEl.value };
    if (idx === 2) bodyData = { transcript: inputEl.value };

    const response = await fetch(`${API_URL}/api/engines/${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    // Extract the valid content payload depending on bot return properties
    outputEl.innerText = data.draftReply || data.analysis || data.checklist;
  } catch (err) {
    outputEl.innerText = `Pipeline Error: ${err.message}`;
  }
};

function initializeTelemetryChartCanvas() {
  const ctx = document.getElementById('telemetryChart');
  if (!ctx) return;
  if (S.activeTelemetryChart) S.activeTelemetryChart.destroy();

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const gridColor = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)';
  const labelColor = isLight ? '#5c5a54' : '#4a4744';

  S.activeTelemetryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        data: [140, 210, 290, 310, 460, 420],
        borderColor: isLight ? '#947853' : '#C5A880',
        borderWidth: 1.5,
        backgroundColor: 'rgba(197, 168, 128, 0.02)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: labelColor } },
        y: { grid: { color: gridColor }, ticks: { color: labelColor } }
      }
    }
  });
}

/* ── CART OPERATIONS ── */
function addToCart(engineIndex) {
  if (!S.cart.includes(engineIndex)) S.cart.push(engineIndex);
  updateCartUI();
  document.getElementById('cartDrawerOverlay').style.display = 'block';
}

function updateCartUI() {
  const list = document.getElementById('cartItemsList');
  const countBadge = document.getElementById('cartCount');
  if (!list) return;

  countBadge.innerText = S.cart.length;
  list.innerHTML = '';

  if (S.cart.length === 0) {
    list.innerHTML = '<p style="color:var(--text-3); text-align:center; margin-top:4rem;">Your cart is currently empty.</p>';
    document.getElementById('cartTotalSum').innerText = REGIONS[S.region].sym + "0";
    return;
  }

  let totalAccumulator = 0;
  const sym = REGIONS[S.region].sym;

  S.cart.forEach((engineIndex) => {
    const eng = ENGINES[engineIndex];
    let rate = eng.baseRates[S.region];
    if (S.cartDuration === 6) rate = Math.round(rate * 0.9);
    if (S.cartDuration === 12) rate = Math.round(rate * 0.8);

    const crossTotal = rate * S.cartDuration;
    totalAccumulator += crossTotal;

    list.innerHTML += `
      <div style="background:var(--surface-2); border:1px solid var(--border); padding:1.2rem; display:flex; justify-content:space-between; align-items:center;">
        <div style="flex:1;">
          <h4 style="font-family:var(--font-serif); font-size:1rem; font-weight:400; margin-bottom:0.25rem;">${eng.name}</h4>
          <span style="font-size:0.85rem; color:var(--text-2);">${sym}${rate}/mo × ${S.cartDuration} Months</span>
        </div>
        <button onclick="removeFromCart(${engineIndex})" style="background:none; border:none; color:#c94c4c; font-size:0.85rem; cursor:pointer;">Remove</button>
      </div>
    `;
  });

  document.getElementById('cartTotalSum').innerText = `${sym}${totalAccumulator.toLocaleString()}`;
}

function removeFromCart(idx) {
  S.cart = S.cart.filter(item => item !== idx);
  updateCartUI();
}

function setCartDuration(mos) {
  S.cartDuration = mos;
  document.querySelectorAll('#cartDrawerOverlay .duration-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`cd-${mos}`).classList.add('active');
  updateCartUI();
}

function changeRegion(val) {
  S.region = val || 'IN';
  updateMainPrices();
  updateCartUI();
}

function updateMainPrices() {
  const sym = REGIONS[S.region].sym;
  document.getElementById('p3Amt').innerText = `${sym}${ENGINES[0].baseRates[S.region].toLocaleString()}/month`;
  document.getElementById('p6Amt').innerText = `${sym}${ENGINES[1].baseRates[S.region].toLocaleString()}/month`;
  document.getElementById('p12Amt').innerText = `${sym}${ENGINES[2].baseRates[S.region].toLocaleString()}/month`;
}

/* ── COMPREHENSIVE PRODUCTION GATEWAY WIREFRAME ── */
window.proceedToCheckoutPayment = async function() {
  if (S.cart.length === 0) return alert("Your shopping allocation array is empty.");

  let computedTotalBill = 0;
  S.cart.forEach(idx => {
    const base = ENGINES[idx].baseRates[S.region] || ENGINES[idx].baseRates['IN'];
    computedTotalBill += base * S.cartDuration;
  });

  if (S.cartDuration === 6) computedTotalBill *= 0.90;
  if (S.cartDuration === 12) computedTotalBill *= 0.80;

  try {
    // Notice the clean endpoint path matching your server setup
    const orderResponse = await fetch(`${API_URL}/api/checkout/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: computedTotalBill, currency: S.region === 'IN' ? 'INR' : 'USD' })
    });

    const orderData = await orderResponse.json();
    if (!orderData.success) throw new Error(orderData.error || "Order generation failed.");

    const orderDetails = orderData.order;

    const gatewayOptions = {
      key: "rzp_test_TCK8AFRWZ8ZMNk", 
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: "VeXillon Ltd.",
      description: `License Sync: ${S.cart.length} Core Engine Modules`,
      order_id: orderDetails.id,
      handler: async function (verifiedResponse) {
        const verificationCheck = await fetch(`${API_URL}/api/checkout/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: verifiedResponse.order_id,
            razorpay_payment_id: verifiedResponse.payment_id,
            razorpay_signature: verifiedResponse.signature
          })
        });

        const verificationResult = await verificationCheck.json();
        if (verificationResult.success) {
          alert("Payment verified successfully.");
          S.cart.forEach(id => {
            if (!S.authenticatedUser.ownedEngines.includes(id)) {
              S.authenticatedUser.ownedEngines.push(id);
            }
          });
          S.cart = [];
          document.getElementById('cartDrawerOverlay').style.display = 'none';
          updateCartUI();
          if (document.getElementById('terminal-workspace-view')?.style.display === 'block') {
            renderTerminalWorkspaceEngines();
          }
        } else {
          alert(`Security integrity check failed: ${verificationResult.error}`);
        }
      },
      prefill: {
        email: S.authenticatedUser ? S.authenticatedUser.email : "operator@vexillon.ai"
      },
      theme: { color: "#C5A880" }
    };

    const razorpayModalInstance = new window.Razorpay(gatewayOptions);
    razorpayModalInstance.open();

  } catch (error) {
    alert(`Checkout Telemetry Aborted: ${error.message}`);
  }
};

function switchEngine(idx) {
  document.querySelectorAll('.engine-card').forEach((card, i) => card.classList.toggle('active', i === idx));
  const display = document.getElementById('engineDisplay');
  if(!display) return;
  const target = ENGINES[idx];
  display.innerHTML = `
    <span class="sec-lbl">${target.tag}</span>
    <h3 style="font-family:var(--font-serif); font-size:1.8rem; font-weight:400; margin-bottom:1rem;">${target.name}</h3>
    <p style="color:var(--text-2); font-size:1rem; line-height:1.6; margin-bottom:2rem; font-weight:300;">${target.desc}</p>
  `;
}

/* ── DOM STAGE ASSEMBLY STABILIZATION ── */
document.addEventListener("DOMContentLoaded", () => {
  triggerCinematicIntroSequence();
  initThemeEngine();
  updateMainPrices();
  switchEngine(0);

  document.getElementById('profileTrigger')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('profileOverlay').style.display = 'flex';
  });

  document.getElementById('cartTrigger')?.addEventListener('click', () => {
    document.getElementById('cartDrawerOverlay').style.display = 'block';
  });

  document.getElementById('cartCloseBtn')?.addEventListener('click', () => {
    document.getElementById('cartDrawerOverlay').style.display = 'none';
  });

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
  });
});
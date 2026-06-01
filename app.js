// CONSTANTS / DOMS

// VERSION CONSTANT
const GAME_VERSION = '1.10';

const rouletteNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const degPerPocket = 360 / 37;

let balance = 5000;
let selectedChipValue = 10;
let activeBets = [];
let lastRoundBets = [];
let spinHistory = [];

let betHistory = [];
let lifetimeSpinCount = 0;
let lifetimeNetTotal = 0;

let turboSpinMode = false;

let infiniteBankMode = false;
let forcedNextNumber = null;
let adminCenterClicks = 0;
let adminCenterTimer = null;
let allCosmeticsUnlocked = false;

let wheelAngle = 0;
let wheelVelocity = 0;
let ballAngle = 0;
let ballVelocity = 0;
let ballRadius = 132;
let ballStage = 'idle';

let winningIndex = 0;
let targetDockOffset = 0;

// IMAGE PATH CONSTANTS
const IMAGE_PATH = 'image/';
const BACKGROUND_IMG_PATH = 'image/background/';
const BALL_IMG_PATH = 'image/ball/';
const HANDLE_IMG_PATH = 'image/handle/';

// ELEMENT CONSTANTS
const canvas = document.getElementById('wheel-canvas');
const ballEl = document.getElementById('ball');
const table = document.getElementById('betting-table');
const repeatBetBtn = document.getElementById('repeat-bet-btn');
const winNumberDisplay = document.getElementById('win-number-display');
const spinHistoryDisplay = document.getElementById('spin-history');
const spinBtn = document.getElementById('spin-btn');
const clearBtn = document.getElementById('clear-btn');
const balanceDisplay = document.getElementById('balance');
const totalBetDisplay = document.getElementById('total-bet-display');
const systemLog = document.getElementById('system-log');
const betSlip = document.getElementById('bet-slip');
const betSlipTotal = document.getElementById('bet-slip-total-payout');

//BET HISTORY CONSTANTS
const betHistoryBtn = document.getElementById('bet-history-btn');
const betHistoryModal = document.getElementById('bet-history-modal');
const betHistoryCloseBtn = document.getElementById('bet-history-close-btn');
const betHistoryList = document.getElementById('bet-history-list');
const lifetimeSpinCountDisplay = document.getElementById('lifetime-spin-count');
const lifetimeNetTotalDisplay = document.getElementById('lifetime-net-total');

//HELP CONSTANTTS
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpCloseBtn = document.getElementById('help-close-btn');

//WHEEL CENTER LOGO CONSTANTS
const wheelCenterLogo = document.getElementById('wheel-center-logo');

//ADMIN CONSTANTS
const adminModal = document.getElementById('admin-modal');
const adminCloseBtn = document.getElementById('admin-close-btn');
const adminStatus = document.getElementById('admin-status');
const forceNumberInput = document.getElementById('force-number-input');
const forceNumberBtn = document.getElementById('force-number-btn');
const clearForceBtn = document.getElementById('clear-force-btn');
const adminResetBankBtn = document.getElementById('admin-reset-bank');
const infiniteBankBtn = document.getElementById('infinite-bank-btn');
const unlockCosmeticsBtn = document.getElementById('unlock-cosmetics-btn');
const adminClearHistoryBtn = document.getElementById('admin-clear-history-btn');
const clearHistoryConfirmModal = document.getElementById('clear-history-confirm-modal');
const confirmClearHistoryBtn = document.getElementById('confirm-clear-history-btn');
const cancelClearHistoryBtn = document.getElementById('cancel-clear-history-btn');

//SOUND CONSTANTS
const betSound = new Audio('audio/bet-coin.mp3');
const clearSound = new Audio('audio/clear-whoosh.mp3');
const wheelSpinSound = new Audio('audio/wheel-spin-loop.mp3');
const gameStartSound = new Audio('audio/game-start.mp3');
const winPaidSound = new Audio('audio/win-paid.mp3');
const zeroHitSound = new Audio('audio/zero-hit.mp3');

//GAME TITLE CONSTANTS
const gameTitle = document.getElementById('game-title');

//VERSION CONSTANT
const versionDisplay = document.getElementById('version-display');

//BET LABEL CONSTANTS
const redBetLabel = document.querySelector('.red-bet');
const blackBetLabel = document.querySelector('.black-bet');

// DEFAULT THEME HANDLES
const DEFAULT_THEME_HANDLES = {
    'cyber-green': 'cybergreen_handle.webp',
    'cyber-purple': 'cyberpurple_handle.webp',
    volcanic: 'volcanic_handle.webp',
    frozen: 'frozen_handle.webp',
    royal: 'royal_handle.webp',
    classic: 'classic_handle.webp',
    'vegas-retro': 'retro_handle.webp'
};

// APPLY DEFAULT THEME HANDLE
function applyDefaultThemeHandle(themeName) {
    const handleImage = document.querySelector('#wheel-center-logo img');

    if (!handleImage) return;

    handleImage.src =
        HANDLE_IMG_PATH + (DEFAULT_THEME_HANDLES[themeName] || DEFAULT_THEME_HANDLES['cyber-green']);
}

// CUSTOM THEME HANDLES
// Add custom handle override code here later.

// LOCKED LOGO / COSMETIC THEME CHECK
function isLockedLogoAndCosmeticTheme(themeName) {
    return (
        themeName === 'royal' ||
        themeName === 'classic' ||
        themeName === 'vegas-retro'
    );
}

// UPDATE SPINNING LOGO TOGGLE DISPLAY
function updateSpinningLogoToggleDisplay() {
    spinningLogoToggleBtn.textContent =
        spinningLogoEnabled ? 'ON' : 'OFF';

    spinningLogoToggleBtn.classList.toggle(
        'option-on',
        spinningLogoEnabled
    );

    spinningLogoToggleBtn.classList.toggle(
        'option-off',
        !spinningLogoEnabled
    );
}

// APPLY THEME OPTION LOCKS
function applyThemeOptionLocks(themeName) {
    const customWheelCenterBtn =
        document.getElementById('custom-wheel-center-btn');

    const customBallBtn =
        document.getElementById('custom-ball-btn');

    const isLockedTheme =
        isLockedLogoAndCosmeticTheme(themeName);

    if (isLockedTheme) {
        spinningLogoEnabled = true;
        spinningLogoToggleBtn.disabled = true;
    } else {
        const savedSpinningLogo =
            localStorage.getItem('ultimateRoulette_spinningLogo');

        spinningLogoEnabled =
            savedSpinningLogo !== 'off';

        spinningLogoToggleBtn.disabled = false;
    }

    updateSpinningLogoToggleDisplay();

    if (customWheelCenterBtn) {
        customWheelCenterBtn.disabled = isLockedTheme;
        customWheelCenterBtn.textContent =
            isLockedTheme ? 'LOCKED' : 'COMING SOON';
    }

    if (customBallBtn) {
        customBallBtn.disabled = isLockedTheme;
        customBallBtn.textContent =
            isLockedTheme ? 'LOCKED' : 'COMING SOON';
    }
}

// DISPLAY GAME VERSION
versionDisplay.textContent = `Ver: ${GAME_VERSION}`;

//START FUNCTIONS

//CYBER TITLE MARKUP
function setCyberTitleMarkup() {
    gameTitle.innerHTML = `
        <span class="title-green">U</span>
        <span class="title-blue">L</span>
        <span class="title-green">T</span>
        <span class="title-blue">I</span>
        <span class="title-green">M</span>
        <span class="title-blue">A</span>
        <span class="title-green">T</span>
        <span class="title-blue">E</span>

        <span class="title-gap"></span>

        <span class="title-blue">R</span>
        <span class="title-green">O</span>
        <span class="title-blue">U</span>
        <span class="title-green">L</span>
        <span class="title-blue">E</span>
        <span class="title-green">T</span>
        <span class="title-blue">T</span>
        <span class="title-green">E</span>
    `;
}

//VEGAS RETRO TITLE MARKUP
function setVegasRetroTitleMarkup() {
    gameTitle.innerHTML = `
        <span class="vegas-script">Ultimate</span>
        <span class="vegas-marquee">ROULETTE</span>
    `;
}

wheelSpinSound.loop = true;
wheelSpinSound.volume = 0.45;
betSound.volume = 0.6;
clearSound.volume = 0.55;
gameStartSound.volume = 0.65;
winPaidSound.volume = 0.7;
zeroHitSound.volume = 0.8;

const welcomeModal = document.getElementById('welcome-modal');
const letsPlayBtn = document.getElementById('lets-play-btn');

letsPlayBtn.addEventListener('click', () => {
    welcomeModal.classList.add('modal-hidden');

	playSound(gameStartSound);
});

function playSound(sound) {

    if (!soundEffectsEnabled) return;

    sound.currentTime = 0;

    if (sound === wheelSpinSound) {
        wheelSpinSound.loop = true;
    }

    sound.play().catch(() => {});
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function dealerSay(messages) {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    systemLog.innerHTML = randomMessage;
}

const dealerMessages = {
    tableOpen: [
        "Place your bets, players. The table is open.",
        "Step right up. Chips down when you're ready.",
        "Table is open. Let’s see where the wheel takes us.",
        "Place your bets. Good luck, everyone."
    ],

    noBet: [
        "No bets on the table yet. Put some chips down first.",
        "Can’t spin an empty table. Place your bets first.",
        "Dealer needs chips on the felt before we spin.",
        "No action yet. Pick your numbers and place your bets."
    ],

    betPlaced: [
        "Bet accepted.",
        "Chips are on the felt.",
        "Locked in.",
        "Good luck on that one.",
        "Action on the table."
    ],

    clearBets: [
        "Bets cleared. Chips returned to bank.",
        "Table cleared. Your chips are back.",
        "Pulling the bets back. Fresh table.",
        "Bets are off the layout."
    ],

    spinStart: [
        "No more bets! Wheel is spinning!",
        "No more bets, players!",
        "Here we go. Wheel is live!",
        "Bets are closed. Around she goes!",
        "Dealer spins. Good luck, everyone."
    ],

    turboSpin: [
        "Turbo spin! Dealer drops it straight in!",
        "Fast drop. Let’s see where it lands.",
        "Quick round coming up!",
        "Turbo mode. Straight to the pocket."
    ],

    win: [
        `Winner! Number WINNING_NUMBER! Dealer pays <span style="color:#39ff14;">PAYOUT chips</span>.`,
        `Number WINNING_NUMBER hits! Paying out <span style="color:#39ff14;">PAYOUT chips</span>.`,
        `WINNING_NUMBER lands clean. Dealer pays <span style="color:#39ff14;">PAYOUT chips</span>.`,
        `That’s a winner on WINNING_NUMBER! <span style="color:#39ff14;">PAYOUT chips</span> coming your way.`
    ],

    loss: [
        "Number WINNING_NUMBER. House takes it this round.",
        "WINNING_NUMBER hits. No payout this time.",
        "Number WINNING_NUMBER. Tough break, players.",
        "WINNING_NUMBER on the wheel. Set your next bets."
    ]
};

let soundEffectsEnabled = true;
let spinningLogoEnabled = true;

const soundToggleBtn = document.getElementById('sound-toggle-btn');

soundToggleBtn.addEventListener('click', () => {

    soundEffectsEnabled = !soundEffectsEnabled;

	soundToggleBtn.textContent = soundEffectsEnabled ? 'ON' : 'OFF';

	soundToggleBtn.classList.toggle('option-on', soundEffectsEnabled);
	soundToggleBtn.classList.toggle('option-off', !soundEffectsEnabled);

	localStorage.setItem(
    'ultimateRoulette_soundEffects',
    soundEffectsEnabled ? 'on' : 'off'
);
});

const turboToggleBtn = document.getElementById('turbo-toggle-btn');

turboToggleBtn.addEventListener('click', () => {
    turboSpinMode = !turboSpinMode;

	turboToggleBtn.textContent = turboSpinMode ? 'ON' : 'OFF';
	spinBtn.textContent = turboSpinMode ? 'TURBO' : 'SPIN';

	spinBtn.classList.toggle('turbo-sweep', turboSpinMode);
	
	turboToggleBtn.classList.toggle('option-on', turboSpinMode);
	turboToggleBtn.classList.toggle('option-off', !turboSpinMode);
	
	localStorage.setItem(
    'ultimateRoulette_turboMode',
    turboSpinMode ? 'on' : 'off'
);
});

const spinningLogoToggleBtn =
    document.getElementById(
        'spinning-logo-toggle-btn'
    );

spinningLogoToggleBtn.textContent =
    spinningLogoEnabled ? 'ON' : 'OFF';

spinningLogoToggleBtn.classList.toggle(
    'option-on',
    spinningLogoEnabled
);

spinningLogoToggleBtn.classList.toggle(
    'option-off',
    !spinningLogoEnabled
);

// SPINNING LOGO TOGGLE
spinningLogoToggleBtn.addEventListener('click', () => {

    if (isLockedLogoAndCosmeticTheme(currentTheme)) return;

    spinningLogoEnabled =
        !spinningLogoEnabled;

    updateSpinningLogoToggleDisplay();

    localStorage.setItem(
        'ultimateRoulette_spinningLogo',
        spinningLogoEnabled ? 'on' : 'off'
    );
});

const themeToggleBtn = document.getElementById('theme-toggle-btn');

let currentTheme = 'cyber-green';

/* =========================
   BOARD THEME CYCLE
   Cyber Red -> Cyber Purple -> Volcanic -> Frozen -> Royal -> Classic -> Vegas Retro
========================= */

themeToggleBtn.addEventListener('click', () => {

    if (currentTheme === 'cyber-green') {

        currentTheme = 'cyber-purple';

        document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
        document.body.classList.add('purple-theme');

        themeToggleBtn.textContent = 'CYBER PURPLE';
        themeToggleBtn.style.color = '#c86bff';
        themeToggleBtn.style.borderColor = '#c86bff';
		setCyberTitleMarkup();

    } else if (currentTheme === 'cyber-purple') {

        currentTheme = 'volcanic';

        document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
        document.body.classList.add('volcanic-theme');

        themeToggleBtn.textContent = 'VOLCANIC';
        themeToggleBtn.style.color = '#ff7a00';
        themeToggleBtn.style.borderColor = '#ff7a00';

    } else if (currentTheme === 'volcanic') {

    currentTheme = 'frozen';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('frozen-theme');

    themeToggleBtn.textContent = 'FROZEN';
    themeToggleBtn.style.color = '#8ff6ff';
    themeToggleBtn.style.borderColor = '#8ff6ff';

} else if (currentTheme === 'frozen') {

    currentTheme = 'royal';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('royal-theme');

    themeToggleBtn.textContent = 'ROYAL';
    themeToggleBtn.style.color = '#d4af37';
    themeToggleBtn.style.borderColor = '#b88a2b';
	gameTitle.innerHTML = 'Ultimate Roulette';

} else if (currentTheme === 'royal') {

    currentTheme = 'classic';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('classic-theme');

    themeToggleBtn.textContent = 'CLASSIC';
    themeToggleBtn.style.color = '';
    themeToggleBtn.style.borderColor = '';
    gameTitle.innerHTML = 'ULTIMATE ROULETTE';

} else if (currentTheme === 'classic') {

    currentTheme = 'vegas-retro';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('vegas-retro-theme');

    themeToggleBtn.textContent = 'VEGAS RETRO';
    themeToggleBtn.style.color = '#ffcf6b';
    themeToggleBtn.style.borderColor = '#ff3b22';

    setVegasRetroTitleMarkup();

} else {

        currentTheme = 'cyber-green';

        document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');

        themeToggleBtn.textContent = 'CYBER GREEN';
        themeToggleBtn.style.color = '#39ff14';
        themeToggleBtn.style.borderColor = '#39ff14';
		
		setCyberTitleMarkup();
    }

    drawRouletteWheel();
	
	applyDefaultThemeHandle(currentTheme);
	applyThemeOptionLocks(currentTheme);

    if (currentTheme === 'classic') {
        redBetLabel.textContent = 'Red';
        blackBetLabel.textContent = 'Black';
    } else if (currentTheme === 'cyber-purple') {
        redBetLabel.textContent = 'Purple';
        blackBetLabel.textContent = 'Blue';
    } else if (currentTheme === 'volcanic') {
		redBetLabel.textContent = 'Fire';
		blackBetLabel.textContent = 'Ember';
	} else if (currentTheme === 'frozen') { 
		redBetLabel.textContent = 'Ice'; 
		blackBetLabel.textContent = 'Frost';
	} else if (currentTheme === 'royal') {
		redBetLabel.textContent = 'Gold';
		blackBetLabel.textContent = 'Silver';
	} else if (currentTheme === 'vegas-retro') {
		redBetLabel.textContent = 'Red';
		blackBetLabel.textContent = 'Black';
	} else {
        redBetLabel.textContent = 'Green';
        blackBetLabel.textContent = 'Blue';
    }

    localStorage.setItem('ultimateRoulette_theme', currentTheme);
});

helpBtn.addEventListener('click', () => {
    helpModal.classList.remove('modal-hidden');
});

helpCloseBtn.addEventListener('click', () => {
    helpModal.classList.add('modal-hidden');
});

helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add('modal-hidden');
    }
});

const optionsBtn = document.getElementById('options-btn');
const optionsModal = document.getElementById('options-modal');
const optionsCloseBtn = document.getElementById('options-close-btn');

optionsBtn.addEventListener('click', () => {
    optionsModal.classList.remove('modal-hidden');
});

optionsCloseBtn.addEventListener('click', () => {
    optionsModal.classList.add('modal-hidden');
});

optionsModal.addEventListener('click', (e) => {
    if (e.target === optionsModal) {
        optionsModal.classList.add('modal-hidden');
    }
});

wheelCenterLogo.addEventListener('click', () => {
    adminCenterClicks++;

    clearTimeout(adminCenterTimer);

    adminCenterTimer = setTimeout(() => {
        adminCenterClicks = 0;
    }, 2000);

    if (adminCenterClicks >= 7) {
        adminCenterClicks = 0;
        adminModal.classList.remove('modal-hidden');
        adminStatus.textContent = 'Admin console opened.';
    }
});

adminCloseBtn.addEventListener('click', () => {
    adminModal.classList.add('modal-hidden');
});

adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.classList.add('modal-hidden');
    }
});

document.querySelectorAll('[data-bank-change]').forEach(btn => {
    btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.bankChange);

        balance += amount;
        if (balance < 0) balance = 0;

        balanceDisplay.textContent = balance;
		saveBank();
        adminStatus.textContent = `Bank adjusted by ${amount}. Current bank: ${balance}.`;
    });
});

adminResetBankBtn.addEventListener('click', () => {
    balance = 5000;
    balanceDisplay.textContent = balance;
	saveBank();
    adminStatus.textContent = 'Bank reset to 5000.';
});

forceNumberBtn.addEventListener('click', () => {
    const value = parseInt(forceNumberInput.value);

    if (Number.isNaN(value) || value < 0 || value > 36) {
        adminStatus.textContent = 'Enter a valid number from 0 to 36.';
        return;
    }

    forcedNextNumber = value;
    adminStatus.textContent = `Next spin forced to ${forcedNextNumber}.`;
});

clearForceBtn.addEventListener('click', () => {
    forcedNextNumber = null;
    forceNumberInput.value = '';
    adminStatus.textContent = 'Forced spin cleared.';
});

infiniteBankBtn.addEventListener('click', () => {
    infiniteBankMode = !infiniteBankMode;

    infiniteBankBtn.textContent = infiniteBankMode ? 'ON' : 'OFF';
    adminStatus.textContent = infiniteBankMode ? 'Infinite chips enabled.' : 'Infinite chips disabled.';
});

unlockCosmeticsBtn.addEventListener('click', () => {
    allCosmeticsUnlocked = true;
    adminStatus.textContent = 'All cosmetics unlocked for testing.';
});

adminClearHistoryBtn.addEventListener('click', () => {
    clearHistoryConfirmModal.classList.remove('modal-hidden');
});

confirmClearHistoryBtn.addEventListener('click', () => {

    betHistory = [];
    lifetimeSpinCount = 0;
    lifetimeNetTotal = 0;

    saveBetHistory();
    renderBetHistory();

    clearHistoryConfirmModal.classList.add('modal-hidden');

    adminStatus.textContent =
        'Bet history cleared. Lifetime stats reset to 0.';
});

cancelClearHistoryBtn.addEventListener('click', () => {
    clearHistoryConfirmModal.classList.add('modal-hidden');
});

function getBetPayoutMultiplier(type) {
    switch(type) {
        case 'number': return 36;
        case 'split_horizontal':
        case 'split_vertical': return 18;
        case 'corner': return 9;
        case 'color':
        case 'evenodd':
        case 'lowhigh': return 2;
        case 'dozen':
        case 'column': return 3;
        default: return 0;
    }
}

function getBetLabel(bet) {
    switch(bet.type) {
        case 'number': return `#${bet.values[0]}`;
        case 'split_horizontal':
        case 'split_vertical': return `Split ${bet.values.join('/')}`;
        case 'corner': return `Corner ${bet.values.join('/')}`;
        case 'color':
        case 'evenodd': return bet.values[0].charAt(0).toUpperCase() + bet.values[0].slice(1);
        case 'lowhigh': return bet.values[0] === 'low' ? '1-18' : '19-36';
        case 'dozen':
            if (bet.values[0] === '1') return '1st 12';
            if (bet.values[0] === '2') return '2nd 12';
            return '3rd 12';
        case 'column': return `Column ${bet.values[0]}`;
        default: return 'Bet';
    }
}

function updateBetSlip() {
    let totalPotential = 0;
    betSlip.innerHTML = '';

    activeBets.forEach(bet => {
        const multiplier = getBetPayoutMultiplier(bet.type);
        const payout = bet.amount * multiplier;
        totalPotential += payout;

        const row = document.createElement('div');
        row.className = 'bet-slip-row';
        row.innerHTML = `
            <div class="bet-slip-name">${getBetLabel(bet)}</div>
            <div class="bet-slip-stake">${bet.amount}</div>
            <div class="bet-slip-payout">${payout}</div>
        `;
        betSlip.appendChild(row);
    });

    betSlipTotal.textContent = totalPotential;

    if (activeBets.length > 16) {
        betSlip.classList.add('scroll-active');
    } else {
        betSlip.classList.remove('scroll-active');
    }
}

function getNumberColorClass(number) {
    if (number === 0) return 'history-zero';
    if (redNumbers.includes(number)) return 'history-red';
    return 'history-black';
}

function updateSpinHistory(winningNumber) {
    spinHistory.unshift(winningNumber);

    if (spinHistory.length > 10) {
        spinHistory.pop();
    }

    spinHistoryDisplay.innerHTML = spinHistory.map(number => {
        return `<div class="history-number ${getNumberColorClass(number)}">${number}</div>`;
    }).join('');
	localStorage.setItem('ultimateRoulette_spinHistory', JSON.stringify(spinHistory));
}

function loadSavedSpinHistory() {
    const savedHistory = localStorage.getItem('ultimateRoulette_spinHistory');

    if (savedHistory) {
        spinHistory = JSON.parse(savedHistory);
        spinHistoryDisplay.innerHTML = spinHistory.map(number => {
            return `<div class="history-number ${getNumberColorClass(number)}">${number}</div>`;
        }).join('');
    }
}

function renderBetHistory() {
    lifetimeSpinCountDisplay.textContent = lifetimeSpinCount;
    lifetimeNetTotalDisplay.textContent = lifetimeNetTotal;

    if (lifetimeNetTotal > 0) {
        lifetimeNetTotalDisplay.className = 'bet-history-win';
    } else if (lifetimeNetTotal < 0) {
        lifetimeNetTotalDisplay.className = 'bet-history-loss';
    } else {
        lifetimeNetTotalDisplay.className = 'bet-history-neutral';
    }

    betHistoryList.innerHTML = betHistory.map(entry => {
        const resultClass = entry.net > 0 ? 'bet-history-win' : entry.net < 0 ? 'bet-history-loss' : 'bet-history-neutral';
        const resultText = entry.net > 0 ? `+${entry.net}` : `${entry.net}`;

        return `
            <div class="bet-history-row">
                <div>Spin ${entry.spin}</div>
                <div>Bet: ${entry.totalBet}</div>
                <div class="${resultClass}">Net: ${resultText}</div>
            </div>
        `;
    }).join('');
}

function saveBetHistory() {
    localStorage.setItem('ultimateRoulette_betHistory', JSON.stringify(betHistory));
    localStorage.setItem('ultimateRoulette_lifetimeSpinCount', lifetimeSpinCount);
    localStorage.setItem('ultimateRoulette_lifetimeNetTotal', lifetimeNetTotal);
}

function loadSavedBetHistory() {
    const savedBetHistory = localStorage.getItem('ultimateRoulette_betHistory');
    const savedSpinCount = localStorage.getItem('ultimateRoulette_lifetimeSpinCount');
    const savedNetTotal = localStorage.getItem('ultimateRoulette_lifetimeNetTotal');

    if (savedBetHistory) {
        betHistory = JSON.parse(savedBetHistory);
    }

    if (savedSpinCount) {
        lifetimeSpinCount = parseInt(savedSpinCount);
    }

    if (savedNetTotal) {
        lifetimeNetTotal = parseInt(savedNetTotal);
    }

    renderBetHistory();
}

function addBetHistoryEntry(totalBet, payout) {
    lifetimeSpinCount++;

    const net = payout - totalBet;
    lifetimeNetTotal += net;

    betHistory.unshift({
        spin: lifetimeSpinCount,
        totalBet,
        payout,
        net
    });

    if (betHistory.length > 50) {
        betHistory.pop();
    }

    saveBetHistory();
    renderBetHistory();
}

betHistoryBtn.addEventListener('click', () => {
    renderBetHistory();
    betHistoryModal.classList.remove('modal-hidden');
});

// FROZEN BET HISTORY BUTTON FORCED HOVER
betHistoryBtn.addEventListener('mouseenter', () => {
    if (document.body.classList.contains('frozen-theme')) {
        betHistoryBtn.classList.add('frozen-bet-history-hover');
    }
});

betHistoryBtn.addEventListener('mouseleave', () => {
    betHistoryBtn.classList.remove('frozen-bet-history-hover');
});

betHistoryCloseBtn.addEventListener('click', () => {
    betHistoryModal.classList.add('modal-hidden');
});

betHistoryModal.addEventListener('click', (e) => {
    if (e.target === betHistoryModal) {
        betHistoryModal.classList.add('modal-hidden');
    }
});

function drawRouletteWheel() {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const sliceAngle = (Math.PI * 2) / 37;

    const isClassicTheme = document.body.classList.contains('classic-theme');
    const isPurpleTheme = document.body.classList.contains('purple-theme');
    const isVolcanicTheme = document.body.classList.contains('volcanic-theme');
	const isFrozenTheme = document.body.classList.contains('frozen-theme');
	const isRoyalTheme = document.body.classList.contains('royal-theme');
	const isVegasRetroTheme = document.body.classList.contains('vegas-retro-theme');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 37; i++) {
        const num = rouletteNumbers[i];
        const startAngle = i * sliceAngle - Math.PI / 2 - (sliceAngle / 2);
        const endAngle = startAngle + sliceAngle;

        let color = '#020d04';

        if (isClassicTheme || isVegasRetroTheme) {
            if (num === 0) color = '#007a2f';
            else if (redNumbers.includes(num)) color = '#b00000';
            else color = '#050505';
        } else {
            if (num === 0) {
				color = isRoyalTheme ? '#1b1208' : isFrozenTheme ? '#06243a' : isVolcanicTheme ? '#3a1600' : isPurpleTheme ? '#2a063a' : '#06260b';

		} else if (redNumbers.includes(num)) {
				color = isRoyalTheme ? '#1b1208' : isFrozenTheme ? '#06243a' : isVolcanicTheme ? '#3a1600' : isPurpleTheme ? '#2a063a' : '#06260b';

		} else {
				color = isRoyalTheme ? '#070504' : isFrozenTheme ? '#030b18' : isVolcanicTheme ? '#070504' : isPurpleTheme ? '#08020d' : '#020d04';
}
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = isRoyalTheme
			? 'rgba(184,138,43,0.42)'
			: isFrozenTheme
				? 'rgba(143,246,255,0.42)'
				: isVolcanicTheme
					? 'rgba(255,122,0,0.42)'
					: isPurpleTheme
						? 'rgba(200,107,255,0.35)'
						: isVegasRetroTheme
							? 'rgba(184,121,34,0.62)'
							: 'rgba(57,255,20,0.3)';

        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();

        if (isClassicTheme || isVegasRetroTheme) {
            ctx.fillStyle = '#ffffff';
        } else {
            if (num === 0) {
                ctx.fillStyle = isFrozenTheme ? '#b7c8ff' : '#ffd700';
            } else if (redNumbers.includes(num)) {
                ctx.fillStyle = isRoyalTheme ? '#d4af37' : isFrozenTheme ? '#8ff6ff' : isVolcanicTheme ? '#ff7a00' : isPurpleTheme ? '#c86bff' : '#39ff14';
            } else {
                ctx.fillStyle = isRoyalTheme ? '#f5df9b' : isFrozenTheme ? '#d8fbff' : isVolcanicTheme ? '#ffcf75' : '#50dcff';
            }
        }

        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2 + Math.PI / 2);
        ctx.fillText(num, 0, -radius + 30);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 48, 0, Math.PI * 2);

    ctx.strokeStyle = isRoyalTheme
		? 'rgba(184,138,43,0.72)'
		: isFrozenTheme
			? 'rgba(143,246,255,0.75)'
			: isVolcanicTheme
				? 'rgba(255,122,0,0.75)'
				: isPurpleTheme
					? 'rgba(200,107,255,0.6)'
					: isVegasRetroTheme
						? 'rgba(184,121,34,0.82)'
						: 'rgba(57,255,20,0.5)';

    ctx.lineWidth = 2;
    ctx.stroke();
}

drawRouletteWheel();

function buildVerticalTable() {
    let currentNum = 1;

    for (let row = 2; row <= 13; row++) {
        for (let col = 3; col <= 5; col++) {
            const isRed = redNumbers.includes(currentNum);
            const colorClass = isRed ? 'red-num' : 'black';

            const cell = document.createElement('div');
            cell.className = `cell ${colorClass}`;
            cell.textContent = currentNum;
            cell.dataset.betType = 'number';
            cell.dataset.value = currentNum;
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.style.gridColumn = col;
            cell.style.gridRow = row;

            table.appendChild(cell);
            currentNum++;
        }
    }
}

buildVerticalTable();

const THRESHOLD = 11;
let currentTargetBet = null;

// VEGAS RETRO FORCED BET GRID HOVER HIGHLIGHT
function applyVegasRetroHoverHighlightStyles() {
    if (!document.body.classList.contains('vegas-retro-theme')) return;

    document.querySelectorAll('.cell.highlight-bet').forEach(cell => {
        cell.style.setProperty('background', '#ffcf6b', 'important');
        cell.style.setProperty('background-color', '#ffcf6b', 'important');
        cell.style.setProperty('color', '#1b0802', 'important');
        cell.style.setProperty('border-color', '#fff4bf', 'important');
        cell.style.setProperty('text-shadow', 'none', 'important');
		cell.style.setProperty('transition', 'none', 'important');
        cell.style.setProperty(
            'box-shadow',
            'inset 0 0 0 2px #fff4bf, 0 0 14px rgba(255,207,107,0.95), 0 0 24px rgba(255,179,49,0.65)',
            'important'
        );
    });
}

// VEGAS RETRO FORCED BET GRID HOVER CLEANUP
function clearVegasRetroHoverHighlightStyles() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.removeProperty('background');
        cell.style.removeProperty('background-color');
        cell.style.removeProperty('color');
        cell.style.removeProperty('border-color');
        cell.style.removeProperty('text-shadow');
		cell.style.removeProperty('transition');
        cell.style.removeProperty('box-shadow');
    });
}

function resolveMouseBetLayout(e) {
    const cell = e.target.closest('.cell');
    clearVegasRetroHoverHighlightStyles();
		document.querySelectorAll('.cell.highlight-bet').forEach(c => c.classList.remove('highlight-bet'));
    currentTargetBet = null;

    if (!cell || table.classList.contains('disabled-table')) return;

if (cell.classList.contains('outside') || cell.dataset.betType === 'column' || cell.dataset.value == "0") {
    const val = cell.dataset.value;
    const type = cell.dataset.betType;
    const rect = cell.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    currentTargetBet = {
        type,
        values: type === 'number' ? [0] : [val],
        posX: rect.left + rect.width / 2 - tableRect.left,
        posY: rect.top + rect.height / 2 - tableRect.top,
        id: `${type}-${val}`
    };

    cell.classList.add('highlight-bet');

    if (true) {
        document.querySelectorAll('.cell[data-row]').forEach(numberCell => {
            const n = parseInt(numberCell.dataset.value);
            let shouldHighlight = false;

            if (type === 'evenodd' && val === 'even' && n % 2 === 0) shouldHighlight = true;
            if (type === 'evenodd' && val === 'odd' && n % 2 !== 0) shouldHighlight = true;

            if (type === 'lowhigh' && val === 'low' && n >= 1 && n <= 18) shouldHighlight = true;
            if (type === 'lowhigh' && val === 'high' && n >= 19 && n <= 36) shouldHighlight = true;

            if (type === 'dozen' && val === '1' && n >= 1 && n <= 12) shouldHighlight = true;
            if (type === 'dozen' && val === '2' && n >= 13 && n <= 24) shouldHighlight = true;
            if (type === 'dozen' && val === '3' && n >= 25 && n <= 36) shouldHighlight = true;

			if (type === 'column') {
			const cellCol = parseInt(numberCell.dataset.col);				const selectedColumn = parseInt(val) + 2;

			if (cellCol === selectedColumn) shouldHighlight = true;
}

            if (type === 'color') {
                const isRedClassic = redNumbers.includes(n);
                const isBlackClassic = !redNumbers.includes(n);

                if (val === 'green' && isRedClassic) shouldHighlight = true;
                if (val === 'blue' && isBlackClassic) shouldHighlight = true;
            }

            if (shouldHighlight) {
                numberCell.classList.add('highlight-bet');
            }
        });
    }

    applyVegasRetroHoverHighlightStyles();

    return;
}

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const num = parseInt(cell.dataset.value);

    const rect = cell.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nearLeft = mouseX < THRESHOLD && c > 3;
    const nearRight = mouseX > rect.width - THRESHOLD && c < 5;
    const nearTop = mouseY < THRESHOLD && r > 2;
    const nearBottom = mouseY > rect.height - THRESHOLD && r < 13;

    let highlightedRows = [r];
    let highlightedCols = [c];
    let betType = 'number';

    if (nearLeft && nearTop) {
        betType = 'corner';
        highlightedRows = [r - 1, r];
        highlightedCols = [c - 1, c];
    } else if (nearLeft && nearBottom) {
        betType = 'corner';
        highlightedRows = [r, r + 1];
        highlightedCols = [c - 1, c];
    } else if (nearRight && nearTop) {
        betType = 'corner';
        highlightedRows = [r - 1, r];
        highlightedCols = [c, c + 1];
    } else if (nearRight && nearBottom) {
        betType = 'corner';
        highlightedRows = [r, r + 1];
        highlightedCols = [c, c + 1];
    } else if (nearLeft) {
        betType = 'split_horizontal';
        highlightedCols = [c - 1, c];
    } else if (nearRight) {
        betType = 'split_horizontal';
        highlightedCols = [c, c + 1];
    } else if (nearTop) {
        betType = 'split_vertical';
        highlightedRows = [r - 1, r];
    } else if (nearBottom) {
        betType = 'split_vertical';
        highlightedRows = [r, r + 1];
    }

    let finalTargetValues = [];
    let chipX = rect.left + rect.width / 2;
    let chipY = rect.top + rect.height / 2;

    if (betType === 'number') {
        finalTargetValues.push(num);
        cell.classList.add('highlight-bet');
    } else {
        document.querySelectorAll('.cell[data-row]').forEach(el => {
            const elR = parseInt(el.dataset.row);
            const elC = parseInt(el.dataset.col);

            if (highlightedRows.includes(elR) && highlightedCols.includes(elC)) {
                el.classList.add('highlight-bet');
                finalTargetValues.push(parseInt(el.dataset.value));
            }
        });

        if (nearLeft) chipX = rect.left;
        if (nearRight) chipX = rect.right;
        if (nearTop) chipY = rect.top;
        if (nearBottom) chipY = rect.bottom;
    }

        currentTargetBet = {
        type: betType,
        values: finalTargetValues,
        posX: chipX - tableRect.left,
        posY: chipY - tableRect.top,
        id: `${betType}-${finalTargetValues.sort((a,b) => a-b).join('_')}`
    };

    applyVegasRetroHoverHighlightStyles();
}

table.addEventListener('mousemove', resolveMouseBetLayout);

table.addEventListener('mouseleave', () => {
    clearVegasRetroHoverHighlightStyles();
    document.querySelectorAll('.cell.highlight-bet').forEach(c => c.classList.remove('highlight-bet'));
});

function repeatLastBets() {
    if (table.classList.contains('disabled-table')) return;

    if (lastRoundBets.length === 0) {
        systemLog.textContent = "No previous bets to repeat yet.";
        return;
    }

    const repeatTotal = lastRoundBets.reduce((sum, bet) => sum + bet.amount, 0);

    if (!infiniteBankMode && balance < repeatTotal) {
        systemLog.textContent = "Not enough chips to repeat the last bet.";
        return;
    }

    document.querySelectorAll('.table-placed-chip').forEach(chip => chip.remove());

    activeBets = lastRoundBets.map(bet => ({
		id: bet.id,
		type: bet.type,
		values: [...bet.values],
		amount: bet.amount,
		posX: bet.posX,
		posY: bet.posY
}));

    if (!infiniteBankMode) {
        balance -= repeatTotal;
        balanceDisplay.textContent = balance;
        saveBank();
    }

    activeBets.forEach(bet => {
        const chipVisual = document.createElement('div');
        let chipClass = 'chip-green';

        if (bet.amount === 10) chipClass = 'chip-grey';
        if (bet.amount === 50) chipClass = 'chip-green';
        if (bet.amount === 100) chipClass = 'chip-blue';
        if (bet.amount === 500) chipClass = 'chip-purple';
        if (bet.amount === 1000) chipClass = 'chip-gold';
        if (bet.amount === 5000) chipClass = 'chip-pink';
        if (bet.amount === 10000) chipClass = 'chip-yellow';
        if (bet.amount === 50000) chipClass = 'chip-red';
        if (bet.amount === 100000) chipClass = 'chip-white';

        chipVisual.className = `table-placed-chip ${chipClass}`;
        chipVisual.id = `visual-${bet.id}`;
        chipVisual.textContent = bet.amount;

		chipVisual.style.left = `${bet.posX}px`;
		chipVisual.style.top = `${bet.posY}px`;

        table.appendChild(chipVisual);
    });

    updateTotalBetDisplay();
    updateBetSlip();
    dealerSay(dealerMessages.betPlaced);
    playSound(betSound);
}

repeatBetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    repeatLastBets();
});

table.addEventListener('click', () => {
    if (!currentTargetBet || table.classList.contains('disabled-table')) return;

if (!infiniteBankMode && balance < selectedChipValue) {
    systemLog.textContent = "Not enough chips for that bet. Try a smaller stack.";
    return;
}

if (!infiniteBankMode) {
    balance -= selectedChipValue;
    balanceDisplay.textContent = balance;
	saveBank();
}

    const existingBet = activeBets.find(b => b.id === currentTargetBet.id);

    if (existingBet) {
        existingBet.amount += selectedChipValue;
        document.getElementById(`visual-${currentTargetBet.id}`).textContent = existingBet.amount;
    } else {
        activeBets.push({
			id: currentTargetBet.id,
			type: currentTargetBet.type,
			values: currentTargetBet.values,
			amount: selectedChipValue,
			posX: currentTargetBet.posX,
			posY: currentTargetBet.posY
});

        const chipVisual = document.createElement('div');
        let chipClass = 'chip-green';

		if (selectedChipValue === 10) chipClass = 'chip-grey';
		if (selectedChipValue === 50) chipClass = 'chip-green';
		if (selectedChipValue === 100) chipClass = 'chip-blue';
		if (selectedChipValue === 500) chipClass = 'chip-purple';
		if (selectedChipValue === 1000) chipClass = 'chip-gold';
		if (selectedChipValue === 5000) chipClass = 'chip-pink';
		if (selectedChipValue === 10000) chipClass = 'chip-yellow';
		if (selectedChipValue === 50000) chipClass = 'chip-red';
		if (selectedChipValue === 100000) chipClass = 'chip-white';

chipVisual.className = `table-placed-chip ${chipClass}`;
        chipVisual.id = `visual-${currentTargetBet.id}`;
        chipVisual.textContent = selectedChipValue;
        chipVisual.style.left = `${currentTargetBet.posX}px`;
        chipVisual.style.top = `${currentTargetBet.posY}px`;
        table.appendChild(chipVisual);
    }

    updateTotalBetDisplay();
	updateBetSlip();
	playSound(betSound);
	dealerSay(dealerMessages.betPlaced);
	
});

function updateTotalBetDisplay() {
    totalBetDisplay.textContent = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
}

clearBtn.addEventListener('click', () => {
    if (table.classList.contains('disabled-table')) return;

    activeBets.forEach(bet => {
        balance += bet.amount;
    });

    document.querySelectorAll('.table-placed-chip').forEach(c => c.remove());

    activeBets = [];
    balanceDisplay.textContent = balance;
	saveBank();
    updateTotalBetDisplay();
    updateBetSlip();
    dealerSay(dealerMessages.clearBets);
	playSound(clearSound);
});

function updatePhysicsLoop() {
    wheelAngle += wheelVelocity;
    wheelAngle %= 360;
    canvas.style.transform = `rotate(${wheelAngle}deg)`;

	if (spinningLogoEnabled) {

		wheelCenterLogo.style.transform =
			`translate(-50%, -50%) rotate(${wheelAngle}deg)`;

	} else {

		wheelCenterLogo.style.transform =
			`translate(-50%, -50%) rotate(0deg)`;
	}

    if (ballStage === 'docked' || ballStage === 'idle') {
        wheelVelocity *= 0.992;
        if (wheelVelocity < 0.02) wheelVelocity = 0;
    }

    if (ballStage === 'orbiting') {
        ballAngle += ballVelocity;
        ballVelocity *= 0.985;

        if (Math.abs(ballVelocity) < 2.8) {
            ballStage = 'dropping';
        }
    } else if (ballStage === 'dropping') {
        ballAngle += ballVelocity;
        ballVelocity *= 0.94;
        ballRadius -= 2.0;

        if (ballRadius <= 112) {
            ballRadius = 112;
            ballStage = 'docked';

            let normalizedWheel = (360 - (wheelAngle % 360)) % 360;
            let normalizedBall = (ballAngle % 360 + 360) % 360;
            let hitAngleOnWheel = (normalizedBall + normalizedWheel) % 360;

            let calculatedIndex = Math.round(hitAngleOnWheel / degPerPocket) % 37;
			if (forcedNextNumber !== null) {
    calculatedIndex = rouletteNumbers.indexOf(forcedNextNumber);
    forcedNextNumber = null;
    forceNumberInput.value = '';
    adminStatus.textContent = 'Forced spin used and cleared.';
}
            winningIndex = calculatedIndex;
            targetDockOffset = calculatedIndex * degPerPocket;

            processWinnings(rouletteNumbers[winningIndex]);
        }
    } else if (ballStage === 'docked') {
        ballAngle = wheelAngle + targetDockOffset - 90;
    }

    const rads = (ballAngle * Math.PI) / 180;
    const xOffset = ballRadius * Math.cos(rads);
    const yOffset = ballRadius * Math.sin(rads);

    ballEl.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

    requestAnimationFrame(updatePhysicsLoop);
}

requestAnimationFrame(updatePhysicsLoop);

function saveBank() {
    localStorage.setItem('ultimateRoulette_bank', balance);
}

function loadSavedSettings() {

    const savedSound = localStorage.getItem('ultimateRoulette_soundEffects');
    const savedTurbo = localStorage.getItem('ultimateRoulette_turboMode');
    const savedTheme = localStorage.getItem('ultimateRoulette_theme');

	const savedBank = localStorage.getItem('ultimateRoulette_bank');

	if (savedBank !== null) {
		balance = parseInt(savedBank);
		balanceDisplay.textContent = balance;
	}

    // SOUND EFFECTS
    if (savedSound === 'off') {

        soundEffectsEnabled = false;

        soundToggleBtn.textContent = 'OFF';

        soundToggleBtn.classList.remove('option-on');
        soundToggleBtn.classList.add('option-off');
	
    }

    // TURBO MODE
    if (savedTurbo === 'on') {

        turboSpinMode = true;

        turboToggleBtn.textContent = 'ON';

        turboToggleBtn.classList.remove('option-off');
        turboToggleBtn.classList.add('option-on');

        spinBtn.textContent = 'TURBO';

    }
	
	//SPINNING lOGO
	const savedSpinningLogo =
    localStorage.getItem('ultimateRoulette_spinningLogo');

	if (savedSpinningLogo !== null) {

    spinningLogoEnabled =
        savedSpinningLogo === 'on';
}

/* =========================
   LOAD SAVED BOARD THEME
========================= */

if (savedTheme === 'classic') {

    currentTheme = 'classic';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('classic-theme');
	gameTitle.innerHTML = 'ULTIMATE ROULETTE';

    themeToggleBtn.textContent = 'CLASSIC';

    redBetLabel.textContent = 'Red';
    blackBetLabel.textContent = 'Black';

    drawRouletteWheel();

} else if (savedTheme === 'cyber-purple') {

    currentTheme = 'cyber-purple';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('purple-theme');
	setCyberTitleMarkup();

    themeToggleBtn.textContent = 'CYBER';
    themeToggleBtn.style.color = '#c86bff';
    themeToggleBtn.style.borderColor = '#c86bff';

    redBetLabel.textContent = 'Purple';
    blackBetLabel.textContent = 'Blue';

    drawRouletteWheel();

} else if (savedTheme === 'volcanic') {

    currentTheme = 'volcanic';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('volcanic-theme');
	setCyberTitleMarkup();

    themeToggleBtn.textContent = 'VOLCANIC';
    themeToggleBtn.style.color = '#ff7a00';
    themeToggleBtn.style.borderColor = '#ff7a00';

    redBetLabel.textContent = 'Fire';
	blackBetLabel.textContent = 'Ember';

    drawRouletteWheel();

} else if (savedTheme === 'frozen') {

    currentTheme = 'frozen';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('frozen-theme');
	setCyberTitleMarkup();

    themeToggleBtn.textContent = 'FROZEN';
    themeToggleBtn.style.color = '#8ff6ff';
    themeToggleBtn.style.borderColor = '#8ff6ff';

    redBetLabel.textContent = 'Ice';
    blackBetLabel.textContent = 'Frost';

    drawRouletteWheel();

} else if (savedTheme === 'royal') {

    currentTheme = 'royal';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('royal-theme');
	gameTitle.innerHTML = 'Ultimate Roulette';

    themeToggleBtn.textContent = 'ROYAL';
    themeToggleBtn.style.color = '#d4af37';
    themeToggleBtn.style.borderColor = '#b88a2b';

    redBetLabel.textContent = 'Gold';
    blackBetLabel.textContent = 'Silver';

    drawRouletteWheel();

} else if (savedTheme === 'vegas-retro') {

    currentTheme = 'vegas-retro';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
    document.body.classList.add('vegas-retro-theme');

    setVegasRetroTitleMarkup();

    themeToggleBtn.textContent = 'VEGAS';
    themeToggleBtn.style.color = '#ffcf6b';
    themeToggleBtn.style.borderColor = '#ff3b22';

    redBetLabel.textContent = 'Red';
    blackBetLabel.textContent = 'Black';

    drawRouletteWheel();
	
} else {

    currentTheme = 'cyber-green';

    document.body.classList.remove('classic-theme', 'purple-theme', 'volcanic-theme', 'frozen-theme', 'royal-theme', 'vegas-retro-theme');
	setCyberTitleMarkup();

    themeToggleBtn.textContent = 'CYBER';
    themeToggleBtn.style.color = '#39ff14';
    themeToggleBtn.style.borderColor = '#39ff14';

    drawRouletteWheel();
	
	applyDefaultThemeHandle(currentTheme);
	applyThemeOptionLocks(currentTheme);
}

}

spinBtn.addEventListener('click', () => {
    if (activeBets.length === 0) {
        dealerSay(dealerMessages.noBet);
        return;
    }

    spinBtn.disabled = true;
    clearBtn.disabled = true;
    table.classList.add('disabled-table');

    if (turboSpinMode) {
		stopSound(wheelSpinSound);

        dealerSay(dealerMessages.turboSpin);
        winNumberDisplay.textContent = "~";

        let randomIndex;

if (forcedNextNumber !== null) {
    randomIndex = rouletteNumbers.indexOf(forcedNextNumber);
    forcedNextNumber = null;
    forceNumberInput.value = '';
    adminStatus.textContent = 'Forced spin used and cleared.';
} else {
    randomIndex = Math.floor(Math.random() * rouletteNumbers.length);
}

        winningIndex = randomIndex;
        targetDockOffset = winningIndex * degPerPocket;

        wheelVelocity = 0;
        ballVelocity = 0;
        ballRadius = 112;
        ballStage = 'docked';
        ballAngle = wheelAngle + targetDockOffset - 90;

        setTimeout(() => {
            processWinnings(rouletteNumbers[winningIndex]);
        }, 450);

        return;
    }

    dealerSay(dealerMessages.spinStart);
    winNumberDisplay.textContent = "~";

    playSound(wheelSpinSound);

    ballRadius = 132;
    ballAngle = Math.random() * 360;
    ballVelocity = -12 - Math.random() * 4;

    wheelVelocity = 5 + Math.random() * 2;
    ballStage = 'orbiting';
});

function processWinnings(winningNumber) {
    stopSound(wheelSpinSound);
    let netPayout = 0;
	
	const resolvedTotalBet = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
	
	lastRoundBets = activeBets.map(bet => ({
		id: bet.id,
		type: bet.type,
		values: [...bet.values],
		amount: bet.amount,
		posX: bet.posX,
		posY: bet.posY
}));
	
    const isRed = redNumbers.includes(winningNumber);
    const isBlack = winningNumber !== 0 && !isRed;

    let calculatedCol = 0;

    if (winningNumber !== 0) {
        calculatedCol = winningNumber % 3;
        if (calculatedCol === 0) calculatedCol = 3;
    }

    activeBets.forEach(bet => {
        let isWin = false;
        let multiplier = 0;

        switch (bet.type) {
            case 'number':
            case 'split_horizontal':
            case 'split_vertical':
            case 'corner':
                if (bet.values.includes(winningNumber)) {
                    isWin = true;
                    if (bet.type === 'number') multiplier = 36;
                    if (bet.type === 'split_horizontal') multiplier = 18;
                    if (bet.type === 'split_vertical') multiplier = 18;
                    if (bet.type === 'corner') multiplier = 9;
                }
                break;

            case 'color':
                if (bet.values[0] === 'red' && isRed) {
                    isWin = true;
                    multiplier = 2;
                }

                if (bet.values[0] === 'black' && isBlack) {
                    isWin = true;
                    multiplier = 2;
                }
                break;

            case 'evenodd':
                if (winningNumber !== 0) {
                    if (bet.values[0] === 'even' && winningNumber % 2 === 0) {
                        isWin = true;
                        multiplier = 2;
                    }

                    if (bet.values[0] === 'odd' && winningNumber % 2 !== 0) {
                        isWin = true;
                        multiplier = 2;
                    }
                }
                break;

            case 'lowhigh':
                if (winningNumber !== 0) {
                    if (bet.values[0] === 'low' && winningNumber <= 18) {
                        isWin = true;
                        multiplier = 2;
                    }

                    if (bet.values[0] === 'high' && winningNumber >= 19) {
                        isWin = true;
                        multiplier = 2;
                    }
                }
                break;

            case 'dozen':
                if (winningNumber !== 0) {
                    if (bet.values[0] === '1' && winningNumber <= 12) {
                        isWin = true;
                        multiplier = 3;
                    }

                    if (bet.values[0] === '2' && winningNumber > 12 && winningNumber <= 24) {
                        isWin = true;
                        multiplier = 3;
                    }

                    if (bet.values[0] === '3' && winningNumber > 24) {
                        isWin = true;
                        multiplier = 3;
                    }
                }
                break;

            case 'column':
                if (winningNumber !== 0 && calculatedCol === parseInt(bet.values[0])) {
                    isWin = true;
                    multiplier = 3;
                }
                break;
        }

        if (isWin) {
            netPayout += bet.amount * multiplier;
        }
    });

    balance += netPayout;
		winNumberDisplay.textContent = winningNumber;
		winNumberDisplay.classList.remove(
			'vegas-red-win',
			'vegas-black-win',
			'vegas-zero-win',
			'classic-red-win',
			'classic-black-win',
			'classic-zero-win',
			'frozen-zero-win'
	);
	
// CLASSIC WINNING NUMBER DISPLAY COLORS
if (document.body.classList.contains('classic-theme')) {
    winNumberDisplay.style.color = '';
    winNumberDisplay.style.textShadow = '';

    if (winningNumber === 0) {
        playSound(zeroHitSound);
        winNumberDisplay.classList.add('classic-zero-win');
    } else if (redNumbers.includes(winningNumber)) {
        winNumberDisplay.classList.add('classic-red-win');
    } else {
        winNumberDisplay.classList.add('classic-black-win');
    }

} else if (document.body.classList.contains('vegas-retro-theme')) {
    winNumberDisplay.style.color = '';
    winNumberDisplay.style.textShadow = '';

    if (winningNumber === 0) {
        playSound(zeroHitSound);
        winNumberDisplay.classList.add('vegas-zero-win');
    } else if (redNumbers.includes(winningNumber)) {
        winNumberDisplay.classList.add('vegas-red-win');
    } else {
        winNumberDisplay.classList.add('vegas-black-win');
    }

} else if (document.body.classList.contains('frozen-theme') && winningNumber === 0) {
    playSound(zeroHitSound);
    winNumberDisplay.style.color = '';
    winNumberDisplay.style.textShadow = '';
    winNumberDisplay.classList.add('frozen-zero-win');

} else if (winningNumber === 0) {
    playSound(zeroHitSound);
    winNumberDisplay.style.color = '#ffd700';
    winNumberDisplay.style.textShadow = '0 0 8px #ffd700';

} else if (redNumbers.includes(winningNumber)) {

    if (document.body.classList.contains('volcanic-theme')) {
        winNumberDisplay.style.color = '#ff7a00';
        winNumberDisplay.style.textShadow = '0 0 8px #ff7a00';
    } else if (document.body.classList.contains('purple-theme')) {
        winNumberDisplay.style.color = '#c86bff';
        winNumberDisplay.style.textShadow = '0 0 8px #c86bff';
    } else if (document.body.classList.contains('frozen-theme')) {
        winNumberDisplay.style.color = '#8ff6ff';
        winNumberDisplay.style.textShadow = '0 0 8px #8ff6ff';
    } else if (document.body.classList.contains('royal-theme')) {
        winNumberDisplay.style.color = '#d4af37';
        winNumberDisplay.style.textShadow = '0 0 6px rgba(212,175,55,0.65)';
    } else {
        winNumberDisplay.style.color = '#39ff14';
        winNumberDisplay.style.textShadow = '0 0 8px #39ff14';
    }

} else {

    if (document.body.classList.contains('frozen-theme')) {
        winNumberDisplay.style.color = '#d8fbff';
        winNumberDisplay.style.textShadow = '0 0 8px #d8fbff';

    } else if (document.body.classList.contains('royal-theme')) {
        winNumberDisplay.style.color = '#f5df9b';
        winNumberDisplay.style.textShadow = 'none';

    } else if (document.body.classList.contains('volcanic-theme')) {
        winNumberDisplay.style.color = '#ffcf75';
        winNumberDisplay.style.textShadow = '0 0 8px #ffcf75';

    } else {
        winNumberDisplay.style.color = '#50dcff';
        winNumberDisplay.style.textShadow = '0 0 8px #50dcff';
    }
}

    updateSpinHistory(winningNumber);

	addBetHistoryEntry(resolvedTotalBet, netPayout);

if (netPayout > 0) {

    playSound(winPaidSound);

    const message = dealerMessages.win[Math.floor(Math.random() * dealerMessages.win.length)]
        .replaceAll('WINNING_NUMBER', winningNumber)
        .replaceAll('PAYOUT', netPayout);

    systemLog.innerHTML = message;
} else {
    const message = dealerMessages.loss[Math.floor(Math.random() * dealerMessages.loss.length)]
        .replaceAll('WINNING_NUMBER', winningNumber);

    systemLog.innerHTML = message;
}

    document.querySelectorAll('.table-placed-chip').forEach(chip => chip.remove());

    activeBets = [];
    balanceDisplay.textContent = balance;
	saveBank();
    totalBetDisplay.textContent = 0;
    updateBetSlip();

    spinBtn.disabled = false;
    clearBtn.disabled = false;
    table.classList.remove('disabled-table');

    if (balance <= 0) {
        systemLog.innerHTML = "<span style='color:#ff4444; font-weight:bold;'>You’re out of chips. The table is closed.</span>";
        spinBtn.disabled = true;
    }
}

document.querySelectorAll('.chip-node').forEach(chip => {
    chip.addEventListener('click', () => {
        if (table.classList.contains('disabled-table')) return;

        document.querySelector('.chip-node.selected').classList.remove('selected');
        chip.classList.add('selected');
        selectedChipValue = parseInt(chip.dataset.value);
    });
});

loadSavedSettings();
loadSavedSpinHistory();
loadSavedBetHistory();

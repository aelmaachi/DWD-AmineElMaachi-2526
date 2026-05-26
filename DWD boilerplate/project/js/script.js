// ===============================
// 1. CONSTANTS AND VARIABLES
// ===============================

// Vervang deze tekst door jouw eigen Freesound API key.
const API_KEY = "PLAK_HIER_JE_API_KEY";

// Freesound API endpoint voor text search.
const API_URL = "https://freesound.org/apiv2/search/text/";

// DOM elementen
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#searchInput");
const message = document.querySelector(".message");
const resultsContainer = document.querySelector(".results-container");
const dashboardContainer = document.querySelector(".dashboard-container");
const volumeSlider = document.querySelector("#volumeSlider");
const randomButton = document.querySelector(".random-button");

// Variabelen voor audio en dashboard
let dashboardSounds = [];
let currentAudio = null;
let currentPlayingId = null;


// ===============================
// 2. FUNCTION DECLARATIONS
// ===============================

function showMessage(text) {
    message.textContent = text;
}

function formatDuration(seconds) {
    return `${Math.round(seconds)} sec`;
}

function getPreviewUrl(sound) {
    if (sound.previews["preview-hq-mp3"]) {
        return sound.previews["preview-hq-mp3"];
    }

    return sound.previews["preview-lq-mp3"];
}

function getWaveformUrl(sound) {
    if (sound.images && sound.images.waveform_m) {
        return sound.images.waveform_m;
    }

    return "";
}

function createSoundObject(sound) {
    return {
        id: sound.id,
        name: sound.name,
        username: sound.username,
        duration: sound.duration,
        previewUrl: getPreviewUrl(sound),
        waveformUrl: getWaveformUrl(sound)
    };
}

async function searchSounds(keyword) {
    const fields = "id,name,username,duration,previews,images";

    const url = `${API_URL}?query=${encodeURIComponent(keyword)}&fields=${fields}&page_size=9&token=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("De API request is mislukt.");
    }

    const data = await response.json();

    return data.results;
}

function renderSearchResults(sounds) {
    resultsContainer.innerHTML = "";

    if (sounds.length === 0) {
        resultsContainer.innerHTML = `<p class="empty-state">Geen resultaten gevonden.</p>`;
        return;
    }

    for (const sound of sounds) {
        const soundObject = createSoundObject(sound);
        const soundCard = createSoundCard(soundObject, "result");

        resultsContainer.appendChild(soundCard);
    }
}

function renderDashboard() {
    dashboardContainer.innerHTML = "";

    if (dashboardSounds.length === 0) {
        dashboardContainer.innerHTML = `<p class="empty-state">Je dashboard is nog leeg.</p>`;
        return;
    }

    for (const sound of dashboardSounds) {
        const soundCard = createSoundCard(sound, "dashboard");

        dashboardContainer.appendChild(soundCard);
    }
}

function createSoundCard(sound, type) {
    const article = document.createElement("article");
    article.classList.add("sound-card");
    article.dataset.id = sound.id;

    if (currentPlayingId === sound.id) {
        article.classList.add("playing");
    }

    article.innerHTML = `
        <h3>${sound.name}</h3>

        ${
            sound.waveformUrl
                ? `<img class="waveform" src="${sound.waveformUrl}" alt="Waveform van ${sound.name}">`
                : `<div class="waveform"></div>`
        }

        <p>Maker: ${sound.username}</p>
        <p>Duur: ${formatDuration(sound.duration)}</p>

        <div class="button-row">
            <button class="play-button" type="button">Play</button>
            ${
                type === "result"
                    ? `<button class="add-button secondary-button" type="button">Toevoegen</button>`
                    : `<button class="remove-button danger-button" type="button">Verwijderen</button>`
            }
        </div>
    `;

    const playButton = article.querySelector(".play-button");
    playButton.addEventListener("click", function () {
        handlePlayButton(sound);
    });

    if (type === "result") {
        const addButton = article.querySelector(".add-button");
        addButton.addEventListener("click", function () {
            addSoundToDashboard(sound);
        });
    }

    if (type === "dashboard") {
        const removeButton = article.querySelector(".remove-button");
        removeButton.addEventListener("click", function () {
            removeSoundFromDashboard(sound.id);
        });
    }

    return article;
}

function handlePlayButton(sound) {
    // Als hetzelfde geluid opnieuw wordt aangeklikt, stoppen we het.
    if (currentPlayingId === sound.id) {
        stopCurrentAudio();
        return;
    }

    // Als er al een ander geluid speelt, stoppen we dat eerst.
    stopCurrentAudio();

    currentAudio = new Audio(sound.previewUrl);
    currentAudio.volume = Number(volumeSlider.value);
    currentPlayingId = sound.id;

    currentAudio.play();

    currentAudio.addEventListener("ended", function () {
        currentPlayingId = null;
        updatePlayingStyle();
    });

    updatePlayingStyle();
}

function stopCurrentAudio() {
    if (currentAudio !== null) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = null;
    currentPlayingId = null;

    updatePlayingStyle();
}

function updatePlayingStyle() {
    const soundCards = document.querySelectorAll(".sound-card");

    for (const card of soundCards) {
        const cardId = Number(card.dataset.id);

        if (cardId === currentPlayingId) {
            card.classList.add("playing");
        } else {
            card.classList.remove("playing");
        }
    }
}

function addSoundToDashboard(sound) {
    const alreadyExists = dashboardSounds.some(function (dashboardSound) {
        return dashboardSound.id === sound.id;
    });

    if (alreadyExists) {
        showMessage("Dit geluid staat al op je dashboard.");
        return;
    }

    dashboardSounds.push(sound);
    saveDashboardToStorage();
    renderDashboard();

    showMessage("Geluid toegevoegd aan je dashboard.");
}

function removeSoundFromDashboard(soundId) {
    if (currentPlayingId === soundId) {
        stopCurrentAudio();
    }

    dashboardSounds = dashboardSounds.filter(function (sound) {
        return sound.id !== soundId;
    });

    saveDashboardToStorage();
    renderDashboard();

    showMessage("Geluid verwijderd uit je dashboard.");
}

function saveDashboardToStorage() {
    const dashboardJson = JSON.stringify(dashboardSounds);

    localStorage.setItem("dashboardSounds", dashboardJson);
}

function loadDashboardFromStorage() {
    const dashboardJson = localStorage.getItem("dashboardSounds");

    if (dashboardJson !== null) {
        dashboardSounds = JSON.parse(dashboardJson);
    }

    renderDashboard();
}

function playRandomDashboardSound() {
    if (dashboardSounds.length === 0) {
        showMessage("Je dashboard is leeg. Voeg eerst een geluid toe.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * dashboardSounds.length);
    const randomSound = dashboardSounds[randomIndex];

    handlePlayButton(randomSound);
}


// ===============================
// 3. EVENT HANDLERS
// ===============================

async function handleSearchSubmit(event) {
    event.preventDefault();

    const keyword = searchInput.value.trim();

    if (keyword === "") {
        showMessage("Geef eerst een zoekterm in.");
        return;
    }

    if (API_KEY === "PLAK_HIER_JE_API_KEY") {
        showMessage("Vul eerst je Freesound API key in script.js in.");
        return;
    }

    showMessage("Geluiden worden opgehaald...");
    resultsContainer.innerHTML = "";

    try {
        const sounds = await searchSounds(keyword);

        renderSearchResults(sounds);
        showMessage(`${sounds.length} resultaten gevonden.`);
    } catch (error) {
        showMessage("Er ging iets mis bij het ophalen van de geluiden.");
        console.error(error);
    }
}

function handleVolumeChange() {
    if (currentAudio !== null) {
        currentAudio.volume = Number(volumeSlider.value);
    }
}


// ===============================
// 4. EVENT LISTENERS / INIT
// ===============================

searchForm.addEventListener("submit", handleSearchSubmit);
volumeSlider.addEventListener("input", handleVolumeChange);
randomButton.addEventListener("click", playRandomDashboardSound);

loadDashboardFromStorage();

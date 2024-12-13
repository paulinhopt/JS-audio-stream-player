let lowQualityStream = "https://app.radioforrotradicional.com.br/listen/radioforrotradicional/AACLD";
let highQualityStream = "https://app.radioforrotradicional.com.br/listen/radioforrotradicional/AACHD";
let nowPlaying = "https://app.radioforrotradicional.com.br/api/nowplaying/1";

// Function to add a random query parameter to prevent caching issues
function getNewRandomizedLink(linkStream) {
    return `${linkStream}?${Date.now()}`; // Changed to Date.now() for better uniqueness and readability
}

const checkBox = document.getElementById("quality");
const loader = document.getElementById('loader');
const audio = document.getElementById('audio');
audio.preload = 'auto'; // Preload attribute for better buffering

// Show loader when audio is loading
audio.addEventListener('loadstart', () => {
    if (audio.src !== "about:blank") {
        loader.style.visibility = "visible";
    }
});

// Hide loader when audio starts playing
audio.addEventListener('playing', () => {
    loader.style.visibility = "hidden";
});

// Event to monitor buffering progress and ensure adequate buffer
audio.addEventListener('progress', () => {
    const buffered = audio.buffered;
    if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const duration = audio.duration;
        if (duration - bufferedEnd < 10) {
            console.log("Buffering adequate");
        }
    }
});

// Function to set volume based on input slider value
window.SetVolume = function (val) {
    audio.volume = val / 100;
};

// Handle play/pause button click
document.getElementById('aroundbutton').addEventListener('click', () => {
    const playButton = document.getElementById("on");
    if (audio.paused) {
        startStream(); // Start the stream when audio is paused
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
    } else {
        stopStream(); // Stop the stream when audio is playing
        playButton.classList.remove("fa-pause");
        playButton.classList.add("fa-play");
    }
});

// Change event for quality checkbox to restart the stream with the selected quality
checkBox.addEventListener('change', () => {
    startStream();
});

// Function to start the audio stream with the selected quality
function startStream() {
    const selectedStream = checkBox.checked ? highQualityStream : lowQualityStream; // Check quality selection
    if (audio.src !== selectedStream) { // Prevent unnecessary reloading if the source hasn't changed
        audio.src = getNewRandomizedLink(selectedStream); // Add randomized query to prevent caching
        audio.load(); // Load the audio stream
        audio.play().catch(error => {
            console.error("Playback failed: ", error); // Handle playback errors
        });
    }
}

// Function to stop the audio stream
function stopStream() {
    audio.pause();
    audio.src = "about:blank"; // Reset audio source to avoid cache issues
}

// Function to fetch and display currently playing song details
function whatIsPlaying() {
    fetch(nowPlaying) // Changed to Fetch API for better performance and readability
        .then(response => response.json())
        .then(data => {
            const songData = data.now_playing.song;
            document.getElementById('songs').textContent = songData.title;
            document.getElementById('artist').textContent = songData.artist;
            document.getElementById('capa').src = songData.art;
            document.title = `${songData.artist} - ${songData.title} | Rádio Forró Tradicional`;
        })
        .catch(error => console.error("Failed to fetch song details: ", error));
}

// Initial fetch of currently playing song
whatIsPlaying();
setInterval(whatIsPlaying, 10000); // Reduced interval to 10 seconds for more frequent updates

// Reset play button when manually stopped
document.getElementById('on').addEventListener('click', () => {
    const playButton = document.getElementById("on");
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
});

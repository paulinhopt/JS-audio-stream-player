// URL dos streams e dos metadados
let lowQualityStream = "https://app.radioforrotradicional.com.br/listen/radioforrotradicional/AACLD";
let highQualityStream = "https://app.radioforrotradicional.com.br/listen/radioforrotradicional/AACHD";
let nowPlaying = "https://app.radioforrotradicional.com.br/api/nowplaying/1";

// Função para adicionar um parâmetro aleatório e evitar cache
function getNewRandomizedLink(linkStream) {
    return `${linkStream}?${Date.now()}`;
}

const checkBox = document.getElementById("quality");
const loader = document.getElementById('loader');
const audio = document.getElementById('audio');
audio.preload = 'auto';

// Mostrar o loader enquanto o áudio está carregando
audio.addEventListener('loadstart', () => {
    if (audio.src !== "about:blank") {
        loader.style.visibility = "visible";
    }
});

// Ocultar o loader quando o áudio começar a tocar
audio.addEventListener('playing', () => {
    loader.style.visibility = "hidden";
});

// Função para ajustar o volume
window.SetVolume = function (val) {
    audio.volume = val / 100;
};

// Lidar com o botão de play/pause
document.getElementById('aroundbutton').addEventListener('click', () => {
    const playButton = document.getElementById("on");
    if (audio.paused) {
        startStream();
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
    } else {
        stopStream();
        playButton.classList.remove("fa-pause");
        playButton.classList.add("fa-play");
    }
});

// Alterar a qualidade do stream
checkBox.addEventListener('change', () => {
    startStream();
});

// Iniciar o stream com a qualidade selecionada
function startStream() {
    const selectedStream = checkBox.checked ? highQualityStream : lowQualityStream;
    if (audio.src !== selectedStream) {
        audio.src = getNewRandomizedLink(selectedStream);
        audio.load();
        audio.play().catch(error => {
            console.error("Playback failed: ", error);
        });
    }
}

// Parar o stream
function stopStream() {
    audio.pause();
    audio.src = "about:blank";
}

// Atualizar Media Session API
function updateMediaSession(songData) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songData.title,
            artist: songData.artist,
            album: "Rádio Forró Tradicional",
            artwork: [
                { src: songData.art, sizes: '96x96', type: 'image/png' },
                { src: songData.art, sizes: '128x128', type: 'image/png' },
                { src: songData.art, sizes: '192x192', type: 'image/png' },
                { src: songData.art, sizes: '256x256', type: 'image/png' },
                { src: songData.art, sizes: '384x384', type: 'image/png' },
                { src: songData.art, sizes: '512x512', type: 'image/png' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => audio.play());
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('stop', () => stopStream());
    }
}

// Buscar e exibir informações do que está tocando
function whatIsPlaying() {
    fetch(nowPlaying)
        .then(response => response.json())
        .then(data => {
            const songData = data.now_playing.song;
            document.getElementById('songs').textContent = songData.title;
            document.getElementById('artist').textContent = songData.artist;
            document.getElementById('capa').src = songData.art;
            document.title = `${songData.artist} - ${songData.title} | Rádio Forró Tradicional`;

            // Atualizar Media Session
            updateMediaSession(songData);
        })
        .catch(error => console.error("Failed to fetch song details: ", error));
}

// Inicializar informações do stream
whatIsPlaying();
setInterval(whatIsPlaying, 10000);

// Resetar o botão de play quando parado manualmente
document.getElementById('on').addEventListener('click', () => {
    const playButton = document.getElementById("on");
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
});

// Get the modal
var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");

// Get the button that opens the modal
var btn1 = document.getElementById("myBtn1");
var btn2 = document.getElementById("myBtn2");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close1")[0];
var span2 = document.getElementsByClassName("close2")[0];

// When the user clicks on the button, open the modal
btn1.onclick = function () {
    modal1.style.display = "block";
}

btn2.onclick = function () {
    modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function () {
    modal1.style.display = "none";
}
span2.onclick = function () {
    modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}





let lowQualityStream = "https://app.radioforrotradicional.com.br/listen/radioforrotradicional/AAC";
let highQualityStream = "https://app.radioforrotradicional.com.br/listen/radioforrotradicional/AAC";
let nowPlaying = "https://app.radioforrotradicional.com.br/api/nowplaying/1";

// this is done to fix caching issues
function getNewRandomizedLink(linkStream){
    return linkStream + "?" + Math.floor((Math.random() * 10000) + 1);
}

// check for which audio quality to load
var checkBox = document.getElementById("quality");
const radioSource = getNewRandomizedLink(highQualityStream);
const resetAudio = "about:blank";
const loader = document.getElementById('loader');
const audio = document.getElementById('audio');

// set initial volume var
window.SetVolume = function(val) {
    var player = document.getElementById('audio');
    player.volume = val / 100;
}

audio.addEventListener('loadstart', () => {
  if (audio.src !== resetAudio) {
    loader.style.visibility = "visible";
  }
});

audio.addEventListener('playing', () => {
  loader.style.visibility = "hidden";
});

// if cliked the play button start the stream
document.getElementById('aroundbutton').addEventListener('click', (evt) => {
  var element = document.getElementById("on");
  if(audio.paused){
    audio.src = resetAudio;
    audio.pause();
    audio.src = radioSource;
    audio.load();
    audio.play();
    element.classList.remove("fa-play");
    element.classList.add("fa-pause");
    checkBox.checked = true;
  } else {
    element.classList.remove("fa-pause");
    element.classList.add("fa-play");
    audio.src = resetAudio;
    audio.pause();
    }
 })

 // triggered by clicking quality choice button
function check(){
    if (checkBox.checked) {
        const radioSource = getNewRandomizedLink(highQualityStream);
        const resetAudio = "about:blank";
        var element = document.getElementById("on");
        audio.src = resetAudio;
        audio.pause();
        audio.src = radioSource;
        audio.load();
        audio.play();
        element.classList.remove("fa-play");
        element.classList.add("fa-pause");
   } else {
     const radioSource = getNewRandomizedLink(highQualityStream);
     const resetAudio = "about:blank";
       var element = document.getElementById("on");
       audio.src = resetAudio;
       audio.pause();
       audio.src = radioSource;
       audio.load();
       audio.play();
       element.classList.remove("fa-play");
       element.classList.add("fa-pause");
  }
}

// json parser for current playing song and artist
// replace with a more relevant parser if needed
function whatIsPlaying() {
    var url = nowPlaying;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var response = JSON.parse(xmlHttp.responseText).now_playing.song;
            document.getElementById('songs').innerHTML = response.title;
            document.getElementById('artist').innerHTML = response.artist;
            document.getElementById('capa').src = response.art;
            window.document.title = response.artist + " - " + response.title + " | Rádio Forró Tradicional";
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

whatIsPlaying(); // auto refresh currently playing song. Consider drawback of frequent updates
setInterval(whatIsPlaying, 15000);

document.getElementById('on').addEventListener('click', (evt) => {
    var element = document.getElementById("on");
    element.classList.remove("fa-pause");
    element.classList.add("fa-play");
})

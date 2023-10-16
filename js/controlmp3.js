
//getID
const mysong = document.getElementById("mysong");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const songTitleElement = document.getElementById("songTitle");
const songAlbumElement = document.getElementById("songAlbum");
const artSong = document.querySelector(".album-art");

// Manejadores de eventos para los botones
playButton.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", playNextSong);
prevButton.addEventListener("click", playPrevSong);


// Variables para rastrear el estado de reproducción
let isPlaying = false;
let currentSongIndex = 0;

loadSong(currentSongIndex);

// PAUSE / PLAY
function togglePlayPause() {
    if (isPlaying) {
        mysong.pause();
        playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        mysong.play();
        playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// NEXT
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % allMusic.length;
    loadSong(currentSongIndex);
    mysong.play();

}

// PREV
function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + allMusic.length) % allMusic.length;
    loadSong(currentSongIndex);
    mysong.play();
}

// LoadSong
function loadSong(index) {
    const song = allMusic[index];
    mysong.src = `songs/${song.src}.mp3`;
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    isPlaying = false;
    console.log(`Play: ${song.name}`);

    //update DataSong
    songTitleElement.innerHTML = `<span><i class="fa-solid fa-music" style="color: #ffffff;"></i></span>${song.name}`;
    songAlbumElement.innerHTML = `<span><i class="fa-solid fa-compact-disc" style="color: #ffffff;"></i></span>${song.disc}`;
    artSong.style.backgroundImage = `url('DiscArt/${song.art}')`;

}




//getID
const mysong = document.getElementById("mysong");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const songTitleElement = document.getElementById("songTitle");
const songAlbumElement = document.getElementById("songAlbum");
const artSong = document.querySelector(".album-art");
const downloadButton = document.getElementById("downloadButton");

// Variables para rastrear el estado de reproducción
let isPlaying = false;
let currentSongIndex = 0;

// CallFunction´s
loadSong(currentSongIndex);
playButton.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", playNextSong);
prevButton.addEventListener("click", playPrevSong);

mysong.addEventListener('ended', function () {
    playNextSong();
    togglePlayPause();
});

//DOMException Fixed
mysong.addEventListener('error', function () {

    mysong.load();
    mysong.play();
    togglePlayPause();
});

//DonwloadMp3
downloadButton.addEventListener("click", () => {

    // checkArray
    const currentSong = allMusic[currentSongIndex];
    const downloadLink = document.createElement("a");

    // downloadAndCleanLink
    downloadLink.href = `songs/${currentSong.src}.mp3`;
    downloadLink.download = `${currentSong.name}.mp3`;
    downloadLink.click();
    downloadLink.remove();
});

// PAUSE / PLAY
function togglePlayPause() {
    if (mysong.paused) {
        mysong.play().catch(function (error) {
            console.error("Error al reproducir el audio:", error);
        });
        playButton.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
    } else {
        mysong.pause();
        playButton.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
    }
}

// NEXT
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % allMusic.length;
    loadSong(currentSongIndex);
}

// PREV
function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + allMusic.length) % allMusic.length;
    loadSong(currentSongIndex);
}

// LoadSong
function loadSong(index) {

    //CHECK MUSIC
    const song = allMusic[index];
    const wasPlaying = !mysong.paused;
    mysong.src = `songs/${song.src}.mp3`;
    isPlaying = wasPlaying; 

    //Dont STOP MUSIC
    if (isPlaying) {
        mysong.play().catch(function (error) {
            console.error("Error al reproducir el audio:", error);
        });
    }

    //Update DataSong
    songTitleElement.innerHTML = `<span><i class="fa-solid fa-music" style="color: #ffffff;"></i></span>${song.name}`;
    songAlbumElement.innerHTML = `<span><i class="fa-solid fa-compact-disc" style="color: #ffffff;"></i></span>${song.disc}`;
    playButton.innerHTML = isPlaying ? '<i class="fa-regular fa-circle-pause"></i>' : '<i class="fa-regular fa-circle-play"></i>';
    artSong.style.backgroundImage = `url('DiscArt/${song.art}')`;

    //PRINT TERMINAL <--PLAY:SONG-->
    console.log(`Play: ${song.name}`);
}


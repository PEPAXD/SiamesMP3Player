
//getID
const mysong = document.getElementById("mysong");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const songTitleElement = document.getElementById("songTitle");
const songAlbumElement = document.getElementById("songAlbum");
const artSong = document.querySelector(".album-art");
const downloadButton = document.getElementById("downloadButton");
const songCountButton = document.getElementById("songCount");
const timeCountElement = document.getElementById("timeCount");
const progressBar = document.getElementById("progressBar");
const volumeControl = document.getElementById("volumeControl");
const volMinIcon = document.querySelector('.volMin');

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

// SongTime
mysong.addEventListener("timeupdate", updateCurrentTime);

// ProgressBar
mysong.addEventListener("timeupdate", updateProgressBar);
progressBar.addEventListener("input", handleProgressBarChange);

//volBar
volumeControl.addEventListener("input", () => {
    const volume = volumeControl.value;
    mysong.volume = volume;
    document.documentElement.style.setProperty('--volume', volume * 100 + '%');
    updateVolumeIcon();
});
mysong.volume = volumeControl.value;

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

volMinIcon.addEventListener('click', () => {
    if (mysong.volume === 0) {
        // muted off
        const savedVolume = volumeControl.getAttribute("data-css");
        mysong.volume = savedVolume;
        volumeControl.value = savedVolume;
        volumeControl.classList.remove('muted');
        volumeControl.classList.remove('disabled');
        document.documentElement.style.setProperty('--volume', savedVolume * 100 + '%');
    } else {
        // muted on
        mysong.volume = 0;
        volumeControl.setAttribute("data-css", volumeControl.value);
        volumeControl.value = 0;
        volumeControl.classList.add('muted');
        volumeControl.classList.add('disabled');
        document.documentElement.style.setProperty('--volume', '0%');
    }
    updateVolumeIcon(); //updataVol
});

// maxVol
mysong.volume = 1.0;
volumeControl.value = 1.0;
document.documentElement.style.setProperty('--volume', '100%');
updateVolumeIcon();

function updateVolumeIcon() {
    const volMinButton = document.querySelector('.volMin');
    const volumeIcon = volMinButton.querySelector('i');
    const volumeControl = document.getElementById('volumeControl');

    if (volumeControl.value == 0) {
        volumeIcon.className = 'fas fa-volume-xmark';
    } else if (volumeControl.value <= 0.2) {
        volumeIcon.className = 'fas fa-volume-off';
    } else if (volumeControl.value <= 0.5) {
        volumeIcon.className = 'fas fa-volume-low';
    } else {
        volumeIcon.className = 'fas fa-volume-high';
    }
}


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
    songTitleElement.innerHTML = `<span>${song.name}</span>`;
    songAlbumElement.innerHTML = `<span>${song.disc}</span>`;
    playButton.innerHTML = isPlaying ? '<i class="fa-regular fa-circle-pause"></i>' : '<i class="fa-regular fa-circle-play"></i>';
    artSong.style.backgroundImage = `url('DiscArt/${song.art}')`;
    updateSongCount();
    

    //PRINT TERMINAL <--PLAY:SONG-->
    //console.log(`Play: ${song.name}`);
    printFavoriteSongs()
}

function printFavoriteSongs() {
    console.log('Lista de canciones favoritas:', favoriteSongs);
}

//PrintLengthArray
function updateSongCount() {
    const totalSongs = allMusic.length;
    songCountButton.textContent = `${currentSongIndex + 1}/${totalSongs}`;
}

//formatTime [mm:ss]
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
}

//ProgressBar Control
function handleProgressBarChange() {
    const duration = mysong.duration;
    const newPosition = (progressBar.value / 100) * duration;
    mysong.currentTime = newPosition;
}

function updateProgressBar() {
    const currentTime = mysong.currentTime;
    const duration = mysong.duration;

    if (!isNaN(currentTime) && !isNaN(duration)) {
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        progressBar.style.setProperty('--progress', `${progress}%`);
    }
}

//CurrentSongTime
function updateCurrentTime() {
    //CheckDataTime
    const currentTimeElement = document.querySelector(".currentTime .start");
    const endTimeElement = document.querySelector(".currentTime .end");
    const duration = mysong.duration;
    const currentTime = mysong.currentTime;
    const timeBar = document.getElementById("timeBar");

    //UpdateTime
    if (isNaN(currentTime) || isNaN(duration)) {
        currentTimeElement.textContent = '0:00';
        endTimeElement.textContent = '0:00';
    } else {
        currentTimeElement.textContent = formatTime(currentTime);
        endTimeElement.textContent = formatTime(duration);
    }
}
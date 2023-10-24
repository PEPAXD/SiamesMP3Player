// get ID
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

// checkPlayingSong
let isPlaying = false;
let currentSongIndex = 0;

// VolMax
mysong.volume = 1.0;
volumeControl.value = 1.0;
document.documentElement.style.setProperty('--volume', '100%');
updateVolumeIcon();

// callLoadSong
loadSong(currentSongIndex);

// clickEvents
playButton.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", playNextSong);
prevButton.addEventListener("click", playPrevSong);
progressBar.addEventListener("input", handleProgressBarChange);
volumeControl.addEventListener("input", handleVolumeControlChange);
downloadButton.addEventListener("click", downloadCurrentSong);
volMinIcon.addEventListener('click', toggleMute);

mysong.addEventListener('ended', function () {
    playNextSong();
});

mysong.addEventListener("timeupdate", function () {
    updateCurrentTime();
    updateProgressBar();
});

function updateVolumeIcon() {
    const volumeIcon = volMinIcon.querySelector('i');

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

function togglePlayPause() {
    if (mysong.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function playSong() {
    mysong.play().catch(function (error) {
        console.error("Error al reproducir el audio:", error);
    });
    playButton.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
    isPlaying = true;
}

function pauseSong() {
    mysong.pause();
    playButton.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
    isPlaying = false;
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % allMusic.length;
    loadSong(currentSongIndex);
    playSong();
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + allMusic.length) % allMusic.length;
    loadSong(currentSongIndex);
    playSong();
}

function loadSong(index) {
    const song = allMusic[index];
    const wasPlaying = isPlaying;

    mysong.src = `songs/${song.src}.mp3`;
    isPlaying = wasPlaying;

    if (isPlaying) {
        playSong();
    }

    songTitleElement.innerHTML = `<span>${song.name}</span>`;
    songAlbumElement.innerHTML = `<span>${song.disc}</span>`;
    playButton.innerHTML = isPlaying ? '<i class="fa-regular fa-circle-pause"></i>' : '<i class="fa-regular fa-circle-play"></i>';
    artSong.style.backgroundImage = `url('DiscArt/${song.art}')`;
    updateSongCount();
    
}

function updateSongCount() {
    const totalSongs = allMusic.length;
    songCountButton.textContent = `${currentSongIndex + 1}/${totalSongs}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
}

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

function updateCurrentTime() {
    const currentTimeElement = document.querySelector(".currentTime .start");
    const endTimeElement = document.querySelector(".currentTime .end");
    const duration = mysong.duration;
    const currentTime = mysong.currentTime;

    if (isNaN(currentTime) || isNaN(duration)) {
        currentTimeElement.textContent = '0:00';
        endTimeElement.textContent = '0:00';
    } else {
        currentTimeElement.textContent = formatTime(currentTime);
        endTimeElement.textContent = formatTime(duration);
    }
}

function handleVolumeControlChange() {
    const volume = volumeControl.value;
    mysong.volume = volume;
    document.documentElement.style.setProperty('--volume', volume * 100 + '%');
    updateVolumeIcon();
}

function toggleMute() {
    if (mysong.volume === 0) {
        unmuteSong();
    } else {
        muteSong();
    }
}

function muteSong() {
    mysong.volume = 0;
    volumeControl.setAttribute("data-css", volumeControl.value);
    volumeControl.value = 0;
    volumeControl.classList.add('muted');
    volumeControl.classList.add('disabled');
    document.documentElement.style.setProperty('--volume', '0%');
    updateVolumeIcon();
}

function unmuteSong() {
    const savedVolume = volumeControl.getAttribute("data-css");
    mysong.volume = savedVolume;
    volumeControl.value = savedVolume;
    volumeControl.classList.remove('muted');
    volumeControl.classList.remove('disabled');
    document.documentElement.style.setProperty('--volume', savedVolume * 100 + '%');
    updateVolumeIcon();
}

function downloadCurrentSong() {
    const currentSong = allMusic[currentSongIndex];
    const downloadLink = document.createElement("a");
    downloadLink.href = `songs/${currentSong.src}.mp3`;
    downloadLink.download = `${currentSong.name}.mp3`;
    downloadLink.click();
    downloadLink.remove();
}

function printFavoriteSongs() {
    console.log('Lista de canciones favoritas:', favoriteSongs);
}

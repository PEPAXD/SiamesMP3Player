    const player = {
        mysong: document.getElementById("mysong"),
        songCountButton: document.getElementById("songCount"),
        playButton: document.getElementById("playButton"),
        nextButton: document.getElementById("nextButton"),
        prevButton: document.getElementById("prevButton"),
        songTitleElement: document.getElementById("songTitle"),
        songAlbumElement: document.getElementById("songAlbum"),
        artSong: document.querySelector(".album-art"),
        downloadButton: document.getElementById("downloadButton"),
        timeCountElement: document.getElementById("timeCount"),
        progressBar: document.getElementById("progressBar"),
        volumeControl: document.getElementById("volumeControl"),
        volMinIcon: document.querySelector('.volMin'),
        likeButton: document.getElementById('like'),
        shuffleButton: document.getElementById('shuffle'),
        repeatButton: document.getElementById('repeat'),
        menuButton: document.getElementById("menuButton"),
        currentInfo: document.querySelector(".current-info"),
        menuSong: document.querySelector(".menuSong"),
    };
    
    const state = {
        isPlaying: false,
        currentSongIndex: 0,
        isShuffleActive: false,
        isRepeatActive: false,
        playedSongs: [],
        likeMusic: [],
    };

    // VolMax
    player.mysong.volume = 1.0;
    player.volumeControl.value = 1.0;
    document.documentElement.style.setProperty('--volume', '100%');
    updateVolumeIcon();
    
    // Buttons
    const totalSongs = allMusic.length;
    
    // callLoadSong
    loadSong(state.currentSongIndex);
    
    // clickEvents
    player.playButton.addEventListener("click", togglePlayPause);
    player.nextButton.addEventListener("click", playNextSong);
    player.prevButton.addEventListener("click", playPrevSong);
    player.progressBar.addEventListener("input", handleProgressBarChange);
    player.volumeControl.addEventListener("input", handleVolumeControlChange);
    player.downloadButton.addEventListener("click", downloadCurrentSong);
    player.volMinIcon.addEventListener('click', toggleMute);
    
    // LikeSong
    player.likeButton.addEventListener('click', handleLikeButtonClick);
    
    // randomizerSong
    player.shuffleButton.addEventListener('click', toggleShuffle);
    
    // RepeatSong
    player.repeatButton.addEventListener('click', toggleRepeat);
    
    // TimeSong
    player.mysong.addEventListener('ended', handleSongEnded);
    player.mysong.addEventListener('timeupdate', handleTimeUpdate);

    // SongList
    player.menuButton.addEventListener("click", () => {
        player.currentInfo.classList.toggle("expanded");
        updatePlaylist();
    
        const menuSong = document.querySelector(".menuSong");
        menuSong.innerHTML = '';
    
        allMusic.forEach((song, index) => {
            const songName = song.name;
            const pElement = document.createElement("p");
            pElement.classList.add("element");
            pElement.textContent = songName;
    
            if (index === state.currentSongIndex) {
                pElement.classList.add("active");
            }
    
            pElement.addEventListener("click", () => {
                state.currentSongIndex = index;
                loadSong(state.currentSongIndex);
                playSong();
                updatePlaylist();
            });
    
            menuSong.appendChild(pElement);
        });
    });

    updatePlaylist();
        
    
    function updatePlaylist() {
        const menuSong = document.querySelector(".menuSong");
        menuSong.innerHTML = '';
    
        allMusic.forEach((song, index) => {
            const songName = song.name;
            const pElement = document.createElement("p");
            pElement.classList.add("element");
            pElement.textContent = songName;
    
            if (index === state.currentSongIndex) {
                pElement.classList.add("active");
            }
    
            pElement.addEventListener("click", () => {
                state.currentSongIndex = index;
                loadSong(state.currentSongIndex);
                playSong();
                updatePlaylist();
            });
    
            menuSong.appendChild(pElement);
        });
    }
    
    function toggleButtonState(button) {
        button.classList.toggle('active');
        button.style.color = button.classList.contains('active') ? '#B32435' : '';
    }
    
    function updateVolumeIcon() {
        const volumeIcon = player.volMinIcon.querySelector('i');
        const { value } = player.volumeControl;
    
        if (value === 0) {
        volumeIcon.className = 'fas fa-volume-xmark';
        } else if (value <= 0.2) {
        volumeIcon.className = 'fas fa-volume-off';
        } else if (value <= 0.5) {
        volumeIcon.className = 'fas fa-volume-low';
        } else {
        volumeIcon.className = 'fas fa-volume-high';
        }
    }
    
    function togglePlayPause() {
        state.isPlaying ? pauseSong() : playSong();
    }
    
    function playSong() {
        player.mysong.play().catch(error => {
        console.error("Error al reproducir el audio:", error);
        });
        player.playButton.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
        state.isPlaying = true;
    }
    
    function pauseSong() {
        player.mysong.pause();
        player.playButton.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
        state.isPlaying = false;
    }
    
    function playNextSong() {
        if (state.isShuffleActive) {
        state.playedSongs.push(state.currentSongIndex);
    
        if (state.playedSongs.length === totalSongs) {
            state.playedSongs.length = 0;
        }
    
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * totalSongs);
        } while (state.playedSongs.includes(newIndex));
    
        state.currentSongIndex = newIndex;
        loadSong(state.currentSongIndex);
        playSong();
        } else {
        state.currentSongIndex = (state.currentSongIndex + 1) % allMusic.length;
        loadSong(state.currentSongIndex);
        playSong();
        }
    }
    
    function playPrevSong() {
        if (state.isShuffleActive) {
        if (state.playedSongs.length === 0) {
            state.playedSongs.push(state.currentSongIndex);
        }
    
        let newIndex;
        do {
            newIndex = state.playedSongs.pop();
        } while (newIndex === state.currentSongIndex);
    
        state.currentSongIndex = newIndex;
        loadSong(state.currentSongIndex);
        playSong();
        } else {
        state.currentSongIndex = (state.currentSongIndex - 1 + allMusic.length) % allMusic.length;
        loadSong(state.currentSongIndex);
        playSong();
        }
    }
    
    function loadSong(index) {
        const song = allMusic[index];
        const wasPlaying = state.isPlaying;
    
        player.mysong.src = `songs/${song.src}.mp3`;
        state.isPlaying = wasPlaying;
    
        const indexInLikeMusic = state.likeMusic.findIndex(likedSong => likedSong.src === song.src);
        player.likeButton.style.color = indexInLikeMusic !== -1 ? '#B32435' : '';
        if (state.isPlaying) playSong();
    
        player.songTitleElement.innerHTML = `<span>${song.name}</span>`;
        player.songAlbumElement.innerHTML = `<span>${song.disc}</span>`;
        player.playButton.innerHTML = state.isPlaying ? '<i class="fa-regular fa-circle-pause"></i>' : '<i class="fa-regular fa-circle-play"></i>';
        player.artSong.style.backgroundImage = `url('DiscArt/${song.art}')`;
        updateSongCount();
        updatePlaylist();
    }
    
    function updateSongCount() {
        player.songCountButton.textContent = `${state.currentSongIndex + 1}/${totalSongs}`;
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsRemaining = Math.floor(seconds % 60);
        return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
    }
    
    function handleProgressBarChange() {
        const duration = player.mysong.duration;
        const newPosition = (player.progressBar.value / 100) * duration;
        player.mysong.currentTime = newPosition;
    }
    
    function updateProgressBar() {
        const currentTime = player.mysong.currentTime;
        const duration = player.mysong.duration;
    
        if (!isNaN(currentTime) && !isNaN(duration)) {
        const progress = (currentTime / duration) * 100;
        player.progressBar.value = progress;
        player.progressBar.style.setProperty('--progress', `${progress}%`);
        }
    }
    
    function updateCurrentTime() {
        const currentTimeElement = document.querySelector(".currentTime .start");
        const endTimeElement = document.querySelector(".currentTime .end");
        const duration = player.mysong.duration;
        const currentTime = player.mysong.currentTime;
    
        if (isNaN(currentTime) || isNaN(duration)) {
        currentTimeElement.textContent = '0:00';
        endTimeElement.textContent = '0:00';
        } else {
        currentTimeElement.textContent = formatTime(currentTime);
        endTimeElement.textContent = formatTime(duration);
        }
    }
    
    function handleVolumeControlChange() {
        const volume = player.volumeControl.value;
        player.mysong.volume = volume;
        document.documentElement.style.setProperty('--volume', volume * 100 + '%');
        updateVolumeIcon();
    }
    
    function toggleMute() {
        if (player.mysong.volume === 0) {
        unmuteSong();
        } else {
        muteSong();
        }
    }
    
    function muteSong() {
        player.mysong.volume = 0;
        player.volumeControl.setAttribute("data-css", player.volumeControl.value);
        player.volumeControl.value = 0;
        player.volumeControl.classList.add('muted');
        player.volumeControl.classList.add('disabled');
        document.documentElement.style.setProperty('--volume', '0%');
        updateVolumeIcon();
    }
    
    function unmuteSong() {
        const savedVolume = player.volumeControl.getAttribute("data-css");
        player.mysong.volume = savedVolume;
        player.volumeControl.value = savedVolume;
        player.volumeControl.classList.remove('muted');
        player.volumeControl.classList.remove('disabled');
        document.documentElement.style.setProperty('--volume', savedVolume * 100 + '%');
        updateVolumeIcon();
    }
    
    function downloadCurrentSong() {
        const currentSong = allMusic[state.currentSongIndex];
        const downloadLink = document.createElement("a");
        downloadLink.href = `songs/${currentSong.src}.mp3`;
        downloadLink.download = `${currentSong.name}.mp3`;
        downloadLink.click();
        downloadLink.remove();
    }
    
    function handleLikeButtonClick() {
        const currentSong = allMusic[state.currentSongIndex];
        const index = state.likeMusic.findIndex(song => song.src === currentSong.src);
        
        if (index !== -1) {
        state.likeMusic.splice(index, 1);
        player.likeButton.style.color = '';
        } else {
        state.likeMusic.push(currentSong);
        player.likeButton.style.color = '#B32435';
        }
        
        console.log('likeMusic:', state.likeMusic);
    }
    
    function toggleShuffle() {
        if (state.isRepeatActive) {
        toggleButtonState(player.repeatButton);
        state.isRepeatActive = false;
        }
        
        toggleButtonState(player.shuffleButton);
        state.isShuffleActive = player.shuffleButton.classList.contains('active');
        
        if (state.isShuffleActive) {
        player.repeatButton.classList.remove('active');
        state.isRepeatActive = false;
        player.repeatButton.style.color = '';
        }
    }
    
    function toggleRepeat() {
        if (state.isShuffleActive) {
        toggleButtonState(player.shuffleButton);
        state.isShuffleActive = false;
        }
    
        toggleButtonState(player.repeatButton);
        state.isRepeatActive = player.repeatButton.classList.contains('active');
    
        if (state.isRepeatActive) {
        player.shuffleButton.classList.remove('active');
        state.isShuffleActive = false;
        player.shuffleButton.style.color = '';
        }
    }
    
    function handleSongEnded() {
        if (state.isRepeatActive) {
        loadSong(state.currentSongIndex);
        playSong();
        } else if (state.isShuffleActive) {
        state.playedSongs.push(state.currentSongIndex);
    
        if (state.playedSongs.length === totalSongs) {
            state.playedSongs.length = 0;
        }
    
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * totalSongs);
        } while (state.playedSongs.includes(newIndex));
    
        state.currentSongIndex = newIndex;
        loadSong(state.currentSongIndex);
        playSong();
        } else {
        playNextSong();
        }
    }
    
    function handleTimeUpdate() {
        updateProgressBar();
        updateCurrentTime();
    }
    
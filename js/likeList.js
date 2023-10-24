const likeButton = document.getElementById('like');
const favoriteSongs = [];

likeButton.addEventListener('click', () => {
    if (currentSongIndex >= 0 && currentSongIndex < allMusic.length) {
        
        //checkSongArray
        const currentSong = allMusic[currentSongIndex];

        // AddSongArray
        if (!favoriteSongs.includes(currentSong)) {
        favoriteSongs.push(currentSong);
        }

        console.log('Canción añadida a favoritas:', currentSong);
        console.log('Canciones favoritas:', favoriteSongs);
    }
});



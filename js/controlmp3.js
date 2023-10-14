// PLAY / PAUSE SONG
var mysong = document.getElementById("mysong");
var toggleButton = document.getElementById("playButton");
var icon = toggleButton.querySelector("i");

toggleButton.addEventListener("click", function () {

    if (mysong.paused) {
        mysong.play();
        icon.className = "fa-solid fa-pause";
    } else {
        mysong.pause();
        icon.className = "fa-solid fa-play";
    }
});

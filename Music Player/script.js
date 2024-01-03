const albumImg = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const musicPlay = document.querySelector("audio");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const body = document.getElementById("body");

const songData = [
  {
    albumName: "Electric Chill Machine",
    artist: "Jacinto",
    image: "image-1",
    music: "music-1",
  },
  {
    albumName: "Seven Nation Army (Remix)",
    artist: "Jacinto",
    image: "image-2",
    music: "music-2",
  },
  {
    albumName: "Goodnight, Disco Queen",
    artist: "Jacinto",
    image: "image-3",
    music: "music-3",
  },
  {
    albumName: "Front Row (Remix) ",
    artist: "Jacinto",
    image: "image-4",
    music: "music-4",
  },
];

let isPlaying = false;

// --------- Play Song
function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  musicPlay.play();
}

// --------- Pause Song
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  musicPlay.pause();
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

// --------- Updating the DOM
function loadSongs(song) {
  title.textContent = song.albumName;
  artist.textContent = song.artist;
  musicPlay.src = `music/${song.music}.mp3`;
  albumImg.src = `images/${song.image}.jpg`;
  body.style.backgroundImage = `
  linear-gradient(
    to right,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.6)
  ),
  url('images/${song.image}.jpg')`;
}

let songIndex = 0;

// --------- Play Previous Song
function playPrevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songData.length - 1;
  }
  // console.log(songIndex);
  loadSongs(songData[songIndex]);
  playSong();
}

// --------- Play Next Song
function playNextSong() {
  songIndex++;
  if (songIndex > songData.length - 1) {
    songIndex = 0;
  }
  // console.log(songIndex);
  loadSongs(songData[songIndex]);
  playSong();
}

// --------- Play 1st Song on Load
loadSongs(songData[songIndex]);

// --------- Update Progress Bar and Time
function updateProgressBar(e) {
  if (isPlaying) {
    // console.log("in", musicPlay.duration, musicPlay.currentTime);
    const { duration, currentTime } = e.srcElement;
    // console.log(duration, currentTime);
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    //Calculating duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // console.log(durationMinutes, durationSeconds);

    // Delay duration element to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }

    //Calculating Current Time
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    if (currentSeconds) {
      currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
  }
}

function setProgressBar(e) {
  // console.log(e);
  const width = e.srcElement.clientWidth; // Total Width
  const offSetX = e.offsetX; // Clicked position
  // console.log(offSetX);

  const { duration } = musicPlay;
  // console.log(duration);
  // console.log(musicPlay);
  musicPlay.currentTime = (offSetX / width) * duration;
}
// --------- Event Listeners
prevBtn.addEventListener("click", playPrevSong);
nextBtn.addEventListener("click", playNextSong);
musicPlay.addEventListener("ended", playNextSong);
musicPlay.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);

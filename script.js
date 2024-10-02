var songs = [
    {
        songName: 'Gone',
        url: './songs/Gone.mp3',
        img: './images/Gone.jpg',
        artist: 'Rose',
    },
    {
        songName: 'For You',
        url: './songs/For You.mp3',
        img: './images/For You.jpg',
        artist: '严浩翔',
    },
    {
        songName: 'Love Story',
        url: './songs/Love Story.mp3',
        img: './images/Love Story.jpg',
        artist: 'Taylor Swift',
    },
    {
        songName: 'Only Look At Me',
        url: './songs/Only Look At Me.mp3',
        img: './images/Only Look At Me.jpg',
        artist: 'TAEYANG',
    },
    {
        songName: 'Forever Young',
        url: './songs/Forever Young.mp3',
        img: './images/Forever Young.jpg',
        artist: 'BLACKPINK',
    },
    // 添加更多歌曲
];


var audio = new Audio();
var allSongs = document.querySelector('#all-songs');
var poster = document.querySelector('#left');
var play = document.querySelector('#play');
var backward = document.querySelector('#backward');
var forward = document.querySelector('#forward');
var lyricsElement = document.getElementById('lyrics');
var currentLyrics = [];
var currentLyricIndex = 0;

// Initialize selected song index
var selectedSong = 0;

// Function to add songs to the UI
function addSongs() {
    var songCards = songs.map(function (song, index) {
        return `
            <div class="song-card" id="${index}" onclick="navigateToPlayer(${index})">
                <div class="song">
                    <img src="${song.img}" alt="" />
                    <h2>${song.songName}</h2>
                </div>
                <h6 id="duration-${index}"></h6> 
            </div>
        `;
    });

    allSongs.innerHTML = songCards.join('');
    updateCurrentSong();
}

// Navigate to the player page
function navigateToPlayer(index) {
    const song = songs[index];
    const queryString = `?name=${encodeURIComponent(song.songName)}&url=${encodeURIComponent(song.url)}&img=${encodeURIComponent(song.img)}&artist=${encodeURIComponent(song.artist)}`;
    window.location.href = `play.html${queryString}`; // Change 'play.html' to your actual playback page
}

// Function to update the current song information
function updateCurrentSong() {
    poster.style.backgroundImage = `url(${songs[selectedSong].img})`;
    audio.src = songs[selectedSong].url;
    loadLyrics(songs[selectedSong].lyrics);

    audio.addEventListener('loadedmetadata', function () {
        var durationElement = document.querySelector(`#duration-${selectedSong}`);
        if (durationElement) {
            durationElement.textContent = formatTime(audio.duration);
        }
    });
}

// Function to load and parse lyrics
function loadLyrics(lyricsFile) {
    fetch(lyricsFile)
        .then(response => response.text())
        .then(data => {
            currentLyrics = parseLrc(data);
            currentLyricIndex = 0; // Reset index for new song
            updateLyrics();
        })
        .catch(error => console.error('Error loading lyrics:', error));
}

// Function to parse LRC format lyrics
function parseLrc(data) {
    var lines = data.split('\n');
    var lyrics = [];

    lines.forEach(line => {
        var match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
        if (match) {
            var minutes = parseInt(match[1], 10);
            var seconds = parseInt(match[2], 10);
            var milliseconds = parseInt(match[3], 10);
            var totalSeconds = (minutes * 60) + seconds + (milliseconds / 100);
            lyrics.push({ time: totalSeconds, text: match[4] });
        }
    });

    return lyrics;
}

// Function to update displayed lyrics based on playback
function updateLyrics() {
    audio.ontimeupdate = function() {
        var currentTime = audio.currentTime;
        while (currentLyricIndex < currentLyrics.length - 1 && 
               currentTime >= currentLyrics[currentLyricIndex + 1].time) {
            currentLyricIndex++;
        }

        // Clear previous lyrics
        lyricsElement.innerHTML = '';

        // Display current lyric
        if (currentLyrics[currentLyricIndex]) {
            lyricsElement.innerHTML = currentLyrics[currentLyricIndex].text;
            highlightCurrentLyric();
        }
    };
}

// Function to highlight current lyric
function highlightCurrentLyric() {
    lyricsElement.innerHTML = currentLyrics.map((lyric, index) => {
        const isActive = index === currentLyricIndex;
        return `<div class="${isActive ? 'active' : ''}">${lyric.text}</div>`;
    }).join('');

    // Implement scroll effect
    var visibleHeight = lyricsElement.clientHeight;
    var scrollPosition = currentLyricIndex * (visibleHeight / currentLyrics.length) - (visibleHeight / 2);
    lyricsElement.scrollTo(0, scrollPosition);
}

// Function to format time in minutes and seconds
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}


addSongs();

// Add event listeners for control buttons
play.addEventListener('click', togglePlay);
backward.addEventListener('click', playPreviousSong);
forward.addEventListener('click', playNextSong);

// Add songs to the UI on page load


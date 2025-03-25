const title = document.getElementById('title');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const auto = document.getElementById('auto');
const videoSection = document.getElementById('video-section');
const video = document.querySelector('video');
const pan = document.getElementById('pan');
const playButton = document.getElementById('play');
const pause = document.getElementById('pause');
const upload = document.getElementById('upload');
const url = 'http://localhost:3000/videos';

function loadVideo() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Assuming `data` is an array of videos
            const firstVideo = data[0]; // Get the first video from the array
            if (firstVideo) {
                video.src = firstVideo.filePath; // Set the video source
            } else {
                console.error('No videos found in the JSON data.');
            }
        })
        .catch(err => console.error('Error fetching videos:', err));
}

function playVideo() {
    if (video.src) {
        video.play(); 
    } else {
        console.error('No video source set.');
    }
    videoSection.setAttribute('border', 'doubled')
    videoSection.appendChild(video)
}

playButton.addEventListener('click', playVideo); 
function initialize() {
    loadVideo()
}

document.addEventListener('DOMContentLoaded', initialize);
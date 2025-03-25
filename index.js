const title = document.getElementById('title')
const previous = document.getElementById('previous')
const next = document.getElementById('next')
const auto = document.getElementById('auto')
const videoSection = document.getElementById('video-section')
const video = document.querySelector('video') 
const pan = document.getElementById('pan')
const playButton = document.getElementById('play')
const pause = document.getElementById('pause')
const upload = document.getElementById('upload')
const url = 'http://localhost:3000/videos'

fetch(url)
    .then(response => response.json())
    .then(data => loadVideo(data))
    .catch(err => console.error(err))

function loadVideo(){
    // Store the video data globally for later use
    window.videoData = data;
        
    // Display the video (but don't play it)
    if (data && data.length > 0) {
        const videoFilePath = data[0].filePath; // Assuming data is an array
        video.src = videoFilePath;
        
        // Set video to show first frame
        video.poster = videoFilePath; // Optional: shows first frame as poster
        video.preload = "auto"; // Preload the video
        video.load(); // Load the video source
        
        // Ensure video doesn't autoplay
        video.removeAttribute('autoplay');
    } else {
        console.error('No video data available');
    }
}    

function playVideo() {
    if (window.videoData && window.videoData.length > 0) {
        const videoFilePath = window.videoData.filePath; // Get the first video's filePath
        video.src = videoFilePath; // Set the video source
        video.play(); // Play the video
    } else {
        console.error('No video data available');
    }

    videoSection.appendChild()
}

// Add an event listener to the play button
playButton.addEventListener('click', playVideo);

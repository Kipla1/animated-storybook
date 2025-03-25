// Select DOM elements
const title = document.getElementById('title');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const auto = document.getElementById('auto');
const videoSection = document.getElementById('video-section');
const pan = document.getElementById('pan');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const upload = document.getElementById('upload');

const url = 'http://localhost:3000/videos';

// Global variables to manage video state
let videoData = [];
let currentVideoIndex = 0;
let currentVideo = null;

// Fetch videos when page loads
function fetchVideos() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            videoData = data;
            displayVideoList();
        })
        .catch(err => console.error('Error fetching videos:', err));
}
fetchVideos();

// Create a modal for video selection
function displayVideoList() {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'none';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.style.padding = '20px';

    // Create video list container
    const videoList = document.createElement('div');
    videoList.style.display = 'flex';
    videoList.style.flexWrap = 'wrap';
    videoList.style.justifyContent = 'center';
    videoList.style.maxWidth = '80%';
    videoList.style.maxHeight = '80%';
    videoList.style.overflowY = 'auto';
    videoList.style.backgroundColor = 'white';
    videoList.style.padding = '20px';
    videoList.style.borderRadius = '10px';

    // Create file upload input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.style.marginBottom = '20px';

    // Create title input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Enter Video Title';
    titleInput.style.width = '300px';
    titleInput.style.marginBottom = '10px';
    titleInput.style.padding = '10px';

    // Upload button
    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Upload Video';
    uploadButton.style.padding = '10px';
    uploadButton.style.backgroundColor = '#4CAF50';
    uploadButton.style.color = 'white';
    uploadButton.style.border = 'none';
    uploadButton.style.borderRadius = '5px';

    // Upload file functionality
    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        const videoTitle = titleInput.value.trim() || file.name;

        if (file) {
            uploadVideo(file, videoTitle);
            fileInput.value = ''; // Clear file input
            titleInput.value = ''; // Clear title input
        } else {
            alert('Please select a video file');
        }
    });

    // Populate existing video list
    videoData.forEach((videoItem, index) => {
        const videoCard = document.createElement('div');
        videoCard.style.margin = '10px';
        videoCard.style.position = 'relative';
        videoCard.style.width = '200px';

        const videoThumb = document.createElement('video');
        videoThumb.src = videoItem.filePath;
        videoThumb.width = 200;
        videoThumb.style.border = '2px solid #ddd';
        videoThumb.style.borderRadius = '5px';

        const videoTitle = document.createElement('p');
        videoTitle.textContent = videoItem.title || `Video ${index + 1}`;

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '0';
        deleteButton.style.right = '0';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '3px';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteVideo(videoItem.id);
        });

        videoCard.appendChild(videoThumb);
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(deleteButton);

        // Select video when clicked
        videoCard.addEventListener('click', () => {
            selectVideo(index);
            modal.style.display = 'none';
        });

        videoList.appendChild(videoCard);
    });

    // Create upload section
    const uploadSection = document.createElement('div');
    uploadSection.style.display = 'flex';
    uploadSection.style.flexDirection = 'column';
    uploadSection.style.alignItems = 'center';
    uploadSection.style.width = '100%';
    uploadSection.style.marginBottom = '20px';

    uploadSection.appendChild(fileInput);
    uploadSection.appendChild(titleInput);
    uploadSection.appendChild(uploadButton);

    // Add upload section and video list to modal
    modal.appendChild(uploadSection);
    modal.appendChild(videoList);
    document.body.appendChild(modal);

    // Show modal when upload button is clicked
    upload.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

// Upload video to server
function uploadVideo(file, title) {
    // Create FormData to send file
    const formData = new FormData();
    formData.append('file', file);
    
    // Create a FileReader to generate a local URL for the video
    const reader = new FileReader();
    reader.onload = function(event) {
        const videoObject = {
            id: Date.now(),
            title: title,
            filePath: event.target.result
        };

        // Send video metadata to server
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(videoObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(addedVideo => {
            // Refresh video list
            fetchVideos();
            alert('Video added successfully!');
        })
        .catch(err => {
            console.error('Error adding video:', err);
            alert('Failed to add video');
        });
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
}

// Delete video from server
function deleteVideo(videoId) {
    fetch(`${url}/${videoId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Refresh video list
            fetchVideos();
            alert('Video deleted successfully!');
        }
    })
    .catch(err => {
        console.error('Error deleting video:', err);
        alert('Failed to delete video');
    });
}

// Select and load a specific video
function selectVideo(index) {
    if (index >= 0 && index < videoData.length) {
        currentVideoIndex = index;
        const selectedVideo = videoData[index];
        
        // Clear previous video
        videoSection.innerHTML = '';

        // Create new video element
        currentVideo = document.createElement('video');
        currentVideo.src = selectedVideo.filePath;
        currentVideo.style.maxWidth = '100%';
        currentVideo.style.maxHeight = '450px';
        
        // Remove default controls
        currentVideo.removeAttribute('controls');

        // Add video to section
        videoSection.appendChild(currentVideo);

        // Optional: Update title or other metadata
        title.textContent = selectedVideo.title || 'Animated Storybook';
    }
}

// Play video function
function playVideo() {
    if (currentVideo && currentVideo.paused) {
        currentVideo.play();
    }
}

// Pause video function
function pauseVideo() {
    if (currentVideo && !currentVideo.paused) {
        currentVideo.pause();
    }
}

// Navigate to previous video
function previousVideo() {
    const prevIndex = (currentVideoIndex - 1 + videoData.length) % videoData.length;
    selectVideo(prevIndex);
}

// Navigate to next video
function nextVideo() {
    const nextIndex = (currentVideoIndex + 1) % videoData.length;
    selectVideo(nextIndex);
}

// Add event listeners
playButton.addEventListener('click', playVideo);
pauseButton.addEventListener('click', pauseVideo);
previous.addEventListener('click', previousVideo);
next.addEventListener('click', nextVideo);

// Auto play functionality (optional)
auto.addEventListener('click', () => {
    // Implement auto-play logic if needed
    console.log('Auto play not implemented');
});
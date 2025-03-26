const title = document.getElementById('title');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const auto = document.getElementById('auto');
const videoSection = document.getElementById('video-section');
const pan = document.getElementById('pan');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const upload = document.getElementById('upload');
const deleteBtn = document.getElementById('delete')
const url = 'http://localhost:3000/pages'; 

fetch(url)
    .then(response => response.json())
    .then(data => loadPictures(data))
    .catch(err => console.error('Error fetching pages:', err));

function loadPictures(data) {
    data.forEach(page => {
        const picture = document.createElement('img');
        picture.src = page.filepath;
        picture.alt = page.title;

        playButton.addEventListener('click', () => {
            videoSection.innerHTML = ''; 
            videoSection.appendChild(picture);
        });
    });
}

// Create a uploadDiv for user input
const uploadDiv = document.createElement('div');
uploadDiv.style.position = 'fixed';
uploadDiv.style.top = '50%';
uploadDiv.style.left = '50%';
uploadDiv.style.transform = 'translate(-50%, -50%)';
uploadDiv.style.backgroundColor = 'darksalmon';
uploadDiv.style.borderRadius = '20px'
uploadDiv.style.padding = '20px';
uploadDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
uploadDiv.style.display = 'none'; // Initially hidden
uploadDiv.style.zIndex = '1000';

// uploadDive title
const uploadTitle = document.createElement('h3')
uploadTitle.textContent = 'Enter Submission Details Below'

// Create input fields and a submit button
const pageNumberInput = document.createElement('input');
pageNumberInput.type = 'number';
pageNumberInput.placeholder = 'Page Number';
pageNumberInput.style.display = 'block';
pageNumberInput.style.marginBottom = '10px';
pageNumberInput.style.borderRadius = '5px'
pageNumberInput.style.border = 'none'

const pageTitleInput = document.createElement('input');
pageTitleInput.type = 'text';
pageTitleInput.placeholder = 'Page Title';
pageTitleInput.style.display = 'block';
pageTitleInput.style.marginBottom = '10px';
pageTitleInput.style.borderRadius = '5px'
pageTitleInput.style.border = 'none'

const pageSourceInput = document.createElement('input');
pageSourceInput.type = 'text';
pageSourceInput.placeholder = 'Page Source (URL)';
pageSourceInput.style.display = 'block';
pageSourceInput.style.marginBottom = '10px';
pageSourceInput.style.borderRadius = '5px'
pageSourceInput.style.border = 'none'

const submitButton = document.createElement('button');
submitButton.textContent = 'Submit';
submitButton.style.display = 'block';
submitButton.style.marginTop = '10px';
submitButton.style.borderRadius = '5px'
submitButton.style.border = 'none'


// Append inputs and button to the uploadDiv
uploadDiv.appendChild(uploadTitle);
uploadDiv.appendChild(pageNumberInput);
uploadDiv.appendChild(pageTitleInput);
uploadDiv.appendChild(pageSourceInput);
uploadDiv.appendChild(submitButton);
document.body.appendChild(uploadDiv);

// Show the uploadDiv when the upload button is clicked
upload.addEventListener('click', () => {
    uploadDiv.style.display = 'block';
});

// Handle the submit button click
submitButton.addEventListener('click', () => {
    const newPage = {
        page: pageNumberInput.value,
        title: pageTitleInput.value,
        filepath: pageSourceInput.value,
    };

    if (!newPage.page || !newPage.title || !newPage.filepath) {
        alert('Please fill in all fields.');
        return;
    }

    // Post the new page to the JSON server
    postNewPage(newPage);

    // Hide the uploadDiv and clear the inputs
    uploadDiv.style.display = 'none';
    pageNumberInput.value = '';
    pageTitleInput.value = '';
    pageSourceInput.value = '';
});

function postNewPage(newPage) {
    fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPage)
    })
    .then(response => {
        if (response.ok) {
            console.log('New page added successfully!');
            return response.json();
        } else {
            throw new Error('Failed to add new page');
        }
    })
    .then(data => console.log('Posted data:', data))
    .catch(err => console.error('Error posting new page:', err));
}

let currentIndex = 0; // Track the current page index
let pages = []; // Store the pages fetched from the JSON server
let autoInterval = null; // Store the interval ID for the auto mode

// Fetch existing pages
fetch(url)
    .then(response => response.json())
    .then(data => {
        pages = data; // Store the fetched pages
        loadPicture(currentIndex); // Load the first picture
    })
    .catch(err => console.error('Error fetching pages:', err));

function loadPicture(index) {
    if (pages.length === 0) {
        console.error('No pages available.');
        return;
    }

    // Ensure the index is within bounds
    if (index < 0 || index >= pages.length) {
        console.error('Index out of bounds.');
        return;
    }

    const page = pages[index];
    const picture = document.createElement('img');
    picture.src = page.filepath;
    picture.alt = page.title;

    videoSection.innerHTML = ''; // Clear the video section
    videoSection.appendChild(picture); // Display the current picture
    title.textContent = page.title; // Update the title
}

// Handle the next button click
next.addEventListener('click', () => {
    if (currentIndex < pages.length - 1) {
        currentIndex++; // Move to the next page
        loadPicture(currentIndex);
    } else {
        alert('You are on the last page.');
    }
});

// Handle the previous button click
previous.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--; // Move to the previous page
        loadPicture(currentIndex);
    } else {
        alert('You are on the first page.');
    }
});

// Handle the auto button click
auto.addEventListener('click', () => {
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    } else {
        // Start auto mode
        autoInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % pages.length; // Loop back to the first page
            loadPicture(currentIndex);
        }, 2000); // Change image every 2 seconds
    }
});

deleteBtn.addEventListener('click', () => {
    if (pages.length === 0) {
        alert('No pages available to delete.');
        return;
    }

    // Ask the user for confirmation
    const confirmation = confirm(`Are you sure you want to delete the page: "${pages[currentIndex].title}"?`);
    if (!confirmation) {
        return; // Exit if the user cancels
    }

    // Get the ID of the current page
    const pageId = pages[currentIndex].id;

    // Send a DELETE request to the JSON server
    fetch(`${url}/${pageId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Page deleted successfully!');
            // Remove the page from the local `pages` array
            pages.splice(currentIndex, 1);

            // Adjust the `currentIndex` to stay within bounds
            if (currentIndex >= pages.length) {
                currentIndex = pages.length - 1;
            }

            // Reload the next or previous picture
            if (pages.length > 0) {
                loadPicture(currentIndex);
            } else {
                videoSection.innerHTML = ''; // Clear the video section if no pages are left
                title.textContent = ''; // Clear the title
            }
        } else {
            throw new Error('Failed to delete the page.');
        }
    })
    .catch(err => console.error('Error deleting the page:', err));
});
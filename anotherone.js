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
const url = 'https://demo-json-server-psi.vercel.app/pages'; 

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

const uploadDiv = document.createElement('div');
uploadDiv.style.position = 'fixed';
uploadDiv.style.top = '50%';
uploadDiv.style.left = '50%';
uploadDiv.style.transform = 'translate(-50%, -50%)';
uploadDiv.style.backgroundColor = 'darksalmon';
uploadDiv.style.borderRadius = '20px'
uploadDiv.style.padding = '20px';
uploadDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
uploadDiv.style.display = 'none';
uploadDiv.style.zIndex = '1000';

const uploadTitle = document.createElement('h3')
uploadTitle.textContent = 'Enter Submission Details Below'

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

uploadDiv.appendChild(uploadTitle);
uploadDiv.appendChild(pageNumberInput);
uploadDiv.appendChild(pageTitleInput);
uploadDiv.appendChild(pageSourceInput);
uploadDiv.appendChild(submitButton);
document.body.appendChild(uploadDiv);

upload.addEventListener('click', () => {
    uploadDiv.style.display = 'block';
});

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

    postNewPage(newPage);

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

let currentIndex = 0; 
let pages = []; 
let autoInterval = null; 
fetch(url)
    .then(response => response.json())
    .then(data => {
        pages = data;
        loadPicture(currentIndex);
    })
    .catch(err => console.error('Error fetching pages:', err));

function loadPicture(index) {
    if (pages.length === 0) {
        console.error('No pages available.');
        return;
    }

    if (index < 0 || index >= pages.length) {
        console.error('Index out of bounds.');
        return;
    }

    const page = pages[index];
    const picture = document.createElement('img');
    picture.src = page.filepath;
    picture.alt = page.title;

    videoSection.innerHTML = '';
    videoSection.appendChild(picture); 
    title.textContent = page.title;
}

next.addEventListener('click', () => {
    if (currentIndex < pages.length - 1) {
        currentIndex++; 
        loadPicture(currentIndex);
    } else {
        alert('You are on the last page.');
    }
});

previous.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        loadPicture(currentIndex);
    } else {
        alert('You are on the first page.');
    }
});

auto.addEventListener('click', () => {
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    } else {
        autoInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % pages.length;
            loadPicture(currentIndex);
        }, 2000);
    }
});

deleteBtn.addEventListener('click', () => {
    if (pages.length === 0) {
        alert('No pages available to delete.');
        return;
    }

    const confirmation = confirm(`Are you sure you want to delete the page: "${pages[currentIndex].title}"?`);
    if (!confirmation) {
        return; 
    }

    const pageId = pages[currentIndex].id;

    fetch(`${url}/${pageId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Page deleted successfully!');
            pages.splice(currentIndex, 1);

            if (currentIndex >= pages.length) {
                currentIndex = pages.length - 1;
            }

            if (pages.length > 0) {
                loadPicture(currentIndex);
            } else {
                videoSection.innerHTML = ''; 
                title.textContent = ''; 
            }
        } else {
            throw new Error('Failed to delete the page.');
        }
    })
    .catch(err => console.error('Error deleting the page:', err));
});

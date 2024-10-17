// import { connected } from "process";

const API_KEY = "60cbb35e7cd64dfc94fca0bce0e12ce9";
const url ="https://newsapi.org/v2/everything?q=";

window.addEventListener('load' , ()=>fetchNews("India"));

function reload(){
    window.location.reload();
}

async function fetchNews(query){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles){
    const cardContainer = document.getElementById('card-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardContainer.innerHTML='';

    articles.forEach(article => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone,article );
        cardContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone , article){
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleDateString("en-US",{
        timeZone:"Asia/Jakarta"
    });
    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardClone.firstElementChild.addEventListener("click" ,()=>{
        window.open(article.url , "_blank");
    })
}
let currSelectedNav = null;
function onNavItemClick(id){
    fetchNews(`${id}-India`);
    const navItem = document.getElementById(id);
    currSelectedNav?.classList.remove('active');
    currSelectedNav=navItem;
    currSelectedNav.classList.add('active');
}


const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click",()=>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    currSelectedNav?.classList.remove('active');
    currSelectedNav=null;
})


//notes download locally
// Function to toggle the visibility of the modal
// function toggleNotesModal() {
//     const modal = document.getElementById('notes-modal');
//     modal.classList.toggle('hidden');
//     if (!modal.classList.contains('hidden')) {
//         loadNote(); // Load the saved note when opening the modal
//     }
// }

// Function to save notes as a JPG image using canvas.toDataURL()
// function saveNote() {
//     const noteContent = document.getElementById('note-content');

//     // Ensure the modal is visible when capturing the note
//     if (noteContent.classList.contains('hidden')) {
//         alert('Please open the notes modal to capture the note.');
//         return;
//     }

//     // Use html2canvas to capture the note content
//     html2canvas(noteContent).then(canvas => {
//         // Convert the canvas to a base64 encoded image (JPG)
//         const imageDataURL = canvas.toDataURL('image/jpeg');

//         // Create a download link and trigger the download
//         const link = document.createElement('a');
//         link.href = imageDataURL;
//         link.download = 'note.jpg';  // Set the download file name
//         link.click();  // Trigger the download
//     }).catch(error => {
//         console.error('Error capturing the note:', error);
//         alert('Failed to capture the note. Please try again.');
//     });
// }

// Function to load saved notes from LocalStorage
// function loadNote() {
//     const savedNote = localStorage.getItem('userNote');
//     if (savedNote) {
//         document.getElementById('notes-text').value = savedNote;
//     }
// }
// Function to download notes as a text file
function downloadNoteAsText() {
    const noteText = document.getElementById('notes-text').value;

    if (!noteText) {
        alert('Please write some notes before downloading.');
        return;
    }

    // Create a Blob with the note text
    const blob = new Blob([noteText], { type: 'text/plain' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'note.txt'; // Set the download file name

    // Trigger the download
    link.click();

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(link.href);
}


//notes
// Function to save the note to the server
function saveNoteToServer() {
    const noteText = document.getElementById('notes-text').value;

    if (!noteText) {
        alert('Please write some notes before saving.');
        return;
    }

    // Send the note to the server using fetch
    fetch('/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: noteText })  // Send the note content
    })
    .then(response => response.text())
    .then(data => {
        alert('Note saved successfully!');
        // Optionally, you could clear the input after saving:
        document.getElementById('notes-text').value = '';
    })
    .catch(error => {
        console.error('Error saving note:', error);
        alert('Failed to save note.');
    });
}

// Add an event listener to the Save Note button
document.getElementById('save-note').addEventListener('click', saveNoteToServer);




// / Function to fetch saved notes from the server and display them
function loadNotesFromServer() {
    fetch('/notes')
    .then(response => response.json())
    .then(notes => {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = ''; // Clear the current list

        // Loop through the notes and display each one
        notes.forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.textContent = note.content; // Display the note content
            notesList.appendChild(noteItem);
        });

        // Show the saved notes section
        document.getElementById('saved-notes-section').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
        alert('Failed to load saved notes.');
    });
}

// Function to toggle notes modal (if needed)
function toggleNotesModal() {
    const modal = document.getElementById('notes-modal');
    modal.classList.toggle('hidden');
}


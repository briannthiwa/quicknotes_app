// Element Selection using querySelector
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const clearAllBtn = document.querySelector('#clear-all-btn');

// State Management: Load initial items from localStorage
let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];

// Render application on dynamic runtime updates
function render(filterTerm = '') {
    // Clear list completely
    notesList.textContent = '';

    // Filter logic based on user search evaluation
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(filterTerm.toLowerCase())
    );

    // Conditional evaluation for empty dynamic arrays
    if (filteredNotes.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'no-notes-msg';
        emptyLi.textContent = filterTerm ? 'No notes match your search.' : 'Your notebook is completely empty.';
        notesList.appendChild(emptyLi);
    } else {
        // Build individual items securely mapping values avoiding innerHTML vulnerabilities
        filteredNotes.forEach(note => {
            const li = document.createElement('li');
            li.className = `note-item category-${note.category.toLowerCase()}`;

            const textP = document.createElement('p');
            textP.className = 'note-text';
            textP.textContent = note.text;

            const metaDiv = document.createElement('div');
            metaDiv.className = 'note-meta';

            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'note-badge';
            badgeSpan.textContent = note.category;

            const dateSpan = document.createElement('span');
            dateSpan.textContent = note.createdAt;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn danger-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteNote(note.id));

            // Component Composition Configuration 
            metaDiv.appendChild(badgeSpan);
            metaDiv.appendChild(dateSpan);
            metaDiv.appendChild(deleteBtn);

            li.appendChild(textP);
            li.appendChild(metaDiv);
            notesList.appendChild(li);
        });
    }

    // Update dynamic counter matching accurate state sizing criteria
    updateCount();
}

// Function handling creation logic
function addNote(e) {
    e.preventDefault();
    const textValue = noteInput.value.trim();

    // Field Length Validation Conditions Matrix
    if (textValue.length === 0) {
        errorMessage.textContent = 'Please type a note first.';
        return;
    }
    if (textValue.length > 200) {
        errorMessage.textContent = 'Notes must be 200 characters or fewer.';
        return;
    }

    // Success clearing execution patterns
    errorMessage.textContent = '';

    const newNote = {
        id: Date.now().toString(),
        text: textValue,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveData();
    render(searchInput.value);
    
    // Clear functional view input fields
    noteInput.value = '';
}

// Delete item operational procedure logic
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveData();
    render(searchInput.value);
}

// Counter messaging distribution center logic
function updateCount() {
    const totalCount = notes.length;
    if (totalCount === 0) {
        noteCount.textContent = 'You have no notes yet.';
        clearAllBtn.style.display = 'none';
    } else if (totalCount === 1) {
        noteCount.textContent = 'You have 1 note.';
        clearAllBtn.style.display = 'block';
    } else {
        noteCount.textContent = `You have ${totalCount} notes.`;
        clearAllBtn.style.display = 'block';
    }
}

// Global browser window level state data synchronization 
function saveData() {
    localStorage.setItem('quicknotes_data', JSON.stringify(notes));
}

// Interactive application features handling triggers initialization 
noteForm.addEventListener('submit', addNote);

searchInput.addEventListener('input', (e) => {
    render(e.target.value);
});

// Bonus implementation handler rule
clearAllBtn.addEventListener('click', () => {
    if (confirm('Delete all notes?')) {
        notes = [];
        saveData();
        render();
    }
});

// Initial boot script execution setup
render();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// import express, { stati } from 'express';
// import { json } from 'body-parser';
// import { connect, Schema, model } from 'mongoose';

const app = express();
const port = 3000;

// Middleware to parse JSON data from requests
app.use(json());
app.use(stati('public')); // Serve static files (HTML, CSS, JS)

// MongoDB connection
connect('mongodb://localhost:27017/notesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a schema for notes
const noteSchema = new Schema({
    content: String,
    createdAt: { type: Date, default: Date.now }
});

// Create a model for notes
const Note = model('Note', noteSchema);

// Route to save a new note
app.post('/notes', async (req, res) => {
    const noteContent = req.body.content;

    if (!noteContent) {
        return res.status(400).send('Note content is required');
    }

    const note = new Note({
        content: noteContent
    });

    try {
        await note.save(); // Save the note to the database
        res.status(201).send('Note saved successfully');
    } catch (error) {
        res.status(500).send('Failed to save note');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Route to get all saved notes from the database
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find(); // Fetch all notes from the database
        res.json(notes);
    } catch (error) {
        res.status(500).send('Failed to fetch notes');
    }
});




const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper function to generate unique ids
const uuid = require('./helpers/uuid');

const notesData = require('./db/db.json')
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



// GET /notes should return the notes.html file  DONE
app.get('/notes', (req, res) => {
   // Send a message to the client
   res.sendFile(path.join(__dirname, '/public/notes.html'))
});


// GET /api/notes should read the db.json file and return all saved notes as json  DONE
app.get('/api/notes', (req, res) => res.json(notesData));
// Send a message to the client



// Should return the index.html file  DONE
app.get('*', (req, res) =>
   res.sendFile(path.join(__dirname, '/public/index.html'))
);


// POST request to add a note
app.post('/api/notes', async (req, res) => {
   // Log that a POST request was received
   console.info(`${req.method} request received to add a note`);

   const { title, text } = req.body;  // This is saveNote, line 36 index.js

   if (title && text) {
      // Object we will save
      const newNote = {
         title,
         text,
         id: uuid()
      }

      // Read from the db/db.json file
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
         if (err) {
            console.error(err);
            res.status(500).json('Error in reading notes');
            return;
         } else {
            // Convert input file to JSON object
            const parsedNotes = JSON.parse(data);
            // Add new note to array
            parsedNotes.push(newNote);
            // Write the parsedNotes (the newNote) to notesData (db/db.json)
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 3),
               (writeErr) =>
                  writeErr
                     ? console.error(writeErr)
                     : console.info('Successfully updated reviews!')
            );
         }
      });

      const response = {
         status: 'success',
         body: newNote,
      };
      // Update the notesData array
      notesData.push(newNote);
      console.log(response);
      res.status(201).json(response);
   } else {
      res.status(500).json('Error in posting review');

   }

});


app.listen(PORT, () =>
   console.log(`App listening at http://localhost:${PORT}`)
);

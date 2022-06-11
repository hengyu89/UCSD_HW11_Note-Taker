const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get("/notes", (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);

    const { title, text } = req.body;    

    if( title && text) {
        const newNotes = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNotes, "./db/db.json");

        const response = {
            status: 'success',
            body: newNotes,
        };

        res.json(response);
    } else {
        res.json('Error in posting feedback');
      }

});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
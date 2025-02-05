require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
];

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});


app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        // Supprime l'utilisateur
        users.splice(index, 1);
        res.json({ message: 'Utilisateur supprimé.' });
    } else {
        res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Express API OK' });
});



module.exports = app;

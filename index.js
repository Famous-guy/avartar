const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files (avatar images)
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

// Endpoint to generate avatar based on name and gender
app.get('/avatar/:gender/:ame', (req, res) => {
    const gender = req.params.gender;
    const name = req.params.name;

    let genderFolder;
    if (gender === 'male') {
        genderFolder = 'male';
    } else if (gender === 'female') {
        genderFolder = 'female';
    } else {
        // Handle invalid gender
        return res.status(400).send('Invalid gender');
    }

    // Read the files in the gender folder
    const avatarFolder = path.join(__dirname, 'avatars', genderFolder);
    fs.readdir(avatarFolder, (err, files) => {
        if (err) {
            // Handle error
            console.error('Error reading avatar folder:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Select a random avatar image file
        const randomIndex = Math.floor(Math.random() * files.length);
        const randomAvatar = files[randomIndex];

        // Send the selected avatar as a response
        res.set('Content-Type', 'image/svg+xml');
        res.sendFile(path.join(avatarFolder, randomAvatar));
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

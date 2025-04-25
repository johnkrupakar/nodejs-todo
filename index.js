const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'css')));

// Route: Home Page
app.get('/', (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wikipedia Search</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Wikipedia Search</h1>
            <form method="POST" action="/search">
                <input type="text" name="query" placeholder="Search Wikipedia..." required>
                <button type="submit">Search</button>
            </form>
            <div id="results"></div>
        </body>
        </html>
    `;
    res.send(html);
});

// Route: Search Wikipedia
app.post('/search', async (req, res) => {
    const query = req.body.query;
    if (!query) {
        return res.send('<p>No search query provided!</p>');
    }

    try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                format: 'json',
                list: 'search',
                srsearch: query,
            },
        });

        const searchResults = response.data.query.search;
        let resultsHtml = '<h1>Search Results</h1><ul>';
        searchResults.forEach((result) => {
            resultsHtml += `<li><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}" target="_blank">${result.title}</a><br>${result.snippet}</li>`;
        });
        resultsHtml += '</ul>';
        resultsHtml += '<a href="/" class="go-back-button">Go Back</a>';

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Search Results</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                ${resultsHtml}
            </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error(error);
        res.send('<p>Something went wrong. Please try again later.</p>');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Wikipedia Search app running at http://localhost:${port}`);
});
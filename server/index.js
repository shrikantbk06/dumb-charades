const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5500;

const TMDB_API_KEY = 'eef0ece17065fdc9df9ae41c0764d628'; 

app.use(cors());

app.get('/api/word', async (req, res) => {
  try {
    const tmdbRes = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: Math.floor(Math.random() * 10) + 1 
        }
      }
    );

    const movies = tmdbRes.data.results.map(m => m.title);
    const word = movies[Math.floor(Math.random() * movies.length)];

    console.log("Movie sent:", word);
    return res.json({ word });

  } catch (err) {
    console.error("Error fetching movie:", err.message);
    return res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

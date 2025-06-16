import express from 'express'
import { extractMovieInfo } from '../Utils/extractMovieInfo.js'
import axios from 'axios'

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.post("/suggest-movie", async (req, res) => {
    const { prompt } = req.body;

    try {

        const { genre, actor, year } = await extractMovieInfo(prompt);
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc`;

        if (year) {
            url += `&primary_release_year${year}`;
        }

        if (genre) {
            url += `&with_keyword=${genre}`;
        }

        if (actor) {
            const actorRes = await axios.get(`https://api.themoviedb.org/3/search/person`, {
                params: {
                    api_key: TMDB_API_KEY,
                    query : actor
                }
            })

            const actorId = actorRes.data.results[0]?.id;
            if (actorId) {
                url += `&with_cast=${actorId}`
            }
        };

        const movieRes = await axios.get(url);
        res.json({ success: true, movies: movieRes.data.results });

    } catch (error) {
        console.error("AI Suggest Error:", error.message);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
})

export default router;
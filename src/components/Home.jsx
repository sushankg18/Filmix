import React, { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
const Home = () => {
    const [movies, setMovies] = useState([])
    const BaseUrl = 'https://api.themoviedb.org/3'
    const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${BaseUrl}/discover/movie?api_key=${ApiKey}`);
            setMovies(response.data.results)
        }
        fetchData()
    }, [])


    return (
        <Box w={'100%'} height={'90vw'} border={'2px solid blue'}>

        </Box>
    )
}

export default Home

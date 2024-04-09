import React, { useState, useEffect } from 'react'
import { Box, Heading, Image, Text } from '@chakra-ui/react'
import axios from 'axios'
import { Link } from 'react-router-dom'
const Home = () => {
    const [movies, setMovies] = useState([])
    const BaseUrl = 'https://api.themoviedb.org/3'
    const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/trending/movie/week?api_key=${ApiKey}&region=IN`);
                setMovies(response.data.results)
            } catch (error) {
                console.log("Got an Error",error)
            }
        }
        fetchData()
    }, [])


    return (
        <Box w={'100%'} minH={'90vh'} display={'flex'}  alignItems={'center'} justifyContent={'center'}  padding={'1rem 2rem 3rem 2rem'}>
            {/* TRENDING PART */}
            <Box gap={'1.3rem'} w={'90%'}  display={'flex'} flexDir={'column'}>
                <Heading alignSelf={'center'}>Trending</Heading>
                <Box display={'flex'} flexWrap={'wrap'} gap={'1rem'} justifyContent={'space-around'} alignItems={'flex-start'}>
                    {
                        movies.map((item, idx) => (
                            <Link to={`/movie/${item.id}`} target='_blank'>
                                <Box key={idx} _hover={{border : "3px solid orange"}} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={'10.5rem'} height={'16rem'} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                                    <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.title}</Text>
                                </Box>
                            </Link>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default Home

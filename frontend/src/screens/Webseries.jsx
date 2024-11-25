import React, { useState, useEffect } from 'react'
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CiHeart } from "react-icons/ci";
const Webseries = () => {
    const [webseries, setWebseries] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const BaseUrl = 'https://api.themoviedb.org/3'
    const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'

    const fetchData = async (page) => {
        try {
            const response = await axios.get(`${BaseUrl}/discover/tv?api_key=${ApiKey}&language=en-U&region=IN&with_original_language=hi&sort_by=popularity.desc&with_watch_providers=8|119&watch_region=IN&page=${page}`)
            setWebseries(prevMovies => {
                const newMovies = response.data.results.filter(movie => !prevMovies.some(prevMovie => prevMovie.id === movie.id))
                return [...prevMovies, ...newMovies]
            })
            if (response.data.results.length === 0) {
                setHasMore(false)
            }
        } catch (error) {
            console.log("Got an Error", error)
        }
    }

    useEffect(() => {
        fetchData(page)
    }, [page])

    const fetchMoreData = () => {
        setPage(prevPage => prevPage + 1)
    }
    return (
        <Box w={'100%'} minH={'90vh'} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={'1rem 2rem 3rem 2rem'}>
            <Box gap={'1.3rem'} w={'90%'} display={'flex'} flexDir={'column'}>
                <Heading alignSelf={'center'} fontSize={'2rem'} color={'#FC4444'}>Series</Heading>
                <InfiniteScroll
                    dataLength={webseries.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={<p style={{ textAlign: 'center' }}>Yay! You have seen it all</p>}
                >
                    <SimpleGrid pb={'2rem'} columns={6} px={'1rem'} spacing={'2rem'}>
                        {
                            webseries.map((item, idx) => (
                                <Box w={'fit-content'}>

                                    <Link to={`/series/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} key={idx}>
                                        <Box _hover={{ border: "3px solid orange" }} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={'10.5rem'} height={'16rem'} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                                            <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.name}</Text>
                                        </Box>
                                    </Link>
                                    <Flex cursor={'pointer'} justifyContent={'space-evenly'} bgColor={'#171717'} mt={'.5rem'} p={'.3rem .2rem'} gap={'.3rem'} alignItems={'center'} w={'100%'}>
                                        <Text color={'white'}>Add to Wishlist</Text>
                                        <CiHeart color='red' fontSize={'1.2rem'} />
                                    </Flex>

                                </Box>
                            ))
                        }
                    </SimpleGrid>
                </InfiniteScroll>
            </Box>
        </Box>
    )
}

export default Webseries

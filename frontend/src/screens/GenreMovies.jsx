import React, { useState, useEffect } from 'react'
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import axios from 'axios'
import { Link, useLocation, useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CiHeart } from "react-icons/ci";
import Loader from '../components/Loader'
import { useSelector } from 'react-redux'
const GenreMovies = () => {

    const { id } = useParams()

    const { genreName } = useSelector(store => store.movie)

    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const BaseUrl = 'https://api.themoviedb.org/3'
    const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}/discover/movie?api_key=${ApiKey}&with_genres=${id}&language=en-US&region=IN&with_original_language=hi&sort_by=popularity.desc&page=${page}`
                );

                setMovies(prevMovies => {
                    const newMovies = response.data.results.filter(movie => !prevMovies.some(prevMovie => prevMovie.id === movie.id));
                    return [...prevMovies, ...newMovies];
                });

                if (response.data.results.length === 0) {
                    setHasMore(false);
                }
            } catch (error) {
                console.log("Got an Error", error);
            }
        };

        fetchData();
        document.title = "Filmix"
    }, [id, page]);

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
    }, [id]);

    const fetchMoreData = () => {
        setPage(prevPage => prevPage + 1)
    }

    return (
        <Box w={'100%'} minH={'90vh'} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={'1rem 2rem 3rem 2rem'}>
            <Box gap={'1.3rem'} w={'90%'} display={'flex'} flexDir={'column'}>
                <Heading alignSelf={'center'} color={'#FF3300'}>{genreName}</Heading>
                <InfiniteScroll
                    dataLength={movies.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<Loader />}
                    endMessage={<p style={{ textAlign: 'center' }}>Yay! You have seen it all</p>}
                >
                    <SimpleGrid pb={'2rem'} columns={6} px={'1rem'} spacing={'2rem'}>
                        {
                            movies.map((item, idx) => (
                                <Box w={'fit-content'}>

                                    <Link to={`/movie/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }}  key={idx}>
                                        <Box _hover={{ border: "3px solid orange" }} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={'10.5rem'} height={'16rem'} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                                            <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.title}</Text>
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

export default GenreMovies

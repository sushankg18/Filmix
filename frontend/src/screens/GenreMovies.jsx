import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CiHeart } from "react-icons/ci";
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { setAuthUser } from '../redux/userSlice'
import { MdDelete, MdDeleteOutline, MdFavoriteBorder } from 'react-icons/md'
const GenreMovies = () => {

    const { id } = useParams()
    const { authUser } = useSelector((store) => store.user)
    const dispatch = useDispatch()
    const { genreName } = useSelector(store => store.movie)

    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [Favorites, setFavorites] = useState([])
    const [alreadyInFav, setAlreadyInFav] = useState(false)
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
    const handleFavorite = async (item) => {

        try {
            const response = await axios.post(`http://localhost:8000/api/v1/user/add-or-remove-from-wishlist/${item.id}`,
                {},
                {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                })

            if (response.status === 201) {
                dispatch(setAuthUser(response.data.updatedUser))
                toast.success(` ${item.title} Added to Watch Later`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                if (response.data.updatedUser?.watchlater?.toString().includes(item.id)) {
                    setFavorites(true)
                }
            }

            if (response.status === 200) {
                dispatch(setAuthUser(response.data.updatedUser))
                setFavorites(false)
                setAlreadyInFav(false)
                toast.warn(`${item.title} Removed from your Watch Later`, {
                    icon: MdDeleteOutline,
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

            }

        } catch (error) {
            console.log("Error while add to Watch Later : ", error)
        }

    }
    return (
        <Box w={'100%'} minH={'90vh'} bgColor={'transparent'} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={'1rem 1rem 2rem 1rem'}>
            <Box gap={'1.3rem'} w={'100%'} display={'flex'} flexDir={'column'}>
                <Heading alignSelf={'center'} fontSize={'1.7rem'} color={'#FF3300'}>{genreName}</Heading>
                <InfiniteScroll
                    dataLength={movies.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<Loader />}
                    endMessage={<p style={{ textAlign: 'center' }}>Yay! You have seen it all</p>}
                >
                    <SimpleGrid pb={'2rem'} columns={[2, 3, 5, 7]} px={['0', '1rem']} spacing={'2rem'}>
                        {
                            movies.map((item, idx) => (
                                <Box w={'fit-content'}>

                                    <Link to={`/movie/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} key={idx}>
                                        <Box _hover={{ border: "2px solid transparent" }} transition={'.1s ease-in-out'} border={'none'} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={['8.5rem', '10.5rem']} height={['14rem', '16rem']} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                                            <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.title}</Text>
                                        </Box>
                                    </Link>
                                    <Button w={'100%'}
                                        border={'1px solid #333538'} fontWeight={'bold'}
                                        onClick={() => handleFavorite(item)}
                                        color={'white'} size={'sm'} alignSelf={['center', 'start']}
                                        borderRadius={'0rem'} variant={'solid'} colorScheme='transparent'
                                        cursor={'pointer'} leftIcon={authUser?.watchlater?.includes(item.id) ? <MdDelete /> : <MdFavoriteBorder />}>
                                        {authUser?.watchlater?.includes(item.id) ? "Watch Later " : "Watch Later"}
                                    </Button>

                                </Box>
                            ))
                        }
                    </SimpleGrid>
                    <ToastContainer />
                </InfiniteScroll>
            </Box>
        </Box>
    )
}

export default GenreMovies

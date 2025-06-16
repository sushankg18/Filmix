import React, { useState, useEffect } from 'react'
import { Box, Button, Center, Flex, Heading, Image, Stack, Text, VStack, } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { IoMdPlay } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import defaultImg from '../Assets/noimageavailable.png'
import axios from 'axios'
import Loader from '../components/Loader'
import { CiHeart } from 'react-icons/ci';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { setGenreName } from '../redux/movieSlice';
import { setAuthUser } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegFaceFrownOpen } from "react-icons/fa6";
import { ToastContainer } from 'react-toastify'


const MoviesDetails = () => {

  const { id } = useParams();
  const dispatch = useDispatch()
  const { authUser } = useSelector((store) => store.user)


  const [movieDetail, setMovieDetail] = useState([])
  const [isMovieAvailable, setIsMovieAvailable] = useState(false)
  const [movieDirector, SetmovieDirector] = useState([])
  const [reviews, setReviews] = useState([])
  const [trailer, setTrailer] = useState()
  const [cast, setCast] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [readmore, setReadmore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [Favorites, setFavorites] = useState(false)
  const [alreadyInFav, setAlreadyInFav] = useState(false)
  const [watchNowCLicked, setWatchNowCLicked] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(authUser ? true : false)
  const [showLoginPopUp, setShowLoginPopUp] = useState(false)

  const BaseUrl = 'https://api.themoviedb.org/3'
  const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'


  const formatDate = (rawDate) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(rawDate).toLocaleDateString("en-US", options);
  };

  const durationFormat = (rawDuration) => {
    const hours = Math.floor(rawDuration / 60)
    const minutes = rawDuration % 60
    return `${hours}h ${minutes}m`
  }
  useEffect(() => {
    let fetchData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/movie/${id}?api_key=${ApiKey}`);
        const castNcrew = await axios.get(`${BaseUrl}/movie/${id}/credits?api_key=${ApiKey}`)
        const trailerData = await axios.get(`${BaseUrl}/movie/${id}/videos?api_key=${ApiKey}`)
        const reviews = await axios.get(`${BaseUrl}/movie/${id}/reviews?api_key=${ApiKey}`)
        const recommendations = await axios.get(`${BaseUrl}/movie/${id}/recommendations?api_key=${ApiKey}`)
        const trailers = trailerData.data.results.filter(video => video.type === 'Trailer');
        if (trailers.length > 0) {
          setTrailer(trailers[0])
        }
        setReviews(reviews.data.results)
        const formattedGameData = {
          ...response.data,
          releasedFormatted: formatDate(response.data.release_date),
          duration: durationFormat(response.data.runtime)
        };
        setLoading(false)
        setMovieDetail([formattedGameData])
        setRecommendations(recommendations.data.results)
        const limitedCast = castNcrew.data.cast;
        setCast(limitedCast)
        const director = castNcrew.data.crew.filter(director => director.department === "Directing")
        if (director.length > 0) {
          SetmovieDirector(director[0])
        }
        if (authUser?.watchlater?.toString().includes(id)) {
          setAlreadyInFav(true)
        }
        document.title = response.data.title
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [id, authUser?.watchlater, Favorites]);

  useEffect(() => {
    const fetchMovieAvailablity = async () => {
      try {
        const streamApi = await axios.get(`https://vidsrc.xyz/embed/movie/${id}`)
        if (streamApi.status === 200) {
          setIsMovieAvailable(true)
        }
      } catch (error) {
        setIsMovieAvailable(false)
      }
    }
    fetchMovieAvailablity()
  }, [id])

  const handleReadmore = () => {
    setReadmore(!readmore)
  }

  const watchNow = () => {
    if (!isUserLoggedIn) {
      setShowLoginPopUp(true)
    } else {
      setWatchNowCLicked(!watchNowCLicked)
    }
  }

  const handleLoginPopUp = () => {
    setShowLoginPopUp(false)
  }

  //FAVORITE MOVIE HANDLING FUNCTION
  const handleFavourite = async (movieName) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/add-or-remove-from-wishlist/${id}`,
        {},
        {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        })

      if (response.status === 201) {
        dispatch(setAuthUser(response.data.updatedUser))
        toast.success(` ${movieName} Added to watchlater`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        if (response.data.updatedUser?.watchlater?.toString().includes(id)) {
          setFavorites(true)
        }
      }

      if (response.status === 200) {
        dispatch(setAuthUser(response.data.updatedUser))
        setFavorites(false)
        setAlreadyInFav(false)
        toast.warn(`${movieName} Removed from watchlater`, {
          icon: MdDeleteOutline,
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })

      }

    } catch (error) {
      console.log("Error while add to watchlater : ", error)
    }

  }
  const setGenreNameFun = (name) => {
    dispatch(setGenreName(name));
  }

  return (
    <Box w={['100vw', '100%']} fontSize={['.9rem', '1rem']} overflow={'hidden'} minH={'90vh'} color={'#fff'} padding={['1rem .7rem', '2rem 3rem']}>
      {loading ? <Loader /> : movieDetail.map((item, idx) => (
        <>
          <Box w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'} flexDir={['column', 'row']} justifyContent={'space-between'} >

            <Box h={'fit-content'} display={'flex'} flexDir={['column', "row"]} gap={'2rem'}>

              <Image border={'1px solid #131313'} alignSelf={'center'} w={['10rem', '16rem']} height={['', '25rem']} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />

              <Stack justifyContent={'space-between'}  >

                <Stack gap={'1rem'}>
                  <Heading color={'orange'} alignSelf={['center', 'start']} size={'lg'} textTransform={'uppercase'} >{item.title}</Heading>
                  <Text>Released on : <span style={{ color: "gray" }}> {item.releasedFormatted ? item.releasedFormatted : "Not Available"}</span></Text>
                  <Flex gap={'1rem'}>
                    <Text>Genre: <span style={{ color: "gray" }}> {item.genres.length < 1 && "Not available"} </span></Text>
                    {
                      item.genres.length > 0 &&
                      item.genres.map((genre, index) => (
                        <Link to={`/genre/${genre.id}`} onClick={() => setGenreNameFun(genre.name)} style={{ textDecoration: "none" }}>
                          <Text color={'gray'} border={'1px solid #717171'} noOfLines={'1'} padding={'.1rem .7rem'} borderRadius={'.5rem'} cursor={'pointer'}>{genre.name}</Text>
                        </Link>
                      ))
                    }
                  </Flex>
                  <Text>Duration : <span style={{ color: "gray" }}> {item.duration}</span></Text>
                  {
                    movieDirector && (
                      <Stack gap={'0'}>
                        <Text >Director : <span style={{ color: "gray" }}> {movieDirector.name ? movieDirector.name : "Not available"}</span></Text>
                      </Stack>
                    )
                  }
                </Stack>
                <Stack gap={'1rem'} mt={'.5rem'}>
                  {
                    isMovieAvailable ?
                      <Button border={'none'} w={['100%', '15rem']}
                        fontWeight={'bold'} onClick={watchNow} alignSelf={['center', 'start']}
                        color={'white'} variant={'solid'}
                        colorScheme='red' size={['sm', 'md']}
                        cursor={'pointer'} leftIcon={<IoMdPlay />}>
                        Watch for free
                      </Button>
                      :
                      <Button border={'none'} w={['100%', 'fit-content']}
                        fontWeight={'bold'} alignSelf={['center', 'start']}
                        color={'white'} variant={'solid'}
                        colorScheme='teal' size={['sm', 'md']}
                        cursor={"no-drop"} leftIcon={<FaRegFaceFrownOpen />}>
                        This movie isn't available
                      </Button>

                  }

                  <Button w={['100%', '15rem']}
                    border={'none'} fontWeight={'bold'}
                    onClick={() => handleFavourite(item.title)}
                    color={'white'} size={['sm', 'md']} alignSelf={['center', 'start']}
                    variant={'solid'} colorScheme='purple'
                    cursor={'pointer'} leftIcon={Favorites || alreadyInFav ? <MdFavorite /> : <MdFavoriteBorder />}>
                    {Favorites || alreadyInFav ? "Remove from favorites " : "Add to favorites"}
                  </Button>
                </Stack>

              </Stack>
            </Box>
            {trailer && (
              <Stack my={["1.5rem", '']}>
                <Heading alignSelf={'center'} display={['flex', 'none']} size={'md'}>Trailer</Heading>
                <Box fontSize={'.7rem'} w={['100%', '35rem']} h={['250', '350']}>
                  <iframe title="Trailer" style={{ border: "none" }} width="100%" height="100%" src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen></iframe>
                </Box>
              </Stack>
            )}
          </Box>
          {
            item.tagline &&
            <Text fontSize={['.9rem', '1.1rem']} mb={'.5rem'} fontWeight={'bold'}>Tagline : <span style={{ color: "gray", marginRight: ".7rem", }}>{item.tagline}</span></Text>
          }
          {
            item.overview &&
            <Text fontSize={['.9rem', '1.1rem']} fontWeight={'bold'}>Overview : <span style={{ color: "gray", marginRight: ".7rem", }}>{item.overview}</span></Text>
          }

          {/* STREAMING MOVIE CODE... */}
          {/* STREAMING MOVIE CODE... */}
          <Box h={'100vh'} background={'rgba(0,0,0,0.8)'} zIndex={'99'} w={'100vw'} display={watchNowCLicked ? "flex" : 'none'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
            <Box width={'85%'} height={'90%'} display={'flex'} >
              <iframe title={item.title} allowFullScreen style={{ border: "none" }} src={watchNowCLicked ? `https://vidsrc.xyz/embed/movie/${id}` : ""} width={'100%'} height={'100%'}></iframe>
              <IoCloseSharp fontSize={'2rem'} cursor={'pointer'} onClick={watchNow} />
            </Box>
          </Box>

          {/* IF USER NOT LOGGED IN  */}
          <Box h={'100vh'} background={'rgba(0,0,0,0.8)'} zIndex={'99'} w={'100vw'} display={showLoginPopUp ? "flex" : 'none'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
            <Box width={'35%'} height={'35%'} display={'flex'} >
              <VStack w={'100%'} gap={'1rem'}>
                <Heading>Please login to watch movie </Heading>
                <Link style={{ textDecoration: "none" }} to={'/login'}>
                  <Text fontSize={'1.2rem'} fontWeight={'bold'} bgColor={'red'} borderRadius={'.5rem'} color={'white'} p={'.3rem 2rem'}>Login</Text>
                </Link>
                <Text mt={'2rem'} cursor={'pointer'} onClick={handleLoginPopUp}>I'll login later</Text>
              </VStack>
            </Box>
          </Box>





          <Heading color={'gray'} size={'lg'} mt={'3rem'}>TOP CAST</Heading>
          <Box overflowX={'scroll'} py={['2rem', '1.5rem']} mb={'2rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'1rem'} >
              {
                cast.map((cast, index) => (
                  <Link to={`/person/${cast.id}`} style={{ textDecoration: "none" }}>
                    <Flex flexDir={'column'} justifyContent={'space-between'} p={'.3rem'} h={'21rem'} borderRadius={'.6rem'} cursor={'pointer'} bgColor={'#121212'} w={'10rem'}>
                      <Center h={'70%'}>
                        <Image width={cast.profile_path ? '100%' : "70%"} src={cast.profile_path ? `https://image.tmdb.org/t/p/w500${cast.profile_path}` : defaultImg} />
                      </Center>
                      <Box h={'25%'} >
                        <Text textAlign={'center'} mb={'.5rem'} fontSize={'1.1rem'} color={'white'} fontWeight={'bold'}>{cast.name}</Text>
                        <Text textAlign={'center'} fontSize={'.9rem'} color={'gray'} fontWeight={'200'}>{cast.character}</Text>
                      </Box>
                    </Flex>
                  </Link>
                )
                )
              }

            </Flex>
          </Box>




          {
            recommendations.length > 0 &&
            <Heading color={'gray'} >Recommendations</Heading>
          }
          <Box overflowX={'scroll'} my={'2rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'2rem'} pb={'1rem'}>
              {
                recommendations.map((item, idx) => (
                  <Box w={'fit-content'}>
                    <Link to={`/movie/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} key={idx}>
                      <Box _hover={{ border: "3px solid orange" }} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={'10.5rem'} height={'16rem'} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                        <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.title}</Text>
                      </Box>
                    </Link>
                    <Flex cursor={'pointer'} justifyContent={'space-evenly'} bgColor={'#171717'} mt={'.5rem'} p={'.3rem .2rem'} gap={'.3rem'} alignItems={'center'} w={'100%'}>
                      <Text color={'white'}>Add to watchlater</Text>
                      <CiHeart color='red' fontSize={'1.2rem'} />
                    </Flex>

                  </Box>
                ))
              }
            </Flex>
          </Box>

          {
            reviews.length > 0 && (
              <Box minH={'50vh'}>
                <Heading color={'gray'} mb={'2rem'}>Reviews</Heading>
                <Stack gap={'2rem'}>
                  {
                    reviews.map((review, index) => (
                      <Stack key={index} gap={'.5rem'} border={'1px solid #404040'} padding={'.4rem 1rem'} w={['100%', '70%']}>
                        <Flex cursor={'pointer'} w={'fit-content'} gap={'.5rem'} alignItems={'center'}>
                          <Button padding={'1rem'} fontWeight={'bold'} bgColor={'purple'} border={'none'} color={'white'} w={'2rem'} height={'2rem'} borderRadius={'50%'}>{review.author.slice(0, 1)}</Button>
                          <Text >@{review.author}</Text>
                        </Flex>
                        <Text style={{ whiteSpace: 'pre-line' }} noOfLines={readmore ? "auto" : '5'}>{review.content}
                        </Text>
                        <Button fontSize={'.9rem'} variant={'plain'} width={'fit-content'} onClick={handleReadmore} border={'none'} bgColor={'transparent'} color={'orange'} borderBottom={'1px solid orange'} cursor={'pointer'}>{readmore ? "read less" : "read more "}</Button>
                      </Stack>
                    ))
                  }
                </Stack>
              </Box>
            )
          }
          <ToastContainer />
        </>
      ))}
    </Box >


  )
}


const scrollbarStylesHorizontal = {
  "&::-webkit-scrollbar": {
    height: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "orange",
    borderRadius: "10px",
    cursor: "pointer",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::webkit-scrollbar-thumb:hover": {
    backgroundColor: "black",
  },
};
export default MoviesDetails

import React, { useState, useEffect } from 'react'
import { Box, Button, Center, Flex, Heading, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowRight, FaPlay } from "react-icons/fa";
import defaultImg from '../Assets/noimageavailable.png'
import axios from 'axios'
import Loader from '../components/Loader'
import { CiHeart } from 'react-icons/ci';
import { MdDeleteOutline, MdFavorite, MdFavoriteBorder, MdOutlineWatchLater } from 'react-icons/md';
import { setAuthUser } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
const WebseriesDetails = () => {

  const { id } = useParams();
  const dispatch = useDispatch()
  const [movieDetail, setMovieDetail] = useState([])
  const [movieDirector, SetmovieDirector] = useState([])
  const [recommendation, setRecommendation] = useState([])
  const [trailer, setTrailer] = useState()
  const [Favorites, setFavorites] = useState(false)
  const [alreadyInFav, setAlreadyInFav] = useState(false)
  const [cast, setCast] = useState([])
  const [watchNowCLicked, setWatchNowCLicked] = useState(false)
  const [loading, setLoading] = useState(true)
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
        const response = await axios.get(`${BaseUrl}/tv/${id}?api_key=${ApiKey}`);
        const recommendations = await axios.get(`${BaseUrl}/tv/${id}/recommendations?api_key=${ApiKey}`);
        setRecommendation(recommendations.data.results)
        const castNcrew = await axios.get(`${BaseUrl}/tv/${id}/credits?api_key=${ApiKey}`)
        const trailerData = await axios.get(`${BaseUrl}/tv/${id}/videos?api_key=${ApiKey}`)
        const trailers = trailerData.data.results.filter(video => video.type === 'Trailer');
        if (trailers.length > 0) {
          setTrailer(trailers[0])
        }
        const formattedGameData = {
          ...response.data,
          releasedFormatted: formatDate(response.data.first_air_date),
          duration: durationFormat(response.data.runtime)
        };
        setLoading(false)
        setMovieDetail([formattedGameData])
        setCast(castNcrew.data.cast)
        const director = castNcrew.data.crew.filter(director => director.department === "Directing")
        if (director.length > 0) {
          SetmovieDirector(director[0])
        }
        document.title = response.data.name
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [id]);

  const handleMovie = () => {
    setWatchNowCLicked(!watchNowCLicked);
  }

  const handleFavourite = async (seriesName) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/add-or-remove-series-from-watchlater/${id}`,
        {},
        {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        })

      if (response.status === 201) {
        dispatch(setAuthUser(response.data.updatedUser))
        toast.success(` ${seriesName} Added to watchlater`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        if (response.data.updatedUser?.watchlater_series?.toString().includes(id)) {
          setFavorites(true)
        }
      }

      if (response.status === 200) {
        dispatch(setAuthUser(response.data.updatedUser))
        setFavorites(false)
        setAlreadyInFav(false)
        toast.warn(`${seriesName} Removed from watchlater`, {
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
  return (
    <Box w={['100vw', '100%']} fontSize={['.9rem', '1rem']} overflow={'hidden'} minH={'90vh'} bgColor={'transparent'} color={'#fff'} padding={['1rem .7rem', '2rem 3rem']}>
      {loading ? <Loader /> : movieDetail.map((item, idx) => (
        <>
          <Box w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'} flexDir={['column', 'row']} justifyContent={'space-between'}>
            <Box h={'fit-content'} display={'flex'} flexDir={['column', "row"]} gap={'2rem'}>
              <Image border={'1px solid #131313'} alignSelf={'center'} w={['10rem', '16rem']} height={['', '25rem']} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />

              <Stack gap={'1rem'} >

                <Heading color={'orange'} alignSelf={['center', 'start']} size={'lg'} textTransform={'uppercase'} >{item.name}  </Heading>

                <Text color={'orange'} style={{ fontSize: "1.3rem", marginLeft: ".4rem" }}> ({item.original_name}) </Text>
                <HStack >
                  <Text>Released on : </Text>
                  <Text opacity={'.5'}>{item.releasedFormatted}</Text>
                </HStack>

                <Flex gap={'1rem'}>
                  <Text>Genre :</Text>
                  {
                    item.genres.map((genre, index) => (
                      <Text opacity={'.5'} key={index}>{genre.name}</Text>
                    ))
                  }
                </Flex>

                {
                  movieDirector && (
                    <HStack >
                      <Text >Director :</Text>
                      <Text opacity={'.5'}>{movieDirector.name}</Text>
                    </HStack>
                  )
                }
                <HStack>
                  <Text>Total Seasons :</Text>
                  <Text opacity={'.5'}>{item.number_of_seasons}</Text>
                </HStack>
                <HStack>
                  <Text>Total Episodes :</Text>
                  <Text opacity={'.5'}>{item.number_of_episodes}</Text>
                </HStack>

                <HStack>
                  <Text>Languages : </Text>
                  {
                    item.spoken_languages.map((i, index) => (
                      <Text opacity={'.5'}>{i.english_name}</Text>
                    ))}
                </HStack>

                <Button w={['100%', '15rem']}
                  border={'none'} fontWeight={'bold'}
                  onClick={() => handleFavourite(item.name)}
                  color={'white'} size={['sm', 'md']} alignSelf={['center', 'start']}
                  borderRadius={'.8rem'} variant={'solid'} colorScheme='purple'
                  cursor={'pointer'} leftIcon={Favorites || alreadyInFav ? <MdFavorite /> : <MdFavoriteBorder />}>
                  {Favorites || alreadyInFav ? "Remove from favorites " : "Add to favorites"}
                </Button>

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


          <Text fontSize={'1.1rem'} >  Overview : <span style={{ fontWeight: "bold", marginRight: ".7rem", opacity: ".5" }}>{item.overview}</span></Text>







          <Box mt={'3rem'} display={'flex'} flexDir={'column'} gap={'1rem'}>
            {
              item.seasons.map((i, index) => (
                <Flex h={'fit-content'} flexDir={'column'} border={'1px solid #404040'}>
                  <Flex borderRadius={'1rem'} p={'.4rem .5rem'} overflow={'hidden'}>
                    <Image border={'1px solid #131313'} w={'9rem'} height={'14rem'} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
                    <VStack ap={'1rem'} alignItems={'flex-start'} pl={'1rem'}>
                      <VStack alignItems={'flex-start'} gap={'.2rem'}>
                        <Heading>{i.name}</Heading>
                        <Text fontWeight={'bold'}>Total episodes : {i.episode_count}</Text>
                      </VStack>
                      <Text noOfLines={'5'} opacity={'.5'}>{i.overview ? i.overview : `Season ${index + 1} of ${item.name} premiered on ${item.releasedFormatted}`}</Text>
                      <Link to={`/series/${id}/season/${i.season_number}`} style={{ textDecoration: "none" }}>
                        <Text display={['none', "flex"]} cursor={'pointer'} bgColor={'red'} color={'white'} p={'.2rem 1rem'}>Watch season {i.season_number} all episodes</Text>
                      </Link>
                    </VStack>
                  </Flex>
                  <Link to={`/series/${id}/season/${i.season_number}`} style={{ textDecoration: "none" }}>
                    <Text mx={'.5rem'} fontWeight={'bold'} borderRadius={'.5rem'} mb={'.5rem'} display={['flex', 'none']} cursor={'pointer'} bgColor={'red'} color={'white'} p={'.2rem 1rem'}>Watch season {i.season_number} all episodes</Text>
                  </Link>
                </Flex>
              ))
            }
          </Box>

          
          <Heading mt={'2rem'}>TOP CAST</Heading>
          <Box overflowX={'scroll'} mt={'1rem'} py={'1rem'} mb={'2rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'1rem'} py={'0rem'}>
              {
                cast.map((cast, index) => (
                  <Link to={`/person/${cast.id}`} style={{ textDecoration: "none" }}>
                    <Flex flexDir={'column'} gap={'.5rem'} justifyContent={'space-between'} p={'0rem'} h={'21.5rem'} border={'1px solid #404040'} borderRadius={'.6rem'} cursor={'pointer'} w={'10rem'}>
                      <Center h={'70%'}>
                        <Image width={cast.profile_path ? '100%' : "70%"} src={cast.profile_path ? `https://image.tmdb.org/t/p/w500${cast.profile_path}` : defaultImg} />
                      </Center>
                      <Box h={'30%'} >
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


          <Heading mt={'2rem'}>Recommendations</Heading>

          <Box overflowX={'scroll'} my={'2rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'2rem'} pb={'1rem'}>
              {
                recommendation.map((item, idx) => (
                  <Box w={'fit-content'}>
                    <Link to={`/series/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} key={idx}>
                      <Box _hover={{ border: "3px solid orange" }} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={'10.5rem'} height={'16rem'} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                        <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.original_name}</Text>
                      </Box>
                    </Link>
                  </Box>
                ))
              }
            </Flex>
          </Box>
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
export default WebseriesDetails

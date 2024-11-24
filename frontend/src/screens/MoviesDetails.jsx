import React, { useState, useEffect } from 'react'
import { Box, Button, Center, Flex, Heading, Image, Stack, Text, } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { FaPlay } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import defaultImg from '../Assets/noimageavailable.png'
import axios from 'axios'
import Loader from '../components/Loader'
import { CiHeart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setGenreName } from '../redux/movieSlice';

const MoviesDetails = () => {


  const { id } = useParams();
  const dispatch = useDispatch()

  const [movieDetail, setMovieDetail] = useState([])
  const [movieDirector, SetmovieDirector] = useState([])
  const [reviews, setReviews] = useState([])
  const [trailer, setTrailer] = useState()
  const [cast, setCast] = useState([])
  const [favourite, setFavourite] = useState(false)
  const [watchLater, setWatchLater] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [watchNowCLicked, setWatchNowCLicked] = useState(false)
  const [readmore, setReadmore] = useState(false)
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
        document.title = response.data.title
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [id]);

  const handleMovie = () => {
    setWatchNowCLicked(!watchNowCLicked);
  }
  const handleReadmore = () => {
    setReadmore(!readmore)
  }

  const handleFavourite = async (e) => {
    e.preventDefault()
    setFavourite(!favourite)

    try {

      const response = await axios.post(`http://localhost:8000/api/v1/user/post-to-wishlist/${id}`,
        {},
        {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        })

      console.log("Successfully added video to wishlit : ", response)
    } catch (error) {
      console.log("Frontend : got error while add to wishlist : ", error)
    }

  }
  const setGenreNameFun = (name) => {
    dispatch(setGenreName(name));
  }

  return (
    <Box w={'100%'} minH={'90vh'} bgColor={'black'} color={'#fff'} padding={'2rem 3rem'}>
      {loading ? <Loader /> : movieDetail.map((item, idx) => (
        <>
          <Box w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'} justifyContent={'space-between'} >
            <Box display={'flex'} gap={'2rem'}>
              <Image border={'1px solid #131313'} w={'16rem'} height={'25rem'} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
              <Stack gap={'1rem'}>
                <Heading color={'orange'} textTransform={'uppercase'} >{item.title}</Heading>
                <Text>Released on :  {item.releasedFormatted}</Text>
                <Flex gap={'1rem'}>
                  <Text>Genre:
                  </Text>
                  {
                    item.genres.map((genre, index) => (
                      <Link to={`/genre/${genre.id}`} onClick={()=> setGenreNameFun(genre.name)} style={{textDecoration : "none"}}>
                        <Text color={'gray'} border={'1px solid #717171'} padding={'.1rem .7rem'} borderRadius={'.5rem'} cursor={'pointer'}>{genre.name}</Text>
                      </Link>
                    ))
                  }
                </Flex>
                <Text>Duration : <span style={{ color: "gray" }}> {item.duration}</span></Text>
                {
                  movieDirector && (
                    <Stack gap={'0'}>
                      <Text >Director : <span style={{ color: "gray" }}> {movieDirector.name}</span></Text>
                    </Stack>
                  )
                }
                <Button border={'none'} w={'11rem'} fontWeight={'bold'} onClick={handleMovie} color={'white'} padding={'.5rem 1rem'} borderRadius={'.8rem'} backgroundColor={'red'} cursor={'pointer'} leftIcon={<FaPlay />}>Watch Full movie</Button>
                <Button w={'fit-content'} fontSize={'1rem'} border={'none'} fontWeight={'bold'} onClick={handleFavourite} color={'black'} padding={'.5rem 1rem'} borderRadius={'.8rem'} backgroundColor={'white'} cursor={'pointer'} rightIcon={<MdFavoriteBorder />}>Add to favourite</Button>


              </Stack>
            </Box>
            {trailer && (
              <Box>
                <iframe title="Trailer" style={{ border: "none" }} width="600" height="400" src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen></iframe>
              </Box>
            )}
          </Box>
          {
            item.tagline &&
            <Text fontSize={'1.1rem'} mb={'.5rem'} fontWeight={'bold'}>Tagline : <span style={{ color: "gray", marginRight: ".7rem", }}>{item.tagline}</span></Text>
          }
          {
            item.overview &&
            <Text fontSize={'1.1rem'} fontWeight={'bold'}>Overview : <span style={{ color: "gray", marginRight: ".7rem", }}>{item.overview}</span></Text>
          }

          {/* STREAMING MOVIE CODE... */}
          <Box h={'100vh'} background={'rgba(0,0,0,0.8)'} zIndex={'99'} w={'100vw'} display={watchNowCLicked ? "flex" : 'none'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
            <Box width={'85%'} height={'90%'} display={'flex'} >
              <iframe allowFullScreen style={{ border: "none" }} src={`https://vidsrc.xyz/embed/movie/${id}`} width={'100%'} height={'100%'}></iframe>
              <IoCloseSharp fontSize={'2rem'} cursor={'pointer'} onClick={handleMovie} />
            </Box>
          </Box>


          <Heading mt={'2rem'}>TOP CAST</Heading>
          <Box overflowX={'scroll'} mt={'1rem'} mb={'2rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'1rem'} py={'1rem'}>
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

              <Image src='' />
              <Button w={'fit-content'} cursor={'pointer'} _hover={{ textDecor: "underline" }} fontSize={'1.1rem'} bgColor={'transparent'} border={'none'} color={'white'} padding={'0 2rem'} rightIcon={<FaArrowRight />}>Show All </Button>
            </Flex>
          </Box>





          <Heading >Recommendations</Heading>
          <Box overflowX={'scroll'} my={'2rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'2rem'} pb={'1rem'}>
              {
                recommendations.map((item, idx) => (
                  <Box w={'fit-content'}>
                    <Link to={`/movie/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} target='_blank' key={idx}>
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
            </Flex>
          </Box>

          {
            reviews.length > 0 && (
              <Box minH={'50vh'}>
                <Heading color={'gray'} mb={'2rem'}>Reviews</Heading>
                <Stack gap={'2rem'}>
                  {
                    reviews.map((review, index) => (
                      <Stack key={index} gap={'.5rem'} bgColor={"#333333"} padding={'.4rem 1rem'} w={'60%'}>
                        <Flex cursor={'pointer'} w={'fit-content'} gap={'.5rem'} alignItems={'center'}>
                          <Button padding={'1rem'} fontWeight={'bold'} bgColor={'purple'} border={'none'} color={'white'} w={'2rem'} height={'2rem'} borderRadius={'50%'}>{review.author.slice(0, 1)}</Button>
                          <Text >@{review.author}</Text>
                        </Flex>
                        <Text style={{ whiteSpace: 'pre-line' }} noOfLines={readmore ? "auto" : '5'}>{review.content}
                        </Text>
                        <Button fontSize={'.9rem'} width={'fit-content'} onClick={handleReadmore} border={'none'} bgColor={'transparent'} color={'orange'} borderBottom={'1px solid orange'} cursor={'pointer'}>{readmore ? "read less" : "read more "}</Button>
                      </Stack>
                    ))
                  }
                </Stack>
              </Box>
            )
          }
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

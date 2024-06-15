import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Heading, Image, Stack, Text, } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { FaPlay } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import axios from 'axios'
import Loader from '../components/Loader'
const MoviesDetails = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState([])
  const [movieDirector, SetmovieDirector] = useState([])
  const [reviews, setReviews] = useState([])
  const [trailer, setTrailer] = useState()
  const [cast, setCast] = useState([])
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
        const limitedCast = castNcrew.data.cast.slice(0, 10);
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

  return (
    <Box w={'100%'} minH={'90vh'} bgColor={'black'} color={'#fff'} padding={'2rem 3rem'}>
      {loading ? <Loader /> : movieDetail.map((item, idx) => (
        <>
          <Box w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'} justifyContent={'space-between'} >
            <Box display={'flex'} gap={'2rem'}>
              <Image border={'1px solid #131313'} w={'16rem'} height={'25rem'} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
              <Stack gap={'1rem'}>
                <Heading color={'orange'} textTransform={'uppercase'} >{item.title}</Heading>
                <Text>{item.releasedFormatted}</Text>
                <Flex gap={'1rem'}>
                  <Text>Genre:
                  </Text>
                  {
                    item.genres.map((genre, index) => (
                      <Text color={'gray'} border={'1px solid #717171'} padding={'.1rem .7rem'} borderRadius={'.5rem'} cursor={'pointer'}>{genre.name}</Text>
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
                <Button border={'none'} w={'11rem'} fontWeight={'bold'} color={'black'} padding={'.5rem 1rem'} borderRadius={'.8rem'} backgroundColor={'#fff'} cursor={'pointer'} leftIcon={<IoMdDownload />}>Download</Button>
              </Stack>
            </Box>
            {trailer && (
              <Box>
                <iframe title="Trailer" style={{ border: "none" }} width="600" height="400" src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen></iframe>
              </Box>
            )}
          </Box>
          <Text fontSize={'1.1rem'} mb={'.7rem'}><span style={{ fontWeight: "bold", marginRight: ".7rem" }}>Tagline : </span> {item.tagline}</Text>
          <Text fontSize={'1.1rem'}><span style={{ fontWeight: "bold", marginRight: ".7rem" }}>Overview : </span>{item.overview}</Text>

          <Box overflowX={'scroll'} my={'2rem'} sx={scrollbarStylesHorizontal}>
            <Heading>TOP CAST</Heading>
            <Flex gap={'1rem'} py={'1rem'}>
              {
                cast.map((cast, index) => (
                  <Box p={'.3rem 1rem'} borderRadius={'.6rem'} cursor={'pointer'} bgColor={'#121212'} w={'10rem'}>
                    <Link to={`/person/${cast.id}`} style={{ textDecoration: "none" }}>
                      <Image width={'7rem'} mb={'1rem'} src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`} />
                      <Text textAlign={'center'} color={'white'} mb={'.5rem'} fontWeight={'bold'}>{cast.name}</Text>
                      <Text textAlign={'center'} color={'dimgray'} fontSize={'.8rem'} fontWeight={'200'}>{cast.character}</Text>
                    </Link>
                  </Box>
                )
                )
              }
              <Button w={'fit-content'} cursor={'pointer'} _hover={{ textDecor: "underline" }} fontSize={'1.1rem'} bgColor={'transparent'} border={'none'} color={'white'} padding={'0 2rem'} rightIcon={<FaArrowRight />}>Show All </Button>
            </Flex>
          </Box>
          <Box h={'100vh'} background={'rgba(0,0,0,0.8)'} zIndex={'99'} w={'100vw'} display={watchNowCLicked ? "flex" : 'none'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
            <Box width={'85%'} height={'90%'} display={'flex'} >
              <iframe allowFullScreen style={{ border: "none" }} src={`https://vidsrc.xyz/embed/movie/${id}`} width={'100%'} height={'100%'}></iframe>
              <IoCloseSharp fontSize={'2rem'} cursor={'pointer'} onClick={handleMovie} />
            </Box>
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

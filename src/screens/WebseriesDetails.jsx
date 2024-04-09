import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { FaPlay } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import axios from 'axios'
import Loader from '../components/Loader'
const WebseriesDetails = () => {

  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState([])
  const [movieDirector, SetmovieDirector] = useState([])
  const [trailer, setTrailer] = useState()
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
        const castNcrew = await axios.get(`${BaseUrl}/tv/${id}/credits?api_key=${ApiKey}`)
        const trailerData = await axios.get(`${BaseUrl}/tv/${id}/videos?api_key=${ApiKey}`)
        const trailers = trailerData.data.results.filter(video => video.type === 'Trailer');
        if (trailers.length > 0) {
          setTrailer(trailers[0])
        }
        console.log(response.data)
        const formattedGameData = {
          ...response.data,
          releasedFormatted: formatDate(response.data.first_air_date),
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
        document.title = response.data.original_name
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [id]);

  const handleMovie = () => {
    setWatchNowCLicked(!watchNowCLicked);
  }

  return (
    <Box w={'100%'} minH={'90vh'} bgColor={'black'} color={'#fff'} padding={'2rem 3rem'}>
      {loading ? <Loader /> : movieDetail.map((item, idx) => (
        <>
          <Box w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'} justifyContent={'space-between'} >
            <Box display={'flex'} gap={'2rem'}>
              <Image border={'1px solid #131313'} w={'16rem'} height={'25rem'} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
              <Stack gap={'1rem'}>
                <Heading color={'orange'} textTransform={'uppercase'} >{item.name}</Heading>
                <Text>{item.releasedFormatted}</Text>
                <Flex gap={'1rem'}>
                  <Text>Genre:</Text>
                  {
                    item.genres.map((genre, index) => (
                      <Text>{genre.name}</Text>
                    ))
                  }
                </Flex>
                <Text>Duration : {item.duration}</Text>
                {
                  movieDirector && (
                    <Stack gap={'0'}>
                      <Text >Director :</Text>
                      <Text opacity={'.5'}>{movieDirector.name}</Text>
                    </Stack>
                  )
                }
                <Button border={'none'} fontWeight={'bold'} onClick={handleMovie} color={'white'} padding={'.5rem 1rem'} borderRadius={'.8rem'} backgroundColor={'red'} cursor={'pointer'} leftIcon={<FaPlay />}>Watch Full movie</Button>
                <Button border={'none'} fontWeight={'bold'} color={'black'} padding={'.5rem 1rem'} borderRadius={'.8rem'} backgroundColor={'#fff'} cursor={'pointer'} leftIcon={<IoMdDownload />}>Download</Button>
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
                  <>
                    <Box p={'.3rem 1rem'} borderRadius={'.6rem'} cursor={'pointer'} bgColor={'#121212'} w={'10rem'}>
                      <Image width={'7rem'} mb={'1rem'} src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`} />
                      <Text textAlign={'center'} mb={'.5rem'} fontWeight={'bold'}>{cast.name}</Text>
                      <Text textAlign={'center'} fontSize={'.8rem'} fontWeight={'200'}>{cast.character}</Text>
                    </Box>
                  </>
                )
                )
              }
              <Button w={'fit-content'} cursor={'pointer'} _hover={{textDecor : "underline"}} fontSize={'1.1rem'} bgColor={'transparent'} border={'none'} color={'white'} padding={'0 2rem'} rightIcon={<FaArrowRight />}>Show All </Button>
            </Flex>
          </Box>
          <Box h={'100vh'} background={'rgba(0,0,0,0.8)'}  zIndex={'99'} w={'100vw'} display={watchNowCLicked ? "flex" : 'none'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
            <Box width={'80%'} height={'80%'} display={'flex'} >
              <iframe style={{ border: "none" }} src={`https://vidsrc.xyz/embed/movie/${id}`} width={'100%'} height={'100%'}></iframe>
              <IoCloseSharp fontSize={'2rem'} cursor={'pointer'} onClick={handleMovie} />
            </Box>
          </Box>

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

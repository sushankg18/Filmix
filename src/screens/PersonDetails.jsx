import React, { useState, useEffect, useSyncExternalStore } from 'react'
import { Box, Button, Flex, Heading, Image, Stack, Text, } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from 'axios'
import Loader from '../components/Loader'
const PersonDetails = () => {
    const { id } = useParams();
    const [personDetails, setPersonDetail] = useState([])
    const [personMovies, setPersonMovies] = useState([])
    const [readMore, setReadMore] = useState(false)
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
                const response = await axios.get(`${BaseUrl}/person/${id}?api_key=${ApiKey}`);
                const personMovies = await axios.get(`${BaseUrl}/person/${id}/movie_credits?api_key=${ApiKey}`)
                // console.log(response.data.biography.length)
                const formattedGameData = {
                    ...response.data,
                    birthDate: formatDate(response.data.birthday),
                    duration: durationFormat(response.data.runtime)
                };
                setLoading(false)
                setPersonDetail([formattedGameData])
                document.title = response.data.name
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id]);

    const handleReadmore = () => {
        setReadMore(!readMore)
    }

    return (
        <Box w={'100%'} minH={'90vh'} bgColor={'black'} color={'#fff'} padding={'2rem 3rem'}>
            {loading ? <Loader /> : personDetails.map((item, idx) => (
                <>
                    <Box w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'} justifyContent={'space-between'} >
                        <Box display={'flex'} gap={'2rem'}>
                            <Image border={'1px solid #131313'} w={'16rem'} borderRadius={'.7rem'} height={'20rem'} src={`https://image.tmdb.org/t/p/w500${item.profile_path}`} />
                            <Stack gap={'1rem'}>
                                <Heading color={'orange'} textTransform={'uppercase'} >{item.name}</Heading>
                                <Text>Birthday : <span style={{ color: "gray" }}> {item.birthDate}</span></Text>
                                <Text>Place of Birth : <span style={{ color: "gray" }}> {item.place_of_birth}</span></Text>
                                <Stack>
                                    <Text noOfLines={readMore ? "auto" : '7'} style={{ whiteSpace: 'pre-line' }}>
                                        Biography : <span style={{ color: "gray", marginLeft: ".6rem" }}>{item.biography}</span>
                                    </Text>
                                    <Button
                                        display={item.biography.split('\n').length > 5 || item.biography.split(' ').length > 130 ? "flex" : "none"}
                                        color={'white'}
                                        bg={'none'}
                                        // textDecor={'underline 1px solid white'}
                                        border={'none'}
                                        borderBottom={'1px solid #676767'}
                                        onClick={handleReadmore}
                                        width={'fit-content'}
                                        padding={'.1rem .5rem'}
                                        alignItems={'center'}
                                        gap={'.5rem'}
                                    >
                                        {readMore ? "Read less" : "Read more"}
                                        {readMore ? <IoIosArrowUp/> : <IoIosArrowDown /> }
                                    </Button>
                                </Stack>


                            </Stack>
                        </Box>

                    </Box>

                    <Box overflowX={'scroll'} my={'2rem'} sx={scrollbarStylesHorizontal}>

                        <Flex gap={'1rem'} py={'1rem'}>
                            {
                                personMovies.map((cast, index) => (
                                    <>
                                        <Box p={'.3rem 1rem'} borderRadius={'.6rem'} cursor={'pointer'} bgColor={'#121212'} w={'10rem'}>
                                            {/* <Image width={'7rem'} mb={'1rem'} src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`} /> */}
                                            {/* <Text textAlign={'center'} mb={'.5rem'} fontWeight={'bold'}>{cast.name}</Text> */}
                                            {/* <Text textAlign={'center'} fontSize={'.8rem'} fontWeight={'200'}>{cast.character}</Text> */}
                                        </Box>
                                    </>
                                )
                                )
                            }
                        </Flex>
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
export default PersonDetails

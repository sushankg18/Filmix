import React, { useState, useEffect, } from 'react'
import { Box, Button, Flex, Heading, Image, Stack, Text, } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { BsInstagram } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from 'axios'
import Loader from '../components/Loader'
const PersonDetails = () => {
    const { id } = useParams();
    const [personDetails, setPersonDetail] = useState([])
    const [personMovies, setPersonMovies] = useState([])
    const [personSocialMedias, setPersonSocialMedias] = useState([])
    const [readMore, setReadMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const BaseUrl = 'https://api.themoviedb.org/3'
    const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'

    const formatDate = (rawDate) => {
        if (!rawDate) return null; 
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
                const personSocialMedia = await axios.get(`${BaseUrl}/person/${id}/external_ids?api_key=${ApiKey}`);
                const formattedGameData = {
                    ...response.data,
                    birthDate: formatDate(response.data.birthday),
                    deathday: formatDate(response.data.deathday),
                    duration: durationFormat(response.data.runtime)
                };
                setLoading(false)
                setPersonDetail([formattedGameData])
                setPersonMovies(personMovies.data.cast.slice(0, 20))
                setPersonSocialMedias([personSocialMedia.data])
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
                    <Box gap={'1rem'} w={'100%'} mb={'2rem'} minH={'fit-content'} display={'flex'}  >
                        <Box h={'fit-content'}>
                            <Image border={'1px solid #131313'} w={'13rem'} borderRadius={'.7rem'} height={'20rem'} src={`https://image.tmdb.org/t/p/w500${item.profile_path}`} />

                        </Box>
                        <Box display={'flex'} gap={'2rem'}>
                            <Stack gap={'1rem'}>
                                <Heading fontSize={'2rem'} color={'orange'} textTransform={'uppercase'} >{item.name}</Heading>
                                <Text>Born : <span style={{ color: "gray" }}> {item.birthDate}</span></Text>
                                {
                                    (item.deathday !== null) &&
                                    <Text>Died : <span style={{ color: "gray" }}> {item.deathday}</span></Text>
                                }
                                <Text>Place of Birth : <span style={{ color: "gray" }}> {item.place_of_birth}</span></Text>
                                <Text>Gender : {item.gender === 1 ? "Female" : "Male"}</Text>
                                {
                                    personSocialMedias.map((sm, index) => (
                                        <Flex gap={'2rem'}>
                                            <Text>Social media's : </Text>

                                            <Link to={`https:/facebook.com/${sm.facebook_id}`} style={{ textDecoration: "none" }} target='_blank'>
                                                <Flex color={'white'} alignItems={'center'} gap={'.5rem'} fontSize={'1.1rem'}>
                                                    {/* <Text>Facebook</Text> */}
                                                    <FaFacebook />
                                                </Flex>
                                            </Link>
                                            <Link to={`https:/instagram.com/${sm.instagram_id}`} style={{ textDecoration: "none" }} target='_blank'>
                                                <Flex color={'white'} alignItems={'center'} gap={'.5rem'} fontSize={'1.1rem'}>
                                                    {/* <Text>Instagram</Text> */}
                                                    <BsInstagram />
                                                </Flex>
                                            </Link>
                                            <Link to={`https:/x.com/${sm.twitter_id}`} style={{ textDecoration: "none" }} target='_blank'>
                                                <Flex color={'white'} alignItems={'center'} gap={'.5rem'} fontSize={'1.1rem'}>
                                                    {/* <Text>X</Text> */}
                                                    <FaXTwitter />

                                                </Flex>
                                            </Link>

                                        </Flex>
                                    )
                                    )
                                }
                                <Text>Known for : <span style={{ color: "gray", marginLeft: ".6rem" }}>{item.known_for_department}</span></Text>
                                <Stack>
                                    <Text noOfLines={readMore ? "auto" : '5'} style={{ whiteSpace: 'pre-line' }}>
                                        Biography : <span style={{ color: "gray", marginLeft: ".6rem" }}>{item.biography}</span>
                                    </Text>

                                    <Button
                                        display={item.biography.split('\n').length > 5 || item.biography.split(' ').length > 130 ? "flex" : "none"}
                                        color={'white'}
                                        bg={'none'}
                                        cursor={'pointer'}
                                        border={'none'}
                                        onClick={handleReadmore}
                                        width={'fit-content'}
                                        padding={'.1rem 0'}
                                        alignItems={'center'}
                                        gap={'.5rem'}
                                    >
                                        {readMore ? "Read less" : "Read more"}
                                        {readMore ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </Button>
                                </Stack>

                                <Heading mt={'2rem'}>Known for</Heading>
                                {
                                    personMovies.map((movies, indexxx) => (
                                        <Link to={`/movie/${movies.id}`} style={{ textDecoration: "none" }}>
                                            <Flex border={'1px solid #383838'} cursor={'pointer'} borderRadius={'1rem'} p={'.5rem'} gap={'1rem'}>
                                                <Image border={'1px solid #131313'} borderRadius={'1rem'} w={'7rem'} height={'10rem'} src={`https://image.tmdb.org/t/p/w500${movies.poster_path}`} />
                                                <Flex flexDir={'column'} gap={'.4rem'}>
                                                    <Text fontWeight={'bold'} fontSize={'1.3rem'} color={'white'} >{movies.title}</Text>
                                                    <Text color={'gray'}>{movies.overview}</Text>
                                                </Flex>
                                            </Flex>
                                        </Link>
                                    ))
                                }

                            </Stack>
                        </Box>

                    </Box>

                    {/* <Box overflowX={'scroll'} my={'2rem'} sx={scrollbarStylesHorizontal}>

                        <Flex gap={'1rem'} py={'1rem'}>
                            {
                                personMovies.map((cast, index) => (
                                    <>

                                    </>
                                )
                                )
                            }
                        </Flex>
                    </Box> */}

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

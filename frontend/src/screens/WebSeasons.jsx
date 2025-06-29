import { Box, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const WebSeasons = () => {
    const { authUser } = useSelector((store) => store.user)

    const [watchNowCLicked, setWatchNowCLicked] = useState(false)
    const [ep_no, setEp_no] = useState('')
    const { id, sn } = useParams()
    const [showLoginPopUp, setShowLoginPopUp] = useState(false)
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(authUser ? true : false)

    const [season, setSeason] = useState([])
    const BaseUrl = 'https://api.themoviedb.org/3'
    const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/tv/${id}/season/${sn}?api_key=${ApiKey}`)
                setSeason([response.data])
            } catch (error) {
                console.log("Error : ", error)
            }
        }
        fetchData();
    }, [id, sn])

    const watchNow = () => {
        if (!isUserLoggedIn) {
            setShowLoginPopUp(true)
        } else {
            setWatchNowCLicked(!watchNowCLicked)
        }
    }
    const handleMovie = (episode_no) => {
        if (!isUserLoggedIn) {
            setShowLoginPopUp(true);
        } else {
            setEp_no(episode_no);
            setWatchNowCLicked(true);
        }
    };
    const handleLoginPopUp = () => {
        setShowLoginPopUp(false)
    }
    return (
        <Box w={'100%'} minH={'90vh'} bgColor={'transparent'} color={'#fff'} padding={['1rem', '2rem 3rem']}>
            {
                season.map((item, index) => (
                    <>
                        <HStack gap={'1rem'}border={'1px solid #404040'} p={'1rem 1rem'}>
                            <Image border={'1px solid #131313'} w={['4rem', '5rem']} height={['6rem', '8rem']} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
                            <VStack alignSelf={'flex-start'} alignItems={'flex-start'}>
                                <Heading>Season {item.season_number}</Heading>
                                <Text>Episodes : {item.episodes.length}</Text>
                            </VStack>
                        </HStack>

                        <Box mt={'3rem'} display={'flex'} flexDir={'column'} gap={'1rem'}>
                            {
                                item.episodes.map((ep, index) => (
                                    <Flex key={index} border={'1px solid #404040'} borderRadius={'1rem'} p={'.4rem .5rem'} overflow={'hidden'}>
                                        <Image borderRadius={'1rem'} border={'1px solid #131313'} display={['none', 'flex']} w={['8rem', '15rem']} src={`https://image.tmdb.org/t/p/w500${ep.still_path}`} />
                                        <VStack gap={'1rem'} justifyContent={'space-between'} alignItems={'flex-start'} pl={'1rem'}>
                                            <VStack alignItems={'flex-start'} gap={'.2rem'}>
                                                <Flex gap={'1rem'} mb={'.5rem'} flexDir={['column', 'row']}>
                                                    <Heading fontSize={'1.2rem'} fontWeight={'bold'}>EP : {ep.episode_number}</Heading>
                                                    <Heading fontSize={'1.2rem'}>{ep.name}</Heading>
                                                </Flex>
                                                <Text fontSize={'1rem'} opacity={'.5'}>{ep.runtime} min</Text>
                                                <Text fontSize={'1rem'} opacity={'.5'}>{ep.overview}</Text>
                                            </VStack>
                                            <Text
                                                cursor={'pointer'}
                                                onClick={() => {
                                                    if (!isUserLoggedIn) {
                                                        setShowLoginPopUp(true);
                                                    } else {
                                                        setEp_no(ep.episode_number);
                                                        setWatchNowCLicked(true);
                                                    }
                                                }}
                                                p={'.2rem 1rem'}
                                                mb={'.5rem'}
                                                bgColor={'red'}
                                                color={'white'}
                                            >
                                                Watch Episode
                                            </Text>

                                        </VStack>
                                    </Flex>
                                ))
                            }
                        </Box>


                        {/* EPISODE STREAMING CODE... */}
                        <Box
                            h={'100vh'}
                            background={'rgba(0,0,0,0.8)'}
                            zIndex={'99'}
                            w={'100vw'}
                            display={watchNowCLicked ? "flex" : 'none'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            position={'fixed'}
                            left={'0'}
                            top={'0'}
                            overflow="hidden"
                        >
                            <Box
                                width={'90%'}
                                height={'95%'}
                                display={'flex'}
                                overflow="hidden"
                            >
                                <iframe
                                    title='webseries'
                                    allowFullScreen
                                    style={{ border: "none", }}
                                    width={'100%'}
                                    height={'100%'}
                                    scrolling="no"
                                    frameborder="0"
                                    src={watchNowCLicked ? `https://vidsrc.icu/embed/tv/${id}/${sn}/${ep_no}` : ''}
                                ></iframe>
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
                    </>
                ))
            }
        </Box>
    )
}

export default WebSeasons

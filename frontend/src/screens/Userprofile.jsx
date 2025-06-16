import { Box, Button, Center, Flex, Heading, HStack, Input, SimpleGrid, Text, VStack, } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdDelete, MdDeleteOutline } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAuthUser } from '../redux/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import { BiSend } from 'react-icons/bi';


const UserProfile = () => {

  const [favorites, setFavorites] = useState([]);
  const [favSeries, setFavSeries] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [sendOtpButton, setSendOtpButton] = useState(false)
  // const [isUserVerified, setIsUserVerified] = useState(false)
  const dispatch = useDispatch()
  const { authUser } = useSelector((store) => store.user);

  const BaseUrl = 'https://api.themoviedb.org/3/movie';
  const seriesBaseUrl = 'https://api.themoviedb.org/3/tv'
  const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4';


  useEffect(() => {
    if (!authUser) return null;
    const fetchMovies = async () => {
      try {
        const movieDetails = await Promise.all(
          authUser.watchlater.map((movieId) =>
            axios
              .get(`${BaseUrl}/${movieId}?api_key=${ApiKey}`)
              .then((res) => res.data)
          )
        );
        setFavorites(movieDetails); // Store all fetched movies
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    const fetchSeries = async () => {
      try {
        const seriesDetails = await Promise.all(
          authUser.watchlater_series.map((seriesId) =>
            axios.get(`${seriesBaseUrl}/${seriesId}?api_key=${ApiKey}`)
              .then((res) => res.data)
          ));
        setFavSeries(seriesDetails)
      } catch (error) {
        console.error('Error fetching series:', error);
      }
    }

    fetchMovies();
    fetchSeries();
  }, [authUser]);

  const removeFromWishlist = async (videoId, movieName) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/add-or-remove-from-wishlist/${videoId}`,
        {},
        {
          headers: { "Content-Type ": "application/json" }, withCredentials: true
        }
      )

      if (response.status === 200) {
        dispatch(setAuthUser(response.data.updatedUser))
        toast.success(`${movieName} Removed from wishlist`, {
          position: "bottom-center",
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
          theme: "dark",
          progress: undefined
        })
      }
    } catch (error) {
      console.log("ERROR RESPONSE FRONTEND : ", error)
    }
  }
  const removeSeriesFromWishlist = async (videoId, SeriesName) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/add-or-remove-series-from-watchlater/${videoId}`,
        {},
        {
          headers: { "Content-Type ": "application/json" }, withCredentials: true
        }
      )

      if (response.status === 200) {
        dispatch(setAuthUser(response.data.updatedUser))
        toast.success(`${SeriesName} Removed from wishlist`, {
          position: "bottom-center",
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
          theme: "dark",
          progress: undefined
        })
      }
    } catch (error) {
      console.log("ERROR RESPONSE FRONTEND : ", error)
    }
  }


  const otpVerification = async () => {
    setSendOtpButton(true)
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/verify-email/${authUser?.email}/${authUser?.fullname}`,
        { userTypedOtp: otp }, { headers: { "Content-Type": "application/json" }, withCredentials: true })

      //VERIFICATION CODE SENT POPUP
      if (response.status === 201) {
        dispatch(setAuthUser(response.data.user))
        toast.success(`${response.data.message}`, {
          position: "top-center",
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
          theme: "dark",
          progress: undefined
        })
      }

      //EMAIL VERIFIED SUCCESSFULLY POPUP
      if (response.status === 200) {
        setOpenModal(false)
        dispatch(setAuthUser(response.data.user))
        toast.success(`${response.data.message}`, {
          position: "top-center",
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
          theme: "dark",
          progress: undefined
        })
      }

    } catch (error) {
      console.log("ERROR OTP VERIFICATION : ", error)
    }
  }
  return (

    <Box w={'100%'} minH={'90vh'} overflow={'hidden'} color={'white'} display={'flex'} flexDirection={'column'} p={'1rem 2rem 3rem 2rem'}>
      {/* <HStack alignItems={'flex-start'}>
        <Heading size={['sm', 'lg']}>Welcome, </Heading>
        <VStack alignItems={'start'} gap={'0rem'}>
          <Heading size={'lg'} color={'gold'}>{authUser?.fullname.toUpperCase()}</Heading>
          <Text color={'gray'}>{authUser?.email}</Text>
        </VStack>
      </HStack> */}

      {/* --------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* {
        !authUser.isEmailVerified &&
        <Flex gap={'1rem'} alignItems={'center'} mt={'2rem'} fontSize={'1.2rem'}>
          <Text color={'white'} fontWeight={'bold'}>Verify your email</Text>
          <Button colorScheme="red" onClick={() => setOpenModal(!openModal)} variant="solid" rightIcon={<RiMailLine />}>Verify  </Button>
        </Flex>
      } */}

      {/* EMAIL VERIFICATION */}

      {/* <Box h={'100vh'} background={'rgba(0,0,0,0.9)'} display={openModal ? "flex" : 'none'} zIndex={'99'} w={'100vw'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
        <VStack width={'fit-content'} bgColor={'transparent'} borderRadius={'1rem'} border={'1px solid #737373'} p={'2rem 3rem'} height={'fit-content'} display={'flex'}>
          <Heading>Email verification</Heading>
          {
            sendOtpButton ?
              <VStack gap={'1rem'} mt={'2rem'} w={'100%'}>
                <Input color={'black'} maxLength={6} fontWeight={'bold'} border={'none'} onChange={(e) => setOtp(e.target.value)} value={otp} bgColor={'white'} placeholder='Enter Verification code' type='text' />
                <Button w={'100%'} isDisabled={otp.length >= 6 ? false : true} colorScheme='red' onClick={otpVerification}>Verify</Button>
                <Text fontWeight={'bold'}>*Verification code sent to your email id</Text>

                <Flex border={'1px solid #727272'} alignItems={'center'} gap={'.7rem'} p={'.2rem .7rem'} alignSelf={'start'} ml={'.3rem'} fontSize={'.9rem'} fontWeight={'bold'} cursor={'pointer'}>
                  <Text >resend code</Text>
                  <BiSend />
                </Flex>
              </VStack>
              :
              <VStack gap={'1rem'} mt={'2rem'} w={'100%'}>
                <Input color={'black'} fontWeight={'bold'} border={'none'} bgColor={'white'} value={authUser?.email} type='text' />
                <Button w={'100%'} rightIcon={<BiSend />} colorScheme='purple' onClick={otpVerification}>Send OTP</Button>
              </VStack>
          }
          <Text mt={'2rem'} border={'1px solid #737373'} p={'.4rem 2rem'} fontWeight={'bold'} cursor={'pointer'} onClick={() => setOpenModal(!openModal)}>Cancel</Text>
        </VStack>
      </Box> */}

      {/* ------------------------------------------------------------------------------------------------------------------------------ */}

      <Heading alignSelf={'center'} color={'#FC4444'}>Watch Later</Heading>
      {/* MOVIES WATCHLATER CODE BELOW */}
      {
        favorites.length > 0 || favSeries.length > 0 ?

          <>
            {
              favorites.length > 0 &&
              <Box overflowX={'scroll'} my={'1rem'} sx={scrollbarStylesHorizontal}>


                <Heading  pb={'.5rem'} color={'teal'}>MOVIES</Heading>
                <Flex gap={'2rem'} py={'1rem'}>

                  {/* <SimpleGrid pb={'2rem'} columns={[2, 3, 5, 7]} px={['0', '1rem']} spacing={'2rem'}> */}
                  {
                    favorites.map((item, idx) => (
                      <Box w={'fit-content'} display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} >

                        <Link to={`/movie/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} key={idx}>
                          <Box _hover={{ border: "2px solid transparent" }} transition={'.1s ease-in-out'} border={'none'} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={['8.5rem', '10.5rem']} height={['14rem', '16rem']} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                            <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.title}</Text>
                          </Box>
                        </Link>

                        <Button w={'100%'}
                          border={'none'} fontWeight={'bold'}
                          onClick={() => removeFromWishlist(item.id, item.title)}
                          color={'white'} size={'xs'} alignSelf={['center', 'start']}
                          borderRadius={'0rem'} variant={'solid'} colorScheme='red'
                          cursor={'pointer'} leftIcon={<MdDelete />}>
                          Remove
                        </Button>

                      </Box>
                    ))
                  }
                </Flex>
                {/* </SimpleGrid> */}
              </Box>
            }

            {/* SERIES WATCHLATER CODE BELOW */}
            {
              favSeries.length > 0 &&
              <Box overflowX={'scroll'} my={'3rem'} sx={scrollbarStylesHorizontal}>
                <Heading pb={'.5rem'} color={'teal'}>TV SHOWS & SERIES </Heading>

                <Flex gap={'2rem'} py={'1rem'}>


                  {/* <SimpleGrid pb={'2rem'} columns={[2, 3, 5, 7]} px={['0', '1rem']} spacing={'2rem'}> */}
                  {
                    favSeries.map((item, idx) => (
                      <Box w={'fit-content'} display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} >

                        <Link to={`/series/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} key={idx}>
                          <Box _hover={{ border: "2px solid transparent" }} transition={'.1s ease-in-out'} border={'none'} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={['8.5rem', '10.5rem']} height={['14rem', '16rem']} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                            <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.name}</Text>
                          </Box>
                        </Link>

                        <Button w={'100%'}
                          border={'none'} fontWeight={'bold'}
                          onClick={() => removeSeriesFromWishlist(item.id, item.name)}
                          color={'white'} size={'xs'} alignSelf={['center', 'start']}
                          borderRadius={'0rem'} variant={'solid'} colorScheme='red'
                          cursor={'pointer'} leftIcon={<MdDelete />}>
                          Remove
                        </Button>

                      </Box>
                    ))
                  }
                </Flex>
                {/* </SimpleGrid> */}
              </Box>
            }
          </>
          : <Center py={'2rem'}>
            <Heading>Watch Later is empty, Add some movies or Series.</Heading>
          </Center>
      }
      <ToastContainer />
    </Box>
  );
};
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
export default UserProfile;

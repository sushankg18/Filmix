import { Box, Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [favorites, setFavorites] = useState([]); // Movies data
  const { authUser } = useSelector((store) => store.user);

  const BaseUrl = 'https://api.themoviedb.org/3/movie';
  const ApiKey = 'a8d7d1e8391d7a5863bd8bdd945d63b4';

  useEffect(() => {
    if (!authUser) return null;
    const fetchMovies = async () => {
      try {
        const movieDetails = await Promise.all(
          authUser.wishlist.map((movieId) =>
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

    fetchMovies();
  }, [authUser]);

  console.log("FAVORITE MOVIES : ", favorites)
  return (

    <Box w={'100%'} minH={'90vh'} display={'flex'} flexDirection={'column'} p={'1rem 2rem 3rem 2rem'}>
      <Heading mb={5}>{authUser?.fullname.toUpperCase()}</Heading>

      <Heading mt={'3rem'}>Wishlist</Heading>

      {
        favorites.length > 0 ?


          <Box overflowX={'scroll'} my={'1rem'} sx={scrollbarStylesHorizontal}>
            <Flex gap={'2rem'} pb={'1rem'}>
              {
                favorites.map((item, idx) => (
                  <Box w={'fit-content'}>
                    <Link to={`/movie/${item.id}`} style={{ textDecoration: "none", width: "fit-content" }} target='_blank' key={idx}>
                      <Box _hover={{ border: "3px solid orange" }} cursor={'pointer'} position={'relative'} boxShadow={' inset 0px -55px 25px 0px #121212'} width={'10.5rem'} height={'16rem'} bgPosition={'center'} bgSize={'contain'} bgRepeat={'no-repeat'} bgImage={`https://image.tmdb.org/t/p/w500${item.poster_path}`} gap={'1rem'} display={'flex'} flexDir={'column'}>
                        <Text noOfLines={'2'} position={'absolute'} color={'white'} textAlign={'center'} bottom={'3'} fontWeight={'bold'} padding={'0 .4rem'}>{item.title}</Text>
                      </Box>
                    </Link>
                    <Flex cursor={'pointer'} justifyContent={'space-evenly'} bgColor={'#171717'} mt={'.5rem'} p={'.3rem .2rem'} gap={'.3rem'} alignItems={'center'} w={'100%'}>
                      <HStack>
                        <Text color={'white'}>Remove </Text>
                        <MdDeleteOutline color='red'/>
                      </HStack>
                    </Flex>

                  </Box>
                ))
              }
            </Flex>
          </Box>
          :
          <Center py={'2rem'}>
            <Heading>Your wishlist is empty, Add some movies or webseries.</Heading>
          </Center>
      }
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

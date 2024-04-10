import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Input, Text, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NoImageAvailable from '../Assets/noimageavailable.png'
const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=a8d7d1e8391d7a5863bd8bdd945d63b4&query=${searchTerm}`);
        console.log(response.data.results);
        setSearchResults(response.data.results.slice(0, 5));
      } catch (error) {
        console.log('Got an Error', error);
      }
    };
    if (searchTerm.trim() !== '') {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <Box w={'100%'} display={'flex'} borderBottom={'.1rem solid #121212'} alignItems={'center'} justifyContent={'space-between'} h={'fit-content'} p={'1rem 2rem'} >
      <Box>
        <Link to={'/'} style={styles} >
          <Text fontWeight={'bold'} textDecoration={'none'} cursor={'pointer'} fontSize={'xx-large'}>
            FILMIX
          </Text>
        </Link>
      </Box>
      <Box w={'30%'} position={'relative'}>
        <Input placeholder='Enter any movie or tv series' onChange={(e) => { setSearchTerm(e.target.value) }} backgroundColor={'#fff'} width={'100%'} border={'none'} padding={'.3rem 1rem'} color={'black'} fontWeight={'bold'} outline={'none'} />
        {
          searchResults.length > 0 && (

            <Box height={'40vh'} mt={'1rem'} bgColor={'black'} position={'absolute'} w={'100%'} zIndex={'99'}>
              {
                searchResults.map((item, index) => (
                  <Link to={`/${item.media_type}/${item.id}`} target='_blank' style={{ textDecoration: "none" }} onClick={() => { setSearchTerm('') }}>
                    <Flex borderBottom={'1px solid #131313'} p={'.2rem 1rem'} mb={'1rem'} height={'2.7rem'} gap={'1rem'}>
                      <Image w={'2rem'} bgColor={'white'} src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : NoImageAvailable} />
                      <Stack gap={'0rem'}>
                        <Text color={'white'}>{item.name || item.title}</Text>
                        <Text color={'#828282'} fontSize={'.8rem'}>{item.media_type}</Text>
                      </Stack>

                    </Flex>
                  </Link>
                ))
              }
            </Box>
          )
        }
      </Box>
      <Box display={'flex'} gap={'2rem'}>
        <Text cursor={'pointer'}>Bollywood</Text>
        <Text cursor={'pointer'}>WebSeries</Text>
        <Text cursor={'pointer'}>Anime</Text>
      </Box>
    </Box>
  );
};

const styles = {
  textDecoration: "none",
  color: "#fc4444"
};

export default Navbar;

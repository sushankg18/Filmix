import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Input, Text, Stack, Menu, MenuButton, MenuItem, MenuList, Circle, useToast, HStack, SimpleGrid } from '@chakra-ui/react';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoImageAvailable from '../Assets/noimageavailable.png';
import { MdOutlineLogout, MdOutlineSearch } from "react-icons/md";
import { CiBookmark, CiSettings } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { setGenreName } from '../redux/movieSlice';
import { IoClose, IoSettingsOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([])
  const [showSearchBar, setShowSearchBar] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authUser } = useSelector(store => store.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=a8d7d1e8391d7a5863bd8bdd945d63b4&query=${searchTerm}`);
        setSearchResults(response.data.results.slice(0, 8));
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


  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=a8d7d1e8391d7a5863bd8bdd945d63b4&language=en-US`);
        setGenres(genresResponse.data.genres);
      } catch (error) {
        console.log('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/user/logout",{withCredentials: true})
      console.log("USER LOGOUT SUCCESSFULLY", response)
      dispatch(setAuthUser(null))
      toast.success('User logged out', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
      );
    } catch (error) {
      console.log("Got error while logout : ", error)
    }
    // navigate('/')
  };

  const setGenreNameFun = (name) => {
    dispatch(setGenreName(name));
  }
  return (
    <>
      <Box w={'100%'} display={'flex'} borderBottom={'.1rem solid #121212'} alignItems={'center'} justifyContent={'space-between'} h={'fit-content'} p={'1rem 2rem'}>
        <Box userSelect={'none'}>
          <Link to={'/'} style={styles}>
            <Text fontWeight={'bold'} textDecoration={'none'} cursor={'pointer'} fontSize={'xx-large'}>
              FILMIX
            </Text>
          </Link>
        </Box>

        <Box display={'flex'} alignItems={'center'} gap={'2rem'}>
          <Text cursor={'pointer'} color={'white'}>Hollywood</Text>
          <Link to={'/series'} style={{ textDecoration: "none" }}>
            <Text cursor={'pointer'} color={'white'}>Series</Text>
          </Link>
          <Menu  >
            <MenuButton bg={'none'} cursor={'pointer'} border={'1px solid gray'} color={'white'} p={'.2rem 1rem'}>
              <HStack>
                <Text fontSize={'1.1rem'}>Genres  </Text>
                <MdOutlineKeyboardArrowDown fontSize={'1.4rem'} />
              </HStack>
            </MenuButton>
            <MenuList bgColor={'black'} zIndex={'99'} display={'grid'} gap={'0.5rem'} p={'2rem .3rem'} gridTemplateColumns={'repeat(3, 1fr)'}>
              {
                genres.map((genre, idx) => {
                  return (
                    <Link to={`/genre/${genre.id}`} onClick={() => setGenreNameFun(genre.name)} key={genre.id} style={{ textDecoration: "none" }}>
                      <MenuItem key={genre.id} border={'none'} fontSize={'1.2rem'} cursor={'pointer'} display={'flex'} flexDir={'column'} bgColor={'black'}>
                        <Text p={'.2rem 1rem'} w={'100%'} _hover={{ color: "red" }} bgColor={'black'} color={'white'}>{genre.name}</Text>
                      </MenuItem>
                    </Link>
                  )
                })
              }
            </MenuList>
          </Menu>


          <Flex cursor={'default'} userSelect={'none'} onClick={() => setShowSearchBar(!showSearchBar)}>
            <Flex alignItems={'center'} fontSize={'1.5rem'} cursor={'pointer'} gap={'1rem '} color={'white'} p={'.3rem .5rem'}>
              {
                showSearchBar ?
                  <IoClose />
                  :
                  <MdOutlineSearch />
              }
            </Flex>

          </Flex>

          {authUser ? (

            <Menu>

              <MenuButton border={'none'} color={'white'} borderRadius={'100%'} cursor={'pointer'} bgColor={'brown'} fontSize={'1.5rem'} >
                <Box w={'2rem'} h={'2.2rem'} bgColor={'white'} color={'black'} borderRadius={'100%'}>
                  {
                    authUser &&
                    authUser.fullname.slice(0, 1)}
                </Box>
              </MenuButton>

              <MenuList zIndex={'99'} display={'flex'} p={'.8rem 2rem'} bgColor={'#1D1B11'} fontWeight={'900'} flexDir={'column'} gap={'.4rem'}>

                <MenuItem display={'flex'} bg={'transparent'} flexDir={'column'} fontSize={'1rem'} border={'none'} gap={'.5rem'} fontWeight={'700'} color={'white'} p={'.3rem 1rem'} w={'100%'}>
                  <Circle bgColor={'brown'} color={'white'} w={'4rem'} h={'4rem'}>
                    {authUser.fullname.charAt(0).toUpperCase()}
                  </Circle>

                  {authUser.fullname.charAt(0).toUpperCase() + authUser.fullname.slice(1)}
                </MenuItem>

                <Flex flexDir={'column'} gap={'1rem'}>
                  <Text fontSize={'.8rem'}>Manage</Text>
                  <Link to={`/user/${authUser?.fullname}`} style={{ textDecoration: "none" }}>
                    <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
                      <CiBookmark />
                      My wishlist
                    </MenuItem>
                  </Link>
                  <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
                    <IoSettingsOutline />
                    Account settings
                  </MenuItem>
                  <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} onClick={handleLogout} p={'.3rem 1rem'} w={'100%'}>
                    <MdOutlineLogout />
                    Sign Out
                  </MenuItem>


                </Flex>
              </MenuList>

            </Menu>

          ) : (
            <Link to={'/login'} style={{ textDecoration: "none", color: "white" }}>
              <Text bgColor={'#ff3300'} fontWeight={'900'} p={'.2rem 1rem'}>Login</Text>
            </Link>
          )}
        </Box>

      </Box >
      {
        showSearchBar ?
          <Flex w={'100%'} justifyContent={'center'} position={'relative'}>
            < Input _placeholder={{ color: "black" }
            } fontSize={'1.2rem'} placeholder='Search for any movie or TV series' onChange={(e) => setSearchTerm(e.target.value)} backgroundColor={'white'} width={'100%'} padding={'.3rem 1rem'} color={'black'} fontWeight={'bold'} outline={'none'} />
            {
              searchResults.length > 0 && (
                <Box minH={'fit-content'} mt={'1rem'} bgColor={'black'} top={'2rem'} position={'absolute'} w={'100%'} zIndex={'99'}>
                  <SimpleGrid columns={2} spacing={'1rem'}>
                    {searchResults.map((item, index) => (
                      <Link key={index} to={item.media_type === "tv" ? `/series/${item.id}` : item.media_type === "movie" ? `/movie/${item.id}` : `/person/${item.id}`} style={{ textDecoration: "none" }} onClick={() => { setSearchTerm(''); setShowSearchBar(false) }}>
                        <Flex borderBottom={'1px solid #131313'} p={'.2rem 1rem'} mb={'1rem'} height={'5rem'} gap={'1rem'}>
                          <Image w={'3.5rem'} h={'5rem'} bgColor={'white'} src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : NoImageAvailable} />
                          <Stack gap={'0rem'} justifyContent={'center'}>
                            <Text fontSize={'1.1rem'} fontWeight={'bold'} color={'white'}>{item.name || item.title}</Text>
                            <Text color={'#828282'} fontSize={'.9rem'}>{item.media_type}</Text>
                          </Stack>
                        </Flex>
                      </Link>
                    ))}
                  </SimpleGrid>
                </Box>
              )
            }
          </Flex >
          :
          <Box color={'#fff'} fontSize={'.9rem'} mt={'.5rem'} userSelect={'none'} cursor={'default'}>
            <marquee> NOTE : Please use *Brave Browser or any Ad free browser while streaming movies on this website to block intrusive ads, as we have no control over the ads displayed. Your understanding is appreciated! </marquee>
          </Box>
      }

    </>
  );
};

const styles = {
  textDecoration: "none",
  color: "#fc4444"
};

export default Navbar;

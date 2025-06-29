import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, Image, Input, Text, Stack, Menu, MenuButton, MenuItem, MenuList, Circle, HStack, SimpleGrid, Avatar, VStack, Button } from '@chakra-ui/react';
import { MdOutlineContactSupport, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import NoImageAvailable from '../Assets/noimageavailable.png';
import { MdOutlineLogout, MdOutlineSearch } from "react-icons/md";
import { CiBookmark, CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { setGenreName } from '../redux/movieSlice';
import { IoClose, IoSettingsOutline, IoMenu, IoFlash } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { IoMdArrowDropdown, IoMdInformationCircleOutline } from 'react-icons/io';
import { GrFormNextLink } from "react-icons/gr";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([])
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showGenre, setShowGenre] = useState(false)

  const [AiPrompt, setAiPrompt] = useState("");
  const [results, setResults] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authUser } = useSelector(store => store.user)

  //NEW SEARCH THROUGH AI FUNCTIONALITY
  const handleAIPromptSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/ai/suggest-movie", {
        AiPrompt
      })
      console.log("RESPONEEE AIII : ", response)
      setResults(response.data.movies)
    } catch (error) {
      console.log("Error fetching from AI suggestion route : ", error)
    }
  }

  //MOVIE SEARCH FETCHING THROUGH SEARCH BAR
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

  //GENRE FETCHING
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

  // LOGOUT HANDLING
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true })
      dispatch(setAuthUser(null))
      toast.success('User logged out', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
      );
      navigate('/')
    } catch (error) {
      console.log("Got error while logout : ", error)
    }
  };

  const setGenreNameFun = (name) => {
    dispatch(setGenreName(name));
  }
  return (
    <Box bgColor={'transparent'}>
      <Box w={['100vw', '100%']} bgColor={'transparent'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} h={'fit-content'} p={['1rem 1rem', '1rem 2rem']}>
        <Box userSelect={'none'}>
          <Link to={'/'} style={styles}>
            <Text fontWeight={'bold'} textDecoration={'none'} cursor={'pointer'} fontSize={['x-large', 'xx-large']}>
              FILMIX
            </Text>
          </Link>
        </Box>

        <Flex minW={'30%'}>
          <sup>
            <Flex color={'#FC4444'} gap={'.2rem'} alignItems={'center'} fontSize={'1.2rem'} >
              <sup>New</sup>
              <sup>AI</sup>
              <sup>
                <IoFlash />
              </sup>
            </Flex>
          </sup>
          <Input placeholder='what do you feel like watching today?' _hover={{ borderColor: "rgb(42, 42, 45)" }} border={'1px solid rgb(42, 42, 45)'} focusBorderColor='rgb(42, 42, 45)' value={AiPrompt} onChange={(e) => setAiPrompt(e.target.value)} color={'white'} />
          <Button _hover={{ borderColor: "rgb(42, 42, 45)" }} variant={'outline'} border={'1px solid rgb(42, 42, 45)'} color={'white'} onClick={() => handleAIPromptSubmit()}>
            <CiSearch fontSize={'2rem'} />
          </Button>
        </Flex>


        <Box display={['none', 'flex']} alignItems={'center'} gap={'2rem'}>
          <Link to={'/series'} style={{ textDecoration: "none" }}>
            <Text cursor={'pointer'} color={'white'}>Series</Text>
          </Link>
          <Menu  >
            <MenuButton bg={'none'} cursor={'pointer'} color={'white'} p={'.2rem 1rem'}>
              <HStack>
                <Text fontSize={'1.1rem'}>Genres  </Text>
                <MdOutlineKeyboardArrowDown fontSize={'1.4rem'} />
              </HStack>
            </MenuButton>
            <MenuList border={'1px solid #313131'} bgColor={'#0C101B'} zIndex={'99'} display={'grid'} gap={'0.5rem'} p={'2rem .3rem'} gridTemplateColumns={'repeat(3, 1fr)'}>
              {
                genres.map((genre, idx) => {
                  return (
                    <Link to={`/genre/${genre.id}`} onClick={() => setGenreNameFun(genre.name)} key={genre.id} style={{ textDecoration: "none" }}>
                      <MenuItem key={genre.id} border={'none'} fontSize={'1.2rem'} cursor={'pointer'} display={'flex'} flexDir={'column'} bgColor={'transparent'}>
                        <Text p={'.2rem 1rem'} w={'100%'} _hover={{ color: "red" }} bgColor={'transparent'} color={'white'}>{genre.name}</Text>
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

            <Menu >
              <MenuButton border={'none'} color={'white'} borderRadius={'100%'} cursor={'pointer'} fontSize={'1.5rem'} >
                <Avatar name={authUser?.fullname} w={'2.5rem'} h={'2.5rem'} borderRadius={'100%'} />
              </MenuButton>

              <MenuList border={'none'} zIndex={'99'} display={'flex'} p={'.8rem 2rem'} bgColor={'#1D1B11'} fontWeight={'900'} flexDir={'column'} gap={'.4rem'}>

                <MenuItem display={'flex'} bg={'transparent'} flexDir={'column'} fontSize={'1rem'} border={'none'} gap={'.5rem'} fontWeight={'700'} color={'white'} p={'.3rem 1rem'} w={'100%'}>
                  <Circle bgColor={'brown'} color={'white'} w={'4rem'} h={'4rem'}>
                    {authUser?.fullname.charAt(0).toUpperCase()}
                  </Circle>

                  {authUser?.fullname.charAt(0).toUpperCase() + authUser.fullname.slice(1)}
                </MenuItem>


                <Flex flexDir={'column'} color={'white'} gap={'1rem'}>
                  <Text fontSize={'.8rem'}>Manage</Text>

                  <Link to={`/user/${authUser?.fullname}`} style={{ textDecoration: "none" }}>
                    <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
                      <CiBookmark />
                      Watch Later
                    </MenuItem>
                  </Link>


                  <Link to={'/about'} style={{ textDecoration: "none" }}>
                    <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
                      <IoSettingsOutline />
                      About
                    </MenuItem>
                  </Link>
                  <Link to={'/contact-us'} style={{ textDecoration: "none" }}>
                    <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
                      <IoSettingsOutline />
                      Contact Us
                    </MenuItem>
                  </Link>
                  <MenuItem h={'2rem'} _hover={{ bgColor: "white", color: "black" }} cursor={'pointer'} fontSize={'1rem'} border={'none'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} onClick={handleLogout} p={'.3rem 1rem'} w={'100%'}>
                    <MdOutlineLogout />
                    Sign Out
                  </MenuItem>


                </Flex>
              </MenuList>

            </Menu>

          ) : (
            <Flex alignItems={'center'} gap={'1.5rem'}>
              <Link to={'/about'} style={{ textDecoration: "none", color: "white" }}>
                <Text>About us</Text>
              </Link>
              <Link to={'/login'} style={{ textDecoration: "none", color: "white" }}>
                <Text bgColor={'#ff3300'} fontWeight={'900'} p={'.2rem 1rem'}>Login</Text>
              </Link>
            </Flex>
          )}
        </Box>

        {/* MOBILE VIEW MENU   */}
        <Flex display={['flex', 'none']} alignItems={'center'} fontSize={'1.5rem'} gap={'1.5rem'}>
          <Flex position={'relative'} gap={'1rem'} alignItems={'center'} cursor={'default'} userSelect={'none'} >
            <Flex onClick={() => setShowSearchBar(!showSearchBar)} alignItems={'center'} fontSize={'1.5rem'} cursor={'pointer'} gap={'1rem '} color={'white'} p={'.3rem .5rem'}>
              {
                showSearchBar ?
                  <IoClose />
                  :
                  <MdOutlineSearch />
              }
            </Flex>

            <Text onClick={() => { setShowMenu(!showMenu); setShowGenre(false) }}>
              <IoMenu color='white' />
            </Text>

          </Flex>
        </Flex>


        <VStack zIndex={'99'} position={'absolute'} top={'4rem'} p={'1rem'} bgColor={'#191919'} right={'1'} display={showMenu ? "flex" : "none"}>
          {
            authUser &&
            <>
              <VStack bg={'transparent'} onClick={() => setShowMenu(false)} flexDir={'column'} fontSize={'1rem'} gap={'.5rem'} fontWeight={'700'} color={'white'} w={'100%'}>
                <Circle bgColor={'brown'} color={'white'} w={'4rem'} h={'4rem'}>
                  {authUser?.fullname.charAt(0).toUpperCase()}
                </Circle>
                <Text>
                  {authUser?.fullname.charAt(0).toUpperCase() + authUser?.fullname.slice(1)}
                </Text>
              </VStack>

              <VStack alignItems={'start'} h={'2rem'} cursor={'pointer'} fontSize={'1rem'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
                <Flex gap={'.5rem'} alignItems={'center'} onClick={() => setShowMenu(false)}>
                  <CiBookmark />
                  Watch Later
                </Flex>
              </VStack>

            </>
          }
          <Link to={`/series`} style={{ textDecoration: "none" }}>
            <VStack alignItems={'start'} h={'2rem'} cursor={'pointer'} fontSize={'1rem'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
              <Flex gap={'.5rem'} alignItems={'center'} onClick={() => setShowMenu(false)}>
                <GrFormNextLink />
                Watch Series
              </Flex>
            </VStack>
          </Link>

          <VStack bgColor={'#191919'} alignItems={'start'} cursor={'pointer'} fontSize={'1rem'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
            <HStack gap={'1rem'} onClick={() => setShowGenre(!showGenre)}>
              <IoMdArrowDropdown />
              <Text>Genres</Text>
            </HStack>
            {
              showGenre &&
              <>
                {
                  genres.map((genre, idx) => {
                    return (
                      <Link to={`/genre/${genre.id}`} onClick={() => setGenreNameFun(genre.name)} key={genre.id} style={{ textDecoration: "none" }}>
                        <Flex onClick={() => { setShowMenu(false); setShowGenre(false) }} key={genre.id} border={'none'} fontSize={'1rem'} cursor={'pointer'} display={'flex'} flexDir={'column'}>
                          <Text p={'.2rem 1rem'} w={'100%'} color={'gray'}>{genre.name}</Text>
                        </Flex>
                      </Link>
                    )
                  })
                }
              </>
            }
          </VStack>

          <VStack alignItems={'start'} h={'2rem'} cursor={'pointer'} fontSize={'1rem'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
            <Link to={'/about'} style={{ textDecoration: "none" }}>
              <HStack gap={'1rem'} onClick={() => setShowMenu(false)}>
                <IoMdInformationCircleOutline />
                <Text>About</Text>
              </HStack>
            </Link>
          </VStack>

          <VStack alignItems={'start'} h={'2rem'} cursor={'pointer'} fontSize={'1rem'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
            <Link to={'/contact-us'} style={{ textDecoration: "none" }}>
              <HStack gap={'1rem'} onClick={() => setShowMenu(false)}>
                <MdOutlineContactSupport />
                <Text>Contact us</Text>
              </HStack>
            </Link>
          </VStack>

          <VStack alignItems={'start'} h={'2rem'} cursor={'pointer'} fontSize={'1rem'} bg={'transparent'} color={'white'} fontWeight={'700'} gap={'1rem'} p={'.3rem 1rem'} w={'100%'}>
            <HStack gap={'1rem'} onClick={authUser ? handleLogout : () => { navigate('/login'); setShowMenu(false) }}>
              <MdOutlineLogout />
              <Text>
                {
                  authUser ? "Sign out" : "Login"
                }
              </Text>
            </HStack>
          </VStack>


        </VStack>
        {/*   **MOBILE VIEW MENU ENDS***  */}

      </Box >


      {
        showSearchBar ?
          <Flex w={'100%'} justifyContent={'center'} position={'relative'}>
            <Input _placeholder={{ color: "black" }} fontSize={['.9rem', '1rem']} size={'sm'} placeholder='Search for any movie or TV series' onChange={(e) => setSearchTerm(e.target.value)} backgroundColor={'white'} width={'100%'} padding={'.3rem 1rem'} color={'black'} fontWeight={'bold'} outline={'none'} />
            {
              searchResults.length > 0 && (
                <Box minH={'fit-content'} mt={'1rem'} bgColor={'black'} top={'2rem'} position={'absolute'} w={'100%'} zIndex={'99'}>
                  <SimpleGrid columns={2} spacing={'1rem'}>
                    {searchResults.map((item, index) => (
                      <Link key={index} to={item.media_type === "tv" ? `/series/${item.id}` : item.media_type === "movie" ? `/movie/${item.id}` : `/person/${item.id}`} style={{ textDecoration: "none" }} onClick={() => { setSearchTerm(''); setShowSearchBar(false) }}>
                        <Flex borderBottom={'1px solid #131313'} p={'.2rem 1rem'} mb={'1rem'} height={'5rem'} gap={'1rem'}>
                          <Image w={'3.5rem'} h={'5rem'} bgColor={'white'} src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : NoImageAvailable} />
                          <Stack gap={'0rem'} justifyContent={'center'}>
                            <Text fontSize={'1rem'} fontWeight={'bold'} color={'white'}>{item.name || item.title}</Text>
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
          <Box color={'#fff'} bgColor={'transparent'} fontSize={'.9rem'} mt={'.5rem'} userSelect={'none'} cursor={'default'}>
            <marquee> NOTE : <span style={{ color: "gold" }}> Please use *Brave Browser or any Ad free browser</span> while streaming movies on this website to block intrusive ads, as we have no control over the ads displayed. Your understanding is appreciated! </marquee>
          </Box>
      }
    </Box>
  );
};

const styles = {
  textDecoration: "none",
  color: "#fc4444"
};

export default Navbar;

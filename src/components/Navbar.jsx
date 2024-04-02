import React,{useState, useEffect} from 'react'
import { Box, Input, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const Navbar = () => {
  

  const styles = {
    textDecoration: "none",
    color: "#fc4444"
  };
  return (
    <Box w={'100%'} display={'flex'} borderBottom={'.1rem solid #121212'} justifyContent={'space-between'} h={'fit-content'} p={'1rem 2rem'} >
      <Box>
        <Link to={'/'} style={styles} >
          <Text fontWeight={'bold'} textDecoration={'none'} cursor={'pointer'} fontSize={'x-large'}>
            FILMIX
          </Text>
        </Link>
      </Box>
      <Box>
        <Input placeholder='Enter any movie' backgroundColor={'#C7C7C7'} padding={'.3rem 1rem'} color={'black'} fontWeight={'bold'} outline={'none'} />
      </Box>
      <Box display={'flex'} gap={'2rem'}>
        <Text cursor={'pointer'}>Bollywood</Text>
        <Text cursor={'pointer'}>WebSeries</Text>
        <Text cursor={'pointer'}>Anime</Text>
      </Box>
    </Box>
  )
}

export default Navbar

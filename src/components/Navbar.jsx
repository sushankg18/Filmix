import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const Navbar = () => {
  return (
    <Box w={'100%'} display={'flex'} borderBottom={'.1rem solid #121212'} justifyContent={'space-between'} h={'fit-content'} p={'1rem 2rem'} >
      <Box>
        <Text fontWeight={'bold'} cursor={'pointer'} fontSize={'x-large'}>
          FILMIX
        </Text>
      </Box>

      <Box display={'flex'} gap={'2rem'}>
        <Text>Bollywood</Text>
        <Text>WebSeries</Text>
        <Text>Anime</Text>
      </Box>
    </Box>
  )
}

export default Navbar

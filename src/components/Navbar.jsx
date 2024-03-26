import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const Navbar = () => {
  return (
    <Box w={'100%'} display={'flex'} justifyContent={'space-between'} h={'fit-content'} p={'1rem 2rem'} bgColor={'whitesmoke'}>
      <Box>
        <Text>
          Logo
        </Text>
      </Box>

      <Box display={'flex'} gap={'2rem'}>
        <Text>HOME</Text>
        <Text>BOLLYWOOD</Text>
        <Text>HOME</Text>
      </Box>
    </Box>
  )
}

export default Navbar

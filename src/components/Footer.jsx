import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
    return (
        <Box borderTop={'1px solid #121212'} bgColor={'#131313'} minH={'20vh'} padding={'2rem 0'} display={'flex'} gap={'2rem'} justifyContent={'center'}>
            <Box display={'flex'} flexDir={'column'} gap={'.5rem'}>
                <Heading>THE BASICS</Heading>
                <Text>About Filmix</Text>
                <Text>Contact Us</Text>
                <Text>Support Forums</Text>
                <Text>System Status</Text>
            </Box>
            <Box display={'flex'} flexDir={'column'} gap={'.5rem'}>
                <Heading>GET INVOLVED</Heading>
                <Text>Contribution Bible</Text>
            </Box>
            <Box display={'flex'} flexDir={'column'} gap={'.5rem'}>
                <Heading>COMMUNITY</Heading>
                <Text>Guidelines</Text>
                <Text>Dicussions</Text>
                <Text>Leaderboard</Text>
            </Box>
            <Box display={'flex'} flexDir={'column'} gap={'.5rem'}>
                <Heading>LEGAL</Heading>
                <Text>Terms of use</Text>
                <Text>Privacy Policy</Text>
                <Text>DMCA Policy</Text>
            </Box>
        </Box>
    )
}

export default Footer

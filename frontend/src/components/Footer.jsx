import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <Box borderTop={'1px solid #414141'} minH={'20vh'} padding={'2rem 2rem'} display={'flex'} gap={'2rem'} justifyContent={'center'}>

            <VStack gap={'1.5rem'} fontSize={'1.4rem'}  >
                <Heading color={'white'} fontSize={'2rem'}>FILMIX</Heading>
                <Flex gap={'1.2rem'} >
                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }}>
                        <Text _hover={{ color: "white" }} transition={'.2s all ease-in-out'}>
                            <FaGithub />
                        </Text>
                    </Link>

                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }}>
                        <Text _hover={{ color: "white" }} transition={'.2s all ease-in-out'}>
                            <FaLinkedin />
                        </Text>
                    </Link>

                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }}>
                        <Text _hover={{ color: "white" }} transition={'.2s all ease-in-out'}>
                            <FaTwitter />
                        </Text>
                    </Link>
                </Flex>
                <Flex flexDir={'column'} gap={'.3rem'} alignItems={'center'} fontSize={'.9rem'}>
                    <Text color={'#9CA3AF'} >Filmix &nbsp; © 2024 |&nbsp; All&nbsp; Rights&nbsp; Reserved.</Text>
                    <Text><span style={{ color: "#9CA3AF" }}>Made &nbsp;by</span>&nbsp; Sushank &nbsp;gautam</Text>
                </Flex>
            </VStack>
        </Box>
    )
}

export default Footer

import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <Box borderTop={'1px solid #414141'} bgColor={'transparent'} minH={'20vh'} padding={'2rem 2rem'} display={'flex'} gap={'2rem'} justifyContent={'center'}>

            <VStack gap={'1.3rem'} fontSize={'1.4rem'}  >
                <Heading color={'white'} fontSize={'2rem'}>FILMIX</Heading>
                <Flex color={'#9CA3AF'} fontSize={'.9rem'}>
                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }} to={'/about'}>
                        <Text  >About &nbsp;| </Text>
                    </Link>
                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }} to={'/contact-us'}>
                        <Text>&nbsp; Contact Us</Text>
                    </Link>
                </Flex>
                <Flex gap={'1.2rem'} >
                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }} target='_blank' to={'https://github.com/sushankg18'}>
                        <Text _hover={{ color: "white" }} transition={'.2s all ease-in-out'}>
                            <FaGithub />
                        </Text>
                    </Link>

                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }} target='_blank' to={'https://www.linkedin.com/in/sushank-gautam-a99685249/'}>
                        <Text _hover={{ color: "white" }} transition={'.2s all ease-in-out'}>
                            <FaLinkedin />
                        </Text>
                    </Link>

                    <Link style={{ textDecoration: "none", color: "#9CA3AF" }} target='_blank' to={'https://www.instagram.com/sushankk_gotnolife/'}>
                        <Text _hover={{ color: "white" }} transition={'.2s all ease-in-out'}>
                            <FaInstagram />
                        </Text>
                    </Link>
                </Flex>
                <Flex flexDir={'column'} gap={'.3rem'} alignItems={'center'} fontSize={['.8rem','.9rem']}>
                    <Text color={'#9CA3AF'} >Filmix &nbsp; © 2025 |&nbsp; All&nbsp; Rights&nbsp; Reserved.</Text>
                    <Text color={'white'}><span style={{ color: "#9CA3AF" }}>Made &nbsp;by</span>&nbsp; Sushank &nbsp;gautam 💗</Text>
                </Flex>
            </VStack>
        </Box>
    )
}

export default Footer

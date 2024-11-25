import { Box, Flex, Center, Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'
import dpImage from '../Assets/footer.png'
import { useSelector } from 'react-redux'

const About = () => {

    const { authUser } = useSelector((store) => store.user)

    return (
        <Center w={'100%'} flexDir={'column'} justifyContent={'start'} gap={'2rem'} minH={'90vh'} bgColor={'black'} color={'#fff'} padding={'2rem 3rem'}>

            <Heading fontSize={'3rem'}>Hiii {authUser?.fullname.toUpperCase()},</Heading>
            {/* <Image src={dpImage} /> */}

            <Heading fontSize={'1.7rem'}>Let's talk about Filmix</Heading>
            <Text w={'70%'} color={'#9CA3AF'} fontSize={'1.2rem'}>
                Filmix is your ultimate hub for everything movies, TV shows, and web series.
                Explore detailed information about your favorite content, including genres, cast, and crew,
                all in one place.
                <br></br>
                But that’s not all—Filmix also lets 
                <strong style={{ color: "white" }}> you stream movies and web series online for free!
                </strong>
                Whether you’re looking to discover something new or revisit a classic,
                Filmix makes it easy and accessible. With a clean and user-friendly interface,
                you can enjoy endless entertainment without any hassle.
                Your journey into the world of entertainment begins here, at Filmix.


            </Text>

            <Flex flexDir={'column'} alignItems={'center'} gap={'2rem'} mt={'3rem'}>
                <Heading fontSize={'1.7rem'}>Stats</Heading>
                <Flex gap={'3rem'}>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>995,711</Text>
                        <Text color={'#9CA3AF'}>Movies</Text>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>186,326</Text>
                        <Text color={'#9CA3AF'}>Tv Shows</Text>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>311,251</Text>
                        <Text color={'#9CA3AF'}>Tv Seasons</Text>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>4,961,506</Text>
                        <Text color={'#9CA3AF'}>Tv Episodes</Text>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>3,730,157</Text>
                        <Text color={'#9CA3AF'}>People</Text>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>6,547,767</Text>
                        <Text color={'#9CA3AF'}>Images</Text>
                    </Flex>
                    <Flex flexDir={'column'}>
                        <Text fontSize={'1.3rem'}>557,604</Text>
                        <Text color={'#9CA3AF'}>Edits last week</Text>
                    </Flex>
                </Flex>
            </Flex>

            <Heading border={'1px solid #414141'} transition={'.2s all ease-in-out'}
             p={'.5rem 2rem'} cursor={'pointer'} mt={'3rem'}
             borderRadius={'1rem'}
            _hover={{color : "white", bgColor : "red"}}
            >Contact us</Heading>
        </Center>
    )
}

export default About

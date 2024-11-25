import { Box, Center, Flex, Heading, HStack, Input, Text, Textarea } from '@chakra-ui/react'
import React from 'react'
import { IoSendOutline } from 'react-icons/io5'

const Contact = () => {
    return (
        <Center flexDir={'column'} minH={'80vh'} padding={'2rem 2rem'} display={'flex'} gap={'2rem'} justifyContent={'start'}>
            <Heading fontSize={'2rem'} color={'#FC4444'} fontFamily={'sans-serif'}>Get in Touch</Heading>
            <Text textAlign={'center'} w={'50%'} fontSize={'1.1rem'}>
                Have a question or suggestion? We'd love to hear from you!
                Fill out the form below or reach out on Twitter.
            </Text>
            <Flex flexDir={'column'} overflow={'hidden'} border={'1px solid #313131'} p={'1rem 3rem'} w={'55%'} gap={'1rem'}>
                <Heading alignSelf={'center'} mb={'1rem'}>Contact us</Heading>

                <Flex flexDir={'column'} gap={'1.2rem'} mb={'1rem'}>
                    <Flex gap={'1rem'}>
                        <Input outline={'none'} w={'50%'} border={'1px solid #313131'} fontSize={'1.3rem'} p={'.4rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='your name' />
                        <Input outline={'none'} w={'50%'} border={'1px solid #313131'} fontSize={'1.3rem'} p={'.4rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='your email' />
                    </Flex>
                    <Textarea rows={'6'} resize={'none'} outline={'none'} border={'1px solid #313131'} type='text' fontSize={'1.3rem'} p={'.4rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='your email' />
                    <HStack cursor={'pointer'} bgColor={'teal'} fontSize={'1.2rem'} fontWeight={'bold'} gap={'.8rem'} justifyContent={'center'} p={'.5rem'} >
                        <Text>Send</Text>
                        <IoSendOutline />
                    </HStack>
                </Flex>
            </Flex>
        </Center>
    )
}

export default Contact

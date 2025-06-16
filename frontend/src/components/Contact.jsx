import { Center, Flex, Heading, HStack, Input, Text, Textarea } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { IoSendOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

const Contact = () => {
    const { authUser } = useSelector((store) => store.user)

    const [name, setName] = useState('')
    const [email, setEmail] = useState(authUser?.email)
    const [message, setMessage] = useState('')
    const sendResponse = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/contact/feedback`, {
                name, email, message
            }, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true
            })
            if (response.status === 200) {
                toast.success(`${response.data.message}`, {
                    position: "top-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                }
                );
                setName('')
                setEmail('')
                setMessage('')
            }
        } catch (error) {
            if (error.status === 401) {
                toast.error(`${error.response.data.message}`, {
                    position: "top-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                }
                );
            }
        }
    }
    return (
        <Center flexDir={'column'} minH={'80vh'} color={'white'} padding={['1rem', '2rem 2rem']} display={'flex'} gap={'2rem'} justifyContent={'start'}>
            <Heading fontSize={'2rem'} color={'#FC4444'} fontFamily={'sans-serif'}>Get in Touch</Heading>
            <Text textAlign={'center'} w={['100%', '50%']} fontSize={['1rem', '1.1rem']}>
                Have a question or suggestion? We'd love to hear from you!
                Fill out the form below or reach out on Twitter.
            </Text>
            <Flex flexDir={'column'} overflow={'hidden'} border={['none', '1px solid #313131']} p={['1rem', '1rem 3rem']} w={['100%', '55%']} gap={'1rem'}>
                <Heading alignSelf={'center'} mb={'1rem'}>Contact us</Heading>

                <Flex flexDir={'column'} gap={'1.2rem'} mb={'1rem'}>
                    <Flex gap={'1rem'} flexDir={['column', 'row']}>
                        <Input outline={'none'} onChange={(e) => setName(e.target.value)} value={name} w={['100%', '50%']} border={'1px solid #313131'} fontSize={'1.3rem'} p={'.4rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='your name' />
                        <Input outline={'none'} onChange={(e) => setEmail(e.target.value)} w={['100%', '50%']} value={email} border={'1px solid #313131'} fontSize={'1.3rem'} p={'.4rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='your email' />
                    </Flex>
                    <Textarea rows={'6'} resize={'none'} outline={'none'} onChange={(e) => setMessage(e.target.value)} value={message} border={'1px solid #313131'} type='text' fontSize={'1.3rem'} p={'.4rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='Give us feedback or suggestions.' />
                    <HStack onClick={sendResponse} cursor={'pointer'} bgColor={'teal'} fontSize={'1.2rem'} fontWeight={'bold'} gap={'.8rem'} justifyContent={'center'} p={'.5rem'} >
                        <Text >Send</Text>
                        <IoSendOutline />
                    </HStack>
                </Flex>
            </Flex>
            <ToastContainer />
        </Center>
    )
}

export default Contact

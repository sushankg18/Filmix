import { Button, Center, Flex, Heading, Input, InputGroup, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'

const Signup = () => {

    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)

    const navigate = useNavigate()
    const handleShowPassword = () => {
        setShowPass(!showPass)
    }

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const user = await axios.post('http://localhost:8000/api/v1/user/register',
                {
                    fullname, email, password
                }, {
                headers: {
                    "Content-Type ": "application/json"
                }, withCredentials: true
            }
            )
            console.log('USER : ', user.data.message)
            if (user.status === 200) {
                toast.success(`${user.data.message}`, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                }
                );
                navigate("/login")
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

                console.log("Error while resgistering user : ", error)
            }
            if (error.status === 403) {
                toast.error(`${error.response.data.message}`, {
                    position: "top-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                }
                );
                console.log("Error while resgistering user : ", error)
            }
            console.log("Error while registering the user", error)
        }
    }
    return (
        <Center w={'100%'} flexDir={'column'} color={'white'} minH={['78vh']}>
           
            <VStack w={['100%', '30%']} gap={'1.3rem'} minH={'fit-content'} borderRadius={'1rem'} p={'1rem 2rem'} fontSize={'1.2rem'}>
                <VStack alignItems={'flex-start'} gap={'0'} w={'100%'}>
                    <Text alignSelf={'flex-start'} fontWeight={'bold'} userSelect={'none'} color={'white'} cursor={'default'} textDecoration={'none'} fontSize={'xx-large'}>
                        Signup
                    </Text>
                    <Text fontSize={'.9rem'} color={'gray'}>Create your account</Text>
                </VStack>

                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Input value={fullname} onChange={(e) => setFullname(e.target.value)} outline={'none'} w={'100%'} border={'1px solid #313131'} fontSize={'1.1rem'} p={'.7rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='Enter Username' />
                </InputGroup>

                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} outline={'none'} w={'100%'} border={'1px solid #313131'} fontSize={'1.1rem'} p={'.7rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='Enter email' />
                </InputGroup>
                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Flex border={'1px solid #313131'} alignItems={'center'}>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} w={'100%'} type={showPass ? "text" : 'password'} outline={'none'} border={'none'} fontSize={'1.1rem'} p={'.7rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='Enter password' />
                        {
                            showPass ?
                                <BiHide onClick={handleShowPassword} style={{ width: "15%" }} fontSize={'1.3rem'} />
                                :
                                <BiShow onClick={handleShowPassword} style={{ width: "15%" }} fontSize={'1.3rem'} />
                        }
                    </Flex>
                </InputGroup>

                <Button onClick={registerUser} border={'none'} variant={'solid'} colorScheme='purple' cursor={'pointer'} mt={'1rem'} w={'100%'} p={'.3rem 0'} fontWeight={'bold'} fontSize={'1.2rem'}>Sign up</Button>

                <Flex fontSize={'.9rem'} color={'white'} alignSelf={'flex-start'} gap={'.4rem'}>
                    <Text>Already have an account ? </Text>
                    <Link style={{ textDecoration: "none" }} to={'/login'}>
                        <Text color={'purple.200'}>login</Text>
                    </Link>
                </Flex>
            </VStack>
            <ToastContainer />

        </Center>
    )
}

export default Signup

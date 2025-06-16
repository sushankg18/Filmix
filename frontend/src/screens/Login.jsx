import { Button, Center, Flex, Heading, Input, InputGroup, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/userSlice'
import { toast, ToastContainer } from 'react-toastify'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [getUser, setGetUser] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleShowPassword = () => {
        setShowPass(!showPass)
    }

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const user = await axios.post(
                "http://localhost:8000/api/v1/user/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (user) {
                dispatch(setAuthUser(user.data.logInUser));

                toast.success(`${user.data.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                }
                );

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            if (error.status === 401) {
                toast.error(`${error.response.data.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                });
            }
            if (error.status === 400) {
                toast.error(`${error.response.data.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                });
            }
            if (error.status === 403) {
                toast.error(`${error.response.data.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                    progress: undefined
                });
            }
            console.log("LOGIN ERROR CONSOLE : ", error)
        }
    };



    return (
        <Center w={'100%'} minH={['78vh']} color={'white'} flexDir={'column'} bgGradient="linear(to-b, #101624  ,#04060A)">
            <VStack w={['100%', '30%']} gap={'1.3rem'} minH={'fit-content'} borderRadius={'1rem'} p={'1rem 2rem'} fontSize={'1.2rem'}>
                <VStack alignItems={'flex-start'} gap={'0'} w={'100%'}>
                    <Text alignSelf={'flex-start'} fontWeight={'bold'} userSelect={'none'} color={'white'} cursor={'default'} textDecoration={'none'} fontSize={'xx-large'}>
                        Login
                    </Text>
                    <Text fontSize={'.9rem'} color={'gray'}>Sign in to your account</Text>
                </VStack>
                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} borderColor={'#313131'} outline={'1px solid #313131'} w={'100%'} border={'1px solid #313131'} fontSize={'1.1rem'} p={'.7rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='Email' />
                </InputGroup>

                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Flex border={'1px solid #313131'} alignItems={'center'}>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} w={'100%'} type={showPass ? "text" : 'password'} border={'none'} outline={'none'} fontSize={'1.1rem'} p={'.7rem 1rem'} color={'white'} bgColor={'transparent'} placeholder='Password' />
                        {
                            showPass ?
                                <BiHide onClick={handleShowPassword} style={{ width: "15%" }} fontSize={'1.3rem'} />
                                :
                                <BiShow onClick={handleShowPassword} style={{ width: "15%" }} fontSize={'1.3rem'} />
                        }
                    </Flex>
                </InputGroup>

                <Button onClick={loginUser} border={'none'} variant={'solid'} colorScheme='purple' cursor={'pointer'} mt={'1rem'} w={'100%'} p={'.3rem 0'} fontWeight={'bold'} fontSize={'1.2rem'}>Login</Button>

                <Flex fontSize={'.9rem'} color={'white'} alignSelf={'flex-start'} gap={'.4rem'}>
                    <Text>Don't have an account ? </Text>
                    <Link style={{ textDecoration: "none" }} to={'/signup'}>
                        <Text color={'purple.200'} >Signup</Text>
                    </Link>
                </Flex>
            </VStack>
            <ToastContainer />
        </Center>
    )
}

export default Login

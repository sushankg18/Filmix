import { Button, Center, Flex, Input, InputGroup, Text, VStack } from '@chakra-ui/react'
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

                toast.success('User logged in successfully!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
                );

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            toast('Invalid email or password!');
        }
    };



    return (
        <Center w={'100%'} minH={'90vh'} bgColor={'black'}>
            <VStack w={'30%'} gap={'1.3rem'} bgColor={'#111111'} minH={'fit-content'} borderRadius={'1rem'} p={'3rem 3rem'} fontSize={'1.2rem'}>
                <Text fontWeight={'bold'} color={'white'} cursor={'default'} textDecoration={'none'} fontSize={'xx-large'}>
                    Login
                </Text>
                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Text>Email</Text>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} bg={'none'} color={'white'} border={'1px solid #565656'} outline={'none'} p={'.4rem 1rem'} fontWeight={'bold'} fontSize={'1.1rem'} />
                </InputGroup>

                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Text>Password</Text>
                    <Flex border={'1px solid #565656'} alignItems={'center'}>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} w={'95%'} type={showPass ? "text" : 'password'} bg={'none'} color={'white'} border={'none'} outline={'none'} p={'.4rem 1rem'} fontWeight={'bold'} fontSize={'1.1rem'} />
                        {
                            showPass ?
                                <BiHide onClick={handleShowPassword} style={{ width: "15%" }} fontSize={'1.3rem'} />
                                :
                                <BiShow onClick={handleShowPassword} style={{ width: "15%" }} fontSize={'1.3rem'} />
                        }
                    </Flex>
                </InputGroup>

                <Button onClick={loginUser} border={'none'} cursor={'pointer'} mt={'1rem'} w={'100%'} p={'.3rem 0'} bgColor={'red'} color={'white'} fontWeight={'bold'} fontSize={'1.2rem'}>Login</Button>

                <Flex alignSelf={'flex-start'} gap={'.4rem'}>
                    <Text>Don't have an account ? </Text>
                    <Link style={{ textDecoration: "none" }} to={'/signup'}>
                        <Text color={'red'}>Signup</Text>
                    </Link>
                </Flex>
            </VStack>
            <ToastContainer />
        </Center>
    )
}

export default Login

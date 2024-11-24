import { Box, Button, Center, Flex, Input, InputGroup, InputRightElement, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
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
            if (user) {
                console.log("Frontend : User registered successfully")
            }
            if(user.status === 200){
                navigate("/login")
            }
        } catch (error) {
            console.log("Frontend : got error while registering the user")
        }
    }
    return (
        <Center w={'100%'} minH={'90vh'} bgColor={'black'}>
            <VStack w={'30%'} gap={'1.3rem'} bgColor={'#111111'} minH={'fit-content'} borderRadius={'1rem'} p={'3rem 3rem'} fontSize={'1.2rem'}>
                <Text fontWeight={'bold'} color={'white'} cursor={'default'} textDecoration={'none'} fontSize={'xx-large'}>
                    Signup
                </Text>

                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Text>Username</Text>
                    <Input value={fullname} onChange={(e) => setFullname(e.target.value)} bg={'none'} color={'white'} border={'1px solid #565656'} outline={'none'} p={'.4rem 1rem'} fontWeight={'bold'} fontSize={'1.1rem'} />
                </InputGroup>

                <InputGroup gap={'.7rem'} display={'flex'} flexDir={'column'}>
                    <Text>email</Text>
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

                <Button onClick={registerUser} border={'none'} cursor={'pointer'} mt={'1rem'} w={'100%'} p={'.3rem 0'} bgColor={'red'} color={'white'} fontWeight={'bold'} fontSize={'1.2rem'}>Login</Button>

                <Flex alignSelf={'flex-start'} gap={'.4rem'}>
                    <Text>Already have an account ? </Text>
                    <Link style={{ textDecoration: "none" }} to={'/login'}>
                        <Text color={'red'}>login</Text>
                    </Link>
                </Flex>
            </VStack>
        </Center>
    )
}

export default Signup

import { Box, Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

const Loader = () => {
    return (
        <Flex w={'90vw'} justifyContent={'center'}> 
            <Spinner
                w={'10vh'}
                height={'10vh'}
                borderRadius={'50%'}
                color="red"
                speed='.7s'
               
            />
        </Flex>
    )
}

export default Loader

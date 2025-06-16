import { Box, Center, Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

const Loader = () => {
    return (
        <Center w={'100vw'} height={'60vh'} alignItems={'center'} justifyContent={'center'}>
            <Spinner
                w={'10vh'}
                height={'10vh'}
                borderRadius={'50%'}
                color="red"
                speed='.7s'

            />
        </Center>
    )
}

export default Loader

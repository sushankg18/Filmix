import { Box } from '@chakra-ui/react'
import React from 'react'

const EmailVerification = () => {
    return (


        // display={watchNowCLicked ? "flex" : 'none'} 
        <Box h={'100vh'} background={'rgba(0,0,0,0.8)'} zIndex={'99'} w={'100vw'} justifyContent={'center'} alignItems={'center'} position={'fixed'} left={'0'} top={'0'}>
            <Box width={'85%'} height={'90%'} display={'flex'} >
                {/* <iframe title={item.title} allowFullScreen onLoad={() => console.log("Iframe loaded successfully!")} style={{ border: "none" }} src={watchNowCLicked ? `https://vidsrc.xyz/embed/movie/${id}` : ""} width={'100%'} height={'100%'}></iframe> */}
                {/* <IoCloseSharp fontSize={'2rem'} cursor={'pointer'} onClick={watchNow} /> */}
            </Box>
        </Box>
    )
}

export default EmailVerification

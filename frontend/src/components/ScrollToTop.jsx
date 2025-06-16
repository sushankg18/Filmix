import { Button } from '@chakra-ui/react'
import React from 'react'
import { BsArrowUp } from 'react-icons/bs'

const ScrollToTop = () => {

    const scrollToUp = () => {
        window.scrollTo({
            top : 0,
            behavior : "smooth"
        })
    }

  return (
    <Button onClick={scrollToUp} zIndex={'99'} colorScheme='purple' position={'fixed'} top={'87vh'} fontSize={'1.3rem'} fontWeight={'bold'} borderRadius={'20%'} right={'5'}>
        <BsArrowUp />
    </Button>
  )
}

export default ScrollToTop

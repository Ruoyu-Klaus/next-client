import { Box, Spinner } from '@chakra-ui/react'

export const FarmModalContainer = ({ children }) => {
  return (
    <Box m='auto' w={[280, 480, 640]} h={[280, 460, 460]} position='relative'>
      {children}
    </Box>
  )
}

export const LoadingSpinner = () => (
  <Spinner
    size='xl'
    position='absolute'
    left='50%'
    top='50%'
    ml='calc(0px - var(--spinner-size) / 2)'
    mt='calc(0px - var(--spinner-size))'
  />
)

function FarmModalLoadingSpinner() {
  return (
    <FarmModalContainer>
      <LoadingSpinner />
    </FarmModalContainer>
  )
}

export default FarmModalLoadingSpinner

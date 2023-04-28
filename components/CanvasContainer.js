import React from 'react'
import {Box, Spinner} from '@chakra-ui/react'

export const CanvasContainer = ({children}) => {
    return (
        <Box m="auto" my={4} w={[280, 380, 440]} h={[220, 240, 240]} position="relative">
            {children}
        </Box>
    )
}

export const LoadingSpinner = () => (
    <Spinner size="xl" position="absolute" left="50%" top="50%" ml="calc(0px - var(--spinner-size) / 2)" mt="calc(0px - var(--spinner-size))" />
)

export function CanvasLoadingSpinner() {
    return (
        <CanvasContainer>
            <LoadingSpinner />
        </CanvasContainer>
    )
}

export default CanvasLoadingSpinner

import {Center, Stack, Text} from '@chakra-ui/react'

function Author(props) {
    return (
        <Center maxW="container.md" width="50vw" alignItems="center">
            <Stack spacing="28px">
                <Text fontSize="lg">Ruoyu Klaus</Text>
                <Text fontSize="md">👋 Hi there, welcome to my corner in the world of internet. </Text>
                <Text fontSize="md">
                    👨‍💻 I am a junior software developer, developing both FE and BE application, specializing in front end development.
                </Text>
                <Text fontSize="md">🏃 I am also an Agile practitioner with business awareness, clean code enthusiast.</Text>
                <Text fontSize="md">🤔 I believe that software is build for servicing humanity, and solving real problems.</Text>
                <Text fontSize="md">🏖️ Apart from programming, I quite like traveling, immersing myself among diverse cultures.</Text>
                <Text fontSize="md">
                    🥘 I am also good at cooking. It takes the knowledge of different ingredients, how their combination would work. I usually cook
                    during weekends, it's a special moment for relaxing.
                </Text>
            </Stack>
        </Center>
    )
}

export default Author

import {Center, Stack, Text} from '@chakra-ui/react'

function Author(props) {
    return (
        <Center maxW="container.md" width="50vw" alignItems="center">
            <Stack spacing="28px">
                <Text fontSize="lg">Ruoyu</Text>
                <Text fontSize="md">👋 Hi there, welcome to my corner of the internet! </Text>
                <Text fontSize="md">
                    👨‍💻 I'm a software developer with a passion for both front-end and back-end development. As someone who specializes in front-end
                    development, I enjoy crafting engaging user experiences that seamlessly blend form and function.
                </Text>
                <Text fontSize="md">🏃 I'm also an Agile practitioner with business awareness and a clean code enthusiast. </Text>
                <Text fontSize="md">🤔 I believe in the power of software to solve real problems and improve the lives of people everywhere.</Text>
                <Text fontSize="md">
                    🏖️ Apart from programming, I quite like traveling, exploring new places and immersing myself in diverse cultures.
                </Text>
                <Text fontSize="md">
                    🥘 I am also a competent cook, and I love experimenting with different ingredients and techniques to create delicious and healthy
                    meals. Cooking is a special weekend activity that I enjoy as a way to unwind and recharge after a busy week of coding.
                </Text>
                <Text fontSize="md">
                    🙏 Thanks for taking the time to get to know me a little better. I'm excited to continue growing my skills and making meaningful
                    contributions to the world of software development.
                </Text>
            </Stack>
        </Center>
    )
}

export default Author

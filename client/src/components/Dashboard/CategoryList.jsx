import {
    Box,
    Heading,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";

function Category() {
    const bg = useColorModeValue("gray.200", "blue.800");

    return (
        <Box
            w={"100%"}
            h={"200px"}
            minH={"200px"}
            bg={bg}
            p={4}
            borderRadius={20}
        >
            <Heading>H</Heading>
        </Box>
    );
}

export function CategoryList({ group }) {
    return (
        <VStack pt={5} gap={3} flex={1} overflowY={"auto"}>
            {Array(10)
                .fill("")
                .map((_, i) => {
                    return <Category key={i} />;
                })}
        </VStack>
    );
}

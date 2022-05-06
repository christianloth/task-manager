// Header.jsx
// Created By: Reo Matsuda

import { MoonIcon, PhoneIcon, SunIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Circle,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { BsFillPersonFill } from "react-icons/bs";
import GroupIcon from "./GroupIcon";

export function Header({ icon, name, memberCount }) {
    const iconSize = 10;
    const textSize = "lg";
    const bg = useColorModeValue("gray.300", "blue.700");

    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <HStack
            bg={bg}
            p={3}
            px={7}
            borderRadius={25}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            <Flex alignItems={"center"} gap={4}>
                <GroupIcon icon={icon} color={"black"} bg={"white"} />
                <Heading size={textSize}>{name}</Heading>
            </Flex>
            <Flex alignItems={"center"} gap={2}>
                <Flex alignItems={"center"} justifyContent={"center"}>
                    <Heading size={textSize}>{memberCount}</Heading>
                    <Icon w={iconSize} h={iconSize} as={BsFillPersonFill} />
                </Flex>
                <IconButton
                    aria-label="toggle dark mode"
                    icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                />
            </Flex>
        </HStack>
    );
}

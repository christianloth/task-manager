// GroupList.jsx
// Created By: Reo Matsuda

import { AddIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Circle,
    Divider,
    Heading,
    HStack,
    Icon,
    IconButton,
    Radio,
    Text,
    Tooltip,
    useColorModeValue,
    useRadio,
    useRadioGroup,
    VStack,
} from "@chakra-ui/react";
import GroupIcon from "./GroupIcon";
import { memo } from "react";

function Group(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    const boxShadow = useColorModeValue(
        "var(--chakra-colors-gray-500)",
        "var(--chakra-colors-blue-300)"
    );
    const hoverBoxShadow = useColorModeValue(
        "var(--chakra-colors-gray-900)",
        "var(--chakra-colors-blue-300)"
    );
    const hoverBG = useColorModeValue(
        "var(--chakra-colors-blackAlpha-100)",
        "var(--chakra-colors-whiteAlpha-50)"
    );
    const checkedBoxShadow = useColorModeValue(
        "var(--chakra-colors-gray-500)",
        "var(--chakra-colors-blue-300)"
    );

    const color = useColorModeValue("black", "white");

    return (
        <Tooltip hasArrow label={props.groupName} placement="right">
            <Box as="label">
                <input {...input} />
                <Circle
                    {...checkbox}
                    cursor="pointer"
                    // borderWidth="1px"
                    boxShadow={`0px 0px 0px 1px ${boxShadow} inset`}
                    _hover={{
                        bg: hoverBG,
                        boxShadow: `0px 0px 0px 1px ${hoverBoxShadow} inset`,
                    }}
                    _checked={{
                        boxShadow: `0px 0px 0px 4px ${checkedBoxShadow} inset`,
                        // borderWidth: "10px"
                    }}
                    size={"55px"}
                >
                    <GroupIcon icon={props.icon} color={color} />
                </Circle>
            </Box>
        </Tooltip>
    );
}

function GroupList({ groups, onChangeHandle }) {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "groups",
        defaultValue: groups[0].group_id + "_group",
        onChange: (e) => {
            onChangeHandle(e);
            console.log(e);
        },
    });

    const group = getRootProps();
    const bg = useColorModeValue("gray.300", "blue.700");

    return (
        <VStack
            bg={bg}
            overflowY={"auto"}
            overflowX={"hidden"}
            borderRadius={20}
            h={"100%"}
            p={3}
            m={4}
            ml={0}
            alignItems={"center"}
            justify
            sx={{
                "&:-webkit-scrollbar": {
                    display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
            }}
            {...group}
        >
            <IconButton
                bg="white"
                color="black"
                fontSize={"2rem"}
                p={2}
                w={10}
                h={10}
                icon={<AddIcon />}
            />
            <Divider p={1} />
            {groups.map((group, i) => {
                const { group_id, user_id, group_name, descriptions } = group;
                const id = group_id + "_group";
                const radio = getRadioProps({ value: id });
                return (
                    <Group
                        key={id}
                        icon={""}
                        groupName={group_name}
                        {...radio}
                    />
                );
            })}
        </VStack>
    );
}

export default memo(GroupList);

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CategoryList } from "./CategoryList";
import { GroupList } from "./GroupList";
import { Header } from "./Header";

const groups = Array(20).fill('').map((_, i) => {
    return {name: `CSCE 310 - Group ${i+1}`, icon: i % 2 ? 'phone' : '', memberCount: Math.floor(Math.random() * 10)}
})

const getGroup = (groupName) => {
    for (let i = 0; i < groups.length; ++i) {
        if (groups[i].name === groupName)
            return groups[i]
    }

    return groups[0]
}

export function Dashboard() {
    const [selectedGroupName, setSelectedGroupName] = useState('');

    useEffect(() => {
        setSelectedGroupName(groups[0].name)
    }, [])

    const selectedGroup = getGroup(selectedGroupName);

    return (
        <Flex h={"100%"} p={6} justifyContent="center" alignItems={"center"}>
            <GroupList groups={groups} onChangeHandle={setSelectedGroupName}></GroupList>
            <Flex flexDirection={"column"} flex={1} h={"100%"}>
                <Header group={selectedGroup}></Header>
                <CategoryList group={selectedGroup}></CategoryList>
            </Flex>
        </Flex>
    );
}

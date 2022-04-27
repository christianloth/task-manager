import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { CategoryList } from "./CategoryList";
import GroupList from "./GroupList";
import { Header } from "./Header";

// Get group based on index (key)
// Created by: Reo Matsuda
const getGroup = (groups, groupIndex) => {
    const id = parseInt(groupIndex.split("_")[0]);
    for (let i = 0; i < groups.length; ++i) {
        if (groups[i].group_id === id) return groups[i];
    }

    return groups[0];
};

// Dashboard / landing page
// Created by: Reo Matsuda
export function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupIndex, setSelectedGroupIndex] = useState("1_group");

    useEffect(async () => {
        let data = await fetch("http://localhost:3001/api/group");
        const { rows } = await data.json();
        setGroups(rows);
        setSelectedGroupIndex(rows[0].group_id + "_group");
    }, []);

    let selectedGroup = getGroup(groups, selectedGroupIndex);
    let group_id, user_id, group_name, description;
    if (selectedGroup)
        ({ group_id, user_id, group_name, description } = { ...selectedGroup });
    else group_name = "TEST";
    console.log(group_name);

    return (
        <Flex h={"100%"} p={6} justifyContent="center" alignItems={"center"}>
            {groups.length > 0 && (
                <GroupList
                    groups={groups}
                    onChangeHandle={setSelectedGroupIndex}
                ></GroupList>
            )}
            <Flex flexDirection={"column"} flex={1} h={"100%"}>
                <Header icon="" name={group_name} memberCount={0}></Header>
                <CategoryList group={[]}></CategoryList>
            </Flex>
        </Flex>
    );
}

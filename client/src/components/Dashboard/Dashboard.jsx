import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useMemo } from "react";
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
    const [selectedGroupIndex, setSelectedGroupIndex] = useState("0_group");
    const [selectedGroup, setSelectedGroup] = useState(null);

    const selectedID = parseInt(selectedGroupIndex.split("_")[0]);

    useEffect(async () => {
        let data = await fetch("http://localhost:3001/api/group");
        const { rows } = await data.json();
        setGroups(rows);
        setSelectedGroupIndex(rows[0].group_id + "_group");
    }, []);

    useEffect(async () => {
        let data = await fetch(`http://localhost:3001/api/group/${selectedID}`);
        console.log(data);
        const res = await data.json();
        console.log(res);
        setSelectedGroup(res);
        return () => {};
    }, [selectedGroupIndex]);

    if (!selectedGroup) return <></>;

    const { info, admins, members, events, categories } = selectedGroup;

    return (
        <Flex h={"100%"} p={6} justifyContent="center" alignItems={"center"}>
            {groups.length > 0 && (
                <GroupList
                    groups={groups}
                    onChangeHandle={setSelectedGroupIndex}
                ></GroupList>
            )}
            <Flex flexDirection={"column"} flex={1} h={"100%"}>
                <Header
                    icon=""
                    name={info.group_name}
                    memberCount={members.length}
                    admins={admins}
                    events={events}
                    categories={categories}
                />
                <CategoryList group_id={selectedID} categories={categories} />
            </Flex>
        </Flex>
    );
}

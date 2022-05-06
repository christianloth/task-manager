import {
    Box,
    Button,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    useColorModeValue,
    VStack,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

// const { task_id, user_id, category_id, task_name, descriptions }
const CreateTaskForm = ({ isOpen, onClose, category_id }) => {
    const [task_name, setName] = useState("");
    const [descriptions, setDescription] = useState("");

    function onSubmit() {
        const task_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        const user_id = Math.floor(Math.random() * 10);

        fetch(`http://localhost:3001/api/task/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task_id,
                user_id,
                category_id,
                task_name,
                descriptions,
            }),
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create new task</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Task Name</FormLabel>
                        <Input
                            placeholder="Example Name"
                            value={task_name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            placeholder="Last name"
                            value={descriptions}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

// Each Task
// Written By: Reo Matsuda
function Task({ task_id, task_name, complete }) {
    console.log(complete);
    const task_bg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
    const task_hover = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
    const task_completed = useColorModeValue("green.400", "green.700");
    const task_completed_hover = useColorModeValue("green.600", "green.600");
    const [completed, setCompleted] = useState(complete);

    return (
        <Box
            key={task_id}
            w="100%"
            bg={completed ? task_completed : task_bg}
            cursor="pointer"
            textDecoration={completed ? "line-through" : ""}
            _hover={{
                bg: completed ? task_completed_hover : task_hover,
            }}
            p={2}
            onClick={() => {
                setCompleted(!completed);
                const complete = !completed ? 1 : 0;
                fetch(`http://localhost:3001/api/task/set/${task_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ complete }),
                });
            }}
        >
            {task_name}
        </Box>
    );
}

// Each category
// Created By: Reo Matsuda
function Category({ info }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bg = useColorModeValue("gray.300", "blue.800");
    const secondary_bg = useColorModeValue("gray.400", "blue.900");
    const { category_name, category_id, tasks } = info;

    return (
        <Box
            w={"100%"}
            h={"250px"}
            minH={"250px"}
            bg={bg}
            p={0}
            borderRadius={20}
            display="flex"
            flexDir="row"
        >
            <CreateTaskForm
                isOpen={isOpen}
                onClose={onClose}
                category_id={category_id}
            />
            <Box
                w="35%"
                h="100%"
                p={4}
                borderRadius={20}
                bg={secondary_bg}
                display="flex"
                flexDir="column"
                justifyContent="space-between"
            >
                <Heading size="md" isTruncated>
                    {category_name}
                </Heading>
                <Box
                    w="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Heading size="sm">Total Tasks: {tasks.length}</Heading>
                    <Button colorScheme="green" onClick={onOpen}>
                        New Task
                    </Button>
                </Box>
            </Box>
            <VStack flex={1} p={4} bg="transparent" overflowY="scroll">
                {tasks.map((task, i) => {
                    const { task_id, task_name, complete } = task;
                    return (
                        <Task
                            key={task_id}
                            task_id={task_id}
                            task_name={task_name}
                            complete={complete}
                        />
                    );
                })}
            </VStack>
        </Box>
    );
}

// { category_id, group_id, category_name, descriptions, create_date }
const CreateCategoryForm = ({ isOpen, onClose, group_id }) => {
    const [category_name, setName] = useState("");
    const [descriptions, setDescription] = useState("");

    function onSubmit() {
        const category_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        const create_date = new Date().toISOString();

        fetch(`http://localhost:3001/api/category/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category_id,
                group_id,
                category_name,
                descriptions,
                create_date,
            }),
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create new category</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Category Name</FormLabel>
                        <Input
                            placeholder="Example Name"
                            value={category_name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            placeholder="Last name"
                            value={descriptions}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

// Create a list of all categories within group
// Created By: Reo Matsuda
export function CategoryList({ categories, group_id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack pt={5} gap={3} flex={1} overflowY={"auto"}>
            <Button p={7} colorScheme="green" onClick={onOpen}>
                New Category
            </Button>
            <CreateCategoryForm
                isOpen={isOpen}
                onClose={onClose}
                group_id={group_id}
            />
            {categories.map((category, i) => {
                return <Category key={i} info={category} />;
            })}
        </VStack>
    );
}

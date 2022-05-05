import { Box } from "@chakra-ui/react";
import { Dashboard } from "./Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Login/Login";

function App() {
    const [token, setToken] = useState();
    if (sessionStorage.getItem("user"))
        console.log("App:", sessionStorage.getItem("user"));
    if (!token || token.token !== "success") {
        return <Login setToken={setToken} />;
    }

    return (
        <Box h={"100vh"}>
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
            </Routes>
        </Box>
    );
}

export default App;

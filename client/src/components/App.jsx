import { Box } from "@chakra-ui/react";
import { Dashboard } from "./Dashboard/Dashboard";
import { Routes, Route, Link } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Login } from "./Login/Login";

function App() {
    return (
        <Box h={"100vh"}>
            <Routes>
                <Route exact path="/" element={<Dashboard/>}/>
            </Routes>
        </Box>
    );
}

export default App;

import { Box } from "@chakra-ui/react";
import { Dashboard } from "./Dashboard/Dashboard";
import { Routes, Route, Link } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import {useState} from "react";
import Login from "../Login";

function App() {

    //------ Token Stuff -------
    const [token, setToken] = useState();
    if(!token) {
        return <Login setToken={setToken} />
    }

    return (
        <Box h={"100vh"}>
            <Routes>
                <Route exact path="/" element={<Dashboard/>}/>
            </Routes>
        </Box>
    );
}

export default App;

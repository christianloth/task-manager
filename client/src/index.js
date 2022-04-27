import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";

import theme from "./theme";

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <ChakraProvider theme={theme}>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <App />
            </ChakraProvider>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
);

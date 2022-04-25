import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: { initialColorMode: "dark", useSystemColorMode: false },
    fonts: {
        heading: "Roboto Condensed, sans-serif",
        body: "Roboto Condensed, sans-serif",
    },
});

export default theme;

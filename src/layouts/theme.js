import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";


export const darkBlueTheme = createTheme({
    palette: {
        primary: {
            main: "#111"
        },
        secondary: {
            main: blue[500]
        },
        line: {
            main: "#888",
            disable: "#555"
        },
        text: {
            main: "#fff",
            sub: "#777"
        },
        icon: {
            main: "#777"
        },
        background: {
            default: "#111",
            pop: "#282828",
            search: "#111",
            hover: "#383838"
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            ::-webkit-scrollbar{
                width: 10px;
            },
            ::-webkit-scrollbar-thumb {
                background-color: #444;
                border-radius: 10px;
            },
            ::-webkit-scrollbar-track {
                background-color: #transparent;
            }
            `
        }
    }
})
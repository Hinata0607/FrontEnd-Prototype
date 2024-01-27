import { createTheme } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";


export const LightOrangeTheme = createTheme({
    palette: {
        themeName: "ライトオレンジ",
        siteLogo: "LMAP_logo.svg",
        primary: {
            main: "#f8fcff",
            listBack: `linear-gradient(to bottom right, ${orange[500]}, 70%, ${orange[500]})`,
            disabled: "#aaa",
        },
        secondary: {
            main: orange[500],
            mainHover: orange[800],
            progressed: orange[900],
            exhibitAny: grey[900],
            disabled: orange[900],
        },
        line: {
            main: "#888",
            white: "#fff",
            disable: "#aaa",
            tab: "#333",
            successLine: "#084",
            warningLine: "#880",
        },
        text: {
            main: "#000",
            sub: "#777",
            sub2: "#777",
            main2: "#fff",
            main3: "#000",
            categoryActive: "#fff",
            tab: "#aaa",
            product: "#ccc",
            error: "#f00",
            error2: "#a00",
            admin: "#f0f",
            alert: "#000",
            verifyBar: "#fff",
            following: "#fff",
            disabled: "#555",
        },
        icon: {
            main: "#777",
            like: "#ff007f",
            admin: "#f0f",
            comment: "#00b7ff",
            share: "#00e73d",
        },
        background: {
            default: "#f8fcff",
            pop: "#ddd",
            searchPop: "#f8fcff",
            profilePop: "#f8fcff",
            commandPop: "#f8fcff",
            search: "#f8fcff",
            hover: orange[50],
            hover2: orange[50],
            hover3: grey[900],
            opacity: "rgba(0, 0, 0, 0.1)",
            opacityHover: orange[50],
            opacityActive: "rgba(0, 0, 0, 0)",
            categoryActive: orange[500],
            slideHover: "rgba(0, 0, 0, 0.3)",
            slideComment: "rgba(0, 0, 0, 0.4)",
            groupApproachBackground: "rgba(0, 0, 0, 0.4)",
            uploadImgHover: "rgba(0, 0, 0, 0.1)",
            scrollBar: "#444",
            modal: "#f8fcff",
            modalShadow: "rgba(0, 0, 0, 0.7)",
            destructDelete: "#f00",
            destructDeleteHover: "#c00",
            destructCancelHover: "#ddd",
            productBack: orange[50],
            modalHeader: "#f8fcff",
            modal2: "#f8fcff",
            modalDisable: "#555",
            userCard: "#f8fcff",
            top: "#000",
            following: "#000",
            successBack: "rgba(0, 200, 70, 0.6)",
            warningBack: "rgba(200, 200, 0, 0.6)",
            imageUpload: "#dddddd",
            imageUploadHover: "#cccccc",
        },
        top: {
            main: "#fa8",
            secondary: "#fff",
            title: "#fff",
            tabBack: "#000",
            tabHover: "#111",
            modal: "#000",
            disabled: "#3f3a33",
            modalShadow: "rgba(0, 0, 0, 0.3)"
        },
        particle: {
            top: orange[500],
        },
        type: {
            followButton: "contained",
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            ::-webkit-scrollbar{
                width: 10px;
            },
            ::-webkit-scrollbar-thumb {
                background-color: #aaa;
                border-radius: 10px;
            },
            ::-webkit-scrollbar-track {
                background-color: transparent;
            }
            `
        }
    }
})
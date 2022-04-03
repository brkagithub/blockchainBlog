import { createTheme, ThemeOptions } from "@mui/material";

const defaultOpts: Partial<ThemeOptions> = {
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "1rem",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: "large",
      },
    },
  },
};

export const lightTheme = createTheme({
  typography: {
    body1: {
      color: "orange",
    },
    fontSize: 12,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#ff7043",
    },
    secondary: {
      main: "#ffffff",
    },
    error: {
      main: "#ffffff",
    },
  },
  ...defaultOpts,
});

export const darkTheme = createTheme({
  typography: {
    body1: {
      color: "black",
    },
    fontSize: 12,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    error: {
      main: "#D8D8D8",
    },
  },
  ...defaultOpts,
});

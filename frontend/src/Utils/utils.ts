import { createTheme } from '@mui/material/styles';

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
  hover: {
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    transition: {
      duration: 0.1,
    },
  },
};
export const whiteTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--appbar-default-bg": "rgb(var(--mui-palette-background-paper))",
        },
      },
    },
  },
});

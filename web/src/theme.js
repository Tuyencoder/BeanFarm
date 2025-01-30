import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Adjust the color as needed
    },
    background: {
      paper: '#fff', // Ensure the paper color is defined
    },
  },
  shape: {
    borderRadius: 8, // Adjust border radius if necessary
  },
});

export default theme;

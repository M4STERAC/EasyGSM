import { Theme, createTheme } from '@mui/material/styles';

export const darkTheme: Theme = createTheme({ palette: {
    mode: 'dark', 
    background: {
      default: '#0d1117',
      paper: '#f9f9f9',
    },
}});

export default darkTheme;
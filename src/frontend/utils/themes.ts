import { Theme, createTheme } from '@mui/material/styles';


export const darkTheme: Theme = createTheme({ palette: {
    mode: 'dark', 
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    background: {
      default: '#171b1f',
      paper: '#262f39',
    },
    text: {
      primary: '#fff',
      secondary: '$fff'
    },
}});


export const lightTheme: Theme = createTheme({ palette: {
  mode: 'light',
  text: {
    primary: '#000',
    secondary: '#fff'
  },
  background: {
    default: '#e6e6e6',
    paper: '#f9f9f9'
  }
}});

export default darkTheme;
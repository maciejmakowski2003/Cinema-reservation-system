
import './App.css'
import ResponsiveAppBar from './components/app-bar/AppBar'
import Hall from './components/hall/Hall'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SeatPickerProvider } from './providers/SeatProvider'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { orange } from '@mui/material/colors';
import MoviesList from './components/movie/MoviesList';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: orange[500]
      }
    },
    status: {
      danger: orange[500],
    },
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif'
      ].join(','),
    }
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SeatPickerProvider>
          <div id="App">
            <ResponsiveAppBar />
            <div id="content">
              <Routes>
                <Route path="/" element={<Hall />} />
                <Route path="/movies" element={<MoviesList />} />
              </Routes>
            </div>
          </div>
        </SeatPickerProvider>
      </ThemeProvider>

    </BrowserRouter >
  )
}

export default App

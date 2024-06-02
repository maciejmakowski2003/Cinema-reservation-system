
import './App.css'
import ResponsiveAppBar from './components/app-bar/AppBar'
import Hall from './components/hall/Hall'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { orange } from '@mui/material/colors';
import MoviesList from './components/movie/MoviesList';
import CinemasList from './components/cinema/CinemasList';
import { SeatPickerProvider } from './providers/SeatProvider';
import Cart from './components/cart/Cart';
import SignUp from './components/auth/SignUp';
import { AuthProvider } from './providers/AuthProvider';
import { SnackbarProvider } from './providers/SnackbarProvider';
import SignIn from './components/auth/SignIn';
import { CartProvider } from './providers/CartProvider';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }

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
      <AuthProvider> <SnackbarProvider>
        <CartProvider>
          <SeatPickerProvider>
            <ThemeProvider theme={theme}>
              <div id="App">
                <ResponsiveAppBar />
                <div id="content">
                  <Routes>
                    <Route path="/" element={<Hall />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/cinemas" element={<CinemasList />} />
                    <Route path="/movies" element={<MoviesList />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/showings/:showing_id" element={<Hall />} />
                  </Routes>
                </div>
              </div>
            </ThemeProvider>
          </SeatPickerProvider>
        </CartProvider>
      </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App

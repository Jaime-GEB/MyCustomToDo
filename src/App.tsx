import { Suspense, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import { useThemeStore } from './store/themeStore';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

function App() {
  const { theme: mode } = useThemeStore();

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6', // Tailwind blue-500
      },
      secondary: {
        main: '#10b981', // Tailwind emerald-500
      },
      background: {
        default: mode === 'dark' ? '#020617' : '#f9fafb', // slate-950 / gray-50
        paper: mode === 'dark' ? '#1e293b' : '#ffffff', // slate-800 / white
      },
      text: {
        primary: mode === 'dark' ? '#f8fafc' : '#0f172a', // slate-50 / slate-900
        secondary: mode === 'dark' ? '#94a3b8' : '#475569', // slate-400 / slate-600
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/MyCustomToDo">
        <Suspense
          fallback={
            <main className="h-full w-full flex justify-center items-center ">
              <CircularProgress />
            </main>
          }
        >
          <AppRouter />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
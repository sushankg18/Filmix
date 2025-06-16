import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/store.js'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColorModeScript, ChakraProvider, theme, Container, Box } from '@chakra-ui/react';
const root = ReactDOM.createRoot(document.getElementById('root'));

let Persistor = persistStore(store)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={Persistor}>
        <ColorModeScript />
        <ChakraProvider  theme={theme}>
          <Box bgGradient="linear(to-b, #101624  ,#04060A)" width={'100%'} height={'fit-content'}>
            <App />
          </Box>
          <ToastContainer />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode >
);

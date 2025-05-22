import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "@/theme";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";
// Redux store
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { injectStore } from "@/utils/authorizeAxios";

const persistor = persistStore(store);

// Inject store: is a technique when you need to use redux store variables in files outside the component scope like the current authorizeAxios file
injectStore(store);

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: "xs" },
              buttonOrder: ["confirm", "cancel"],
              confirmationButtonProps: { color: "secondary" },
              cancellationButtonProps: { color: "info", variant: "outlined" },
            }}
          >
            <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
            <CssBaseline />
            <App />
            <ToastContainer
              position='top-right'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='colored'
            />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);

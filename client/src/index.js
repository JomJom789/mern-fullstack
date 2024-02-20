import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


//* -------------------------------------------------------------------------- */
//*                           ThemeProvider Provider                           */
//* -------------------------------------------------------------------------- */
import { ThemeProvider } from './contexts/ThemeProvider';

//* -------------------------------------------------------------------------- */
//*                                State Reducer                               */
//* -------------------------------------------------------------------------- */
import authReducer from "./state/authReducer";
import adminReducer from "./state/adminReducer";

//* -------------------------------------------------------------------------- */
//*                                    Redux                                   */
//* -------------------------------------------------------------------------- */
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers } from 'redux'

//* -------------------------------------------------------------------------- */
//*                                Redux Persist                               */
//* -------------------------------------------------------------------------- */
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

//* -------------------------------------------------------------------------- */
//*                               Realtime Query                               */
//* -------------------------------------------------------------------------- */
import { setupListeners } from "@reduxjs/toolkit/query";

//* -------------------------------------------------------------------------- */
//*                                  ApiAdmin                                  */
//* -------------------------------------------------------------------------- */
import { api } from "./state/apiAdmin";

//* -------------------------------------------------------------------------- */
//*                                  Time Ago                                  */
//* -------------------------------------------------------------------------- */
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

//* -------------------------------------------------------------------------- */
//*                                 RootReducer                                */
//* -------------------------------------------------------------------------- */
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  [api.reducerPath]: api.reducer,
})

//* -------------------------------------------------------------------------- */
//*                             Store State Locally                            */
//* -------------------------------------------------------------------------- */
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, rootReducer);

//* -------------------------------------------------------------------------- */
//*                                Store Reducer                               */
//* -------------------------------------------------------------------------- */
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
        api.middleware,
      ),
});

//* -------------------------------------------------------------------------- */
//*                                  RTK Query                                 */
//* -------------------------------------------------------------------------- */

// * configureStore
// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     admin: adminReducer,
//     [api.reducerPath]: api.reducer,
//   },
//   middleware: (getDefault) => getDefault().concat(api.middleware),
// });

// * Real-time Query
setupListeners(store.dispatch);

//* -------------------------------------------------------------------------- */
//*                                    Root                                    */
//* -------------------------------------------------------------------------- */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={null} 
        persistor={persistStore(store)}
      >
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);



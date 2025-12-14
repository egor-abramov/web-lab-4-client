import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import calculatorReducer from '../calculator/model/calculatorSlice';
import authReducer from '../auth/model/authSlice';
import adminReducer from '../admin/model/adminSlice';

const config = {
    key: "root",
    storage,
    whiteList: ['auth', 'calculator', 'admin']
}

const rootReducer = combineReducers({
    calculator: calculatorReducer,
    auth: authReducer,
    admin: adminReducer
});

const persistedReducer = persistReducer(config, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

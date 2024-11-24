import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import movieReducer from './movieSlice.js'
import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'
import {combineReducers} from '@reduxjs/toolkit'


const persistConfig = {
    key : "root",
    version : 1,
    storage
}

const reducer = combineReducers({
    user : userReducer,
    movie : movieReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer : persistedReducer
})

export default store
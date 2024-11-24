import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
    name : "movie",
    initialState : {
        genreName : null,
    },
    reducers : {
        setGenreName : (state, action) => {
            state.genreName = action.payload
        }
    }
})

export const {setGenreName} = movieSlice.actions
export default movieSlice.reducer
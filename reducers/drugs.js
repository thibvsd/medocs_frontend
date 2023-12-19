import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: "", token: null, ShowSearchResults:false },
};

export const drugsSlice = createSlice({
  name: 'drugs',
  initialState,
  reducers: {

  addLastSearch: (state, action) => {
    state.value.search = action.payload;
  },

  },
});

export const { addLastSearch, addSearchQuery } = drugsSlice.actions;
export default drugsSlice.reducer;

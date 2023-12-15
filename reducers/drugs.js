import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: [], token: null, last5Searches:[] },
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

export const { addLastSearch } = drugSlice.actions;
export default drugSlice.reducer;

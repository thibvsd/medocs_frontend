import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: [], token: null },
};

export const drugSlice = createSlice({
  name: 'drug',
  initialState,
  reducers: {

  addLastSearch: (state, action) => {
    state.value.search = action.payload;
  },
    add3LastSearch: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
    },
  },
});

export const { addLastSearch, add3LastSearch } = drugSlice.actions;
export default drugSlice.reducer;

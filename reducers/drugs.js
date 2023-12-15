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
    add5LastSearches: (state, action) => {
      const { name, _id } = action.payload;
      // Vérifie si l'élément existe déjà dans last5Searches
      const isAlreadyPresent = state.value.last5Searches.some(
        (search) => search._id === _id
      );
      if (!isAlreadyPresent) {
        if (state.value.last5Searches.length >= 5) {
          // Si le tableau a déjà 5 éléments, retire le premier élément
          state.value.last5Searches.shift();
        }
        // Ajoute l'élément seulement s'il n'est pas déjà présent
        state.value.last5Searches.push({ name, _id });
      }
    },
  }});

export const { addLastSearch, add5LastSearches } = drugsSlice.actions;
export default drugsSlice.reducer;

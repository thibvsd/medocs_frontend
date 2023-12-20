import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, username: null, photoUris: [],
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('reducer payload', action.payload);
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.username = null;
    },
    addPhotoUri: (state, action) => {
      console.log("payload", action.payload);
      state.value.photoUris.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.value.photoUris = state.value.photoUris.filter((data) => data !== action.payload);
    },
  },
});

export const { login, logout, addPhotoUri, removePhoto } = userSlice.actions;

export default userSlice.reducer;

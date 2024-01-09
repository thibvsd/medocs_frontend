import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: { email: "", username: "", token: "", photos: [] },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.username = null;
    },
    addPhoto: (state, action) => {
      state.value.photos.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.value.photos = state.value.photos.filter(
        (data) => data !== action.payload
      );
    },
  },
});

export const { login, logout, addPhoto, removePhoto } = userSlice.actions;

export default userSlice.reducer;

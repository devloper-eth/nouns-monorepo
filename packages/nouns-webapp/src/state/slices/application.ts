import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertModal {
  show: boolean;
  title?: string;
  message?: string;
}

interface ApplicationState {
  useGreyBackground: boolean;
  alertModal: AlertModal;
  cursorVisibility: boolean;
}

const initialState: ApplicationState = {
  useGreyBackground: true,
  alertModal: {
    show: false,
  },
  cursorVisibility: true,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUseGreyBackground: (state, action: PayloadAction<boolean>) => {
      state.useGreyBackground = action.payload;
    },
    setAlertModal: (state, action: PayloadAction<AlertModal>) => {
      state.alertModal = action.payload;
    },
    setCursorVisibility: (state, action: PayloadAction<boolean>) => {
      state.cursorVisibility = action.payload;
    },
  },
});

export const { setUseGreyBackground, setAlertModal, setCursorVisibility } =
  applicationSlice.actions;

export default applicationSlice.reducer;

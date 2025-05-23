import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer, { logout } from "../features/authSlice";
import adminReducer from "../features/adminSlice";
import plazaReducer from "../features/plazaSlice";
import SiteEngineerReducer from "../features/siteEngineer";
import projectInchargeReducer from "../features/projectInchargeSlice";
import prijectReducer from "../features/projectSlice";
import issueReducer from "../features/issueSlice";
import countReducer from "../features/countSlice"
import attedenceReducer from "../features/attendenceSlice"
import userReducres from "../features/userSlice"

// 1. Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  admins: adminReducer,
  plaza: plazaReducer,
  siteEngineer: SiteEngineerReducer,
  projectIncharge: projectInchargeReducer,
  project: prijectReducer,
  issue: issueReducer,
  counts: countReducer,
  attendance: attedenceReducer,
  users: userReducres
});

// 2. Root reducer that listens for logout
const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    state = undefined; // reset entire redux state
  }
  return appReducer(state, action);
};

// 3. Pass rootReducer to store
const store = configureStore({
  reducer: rootReducer,
});

export default store;
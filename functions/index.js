const functions = require("firebase-functions");
const app = require("express")();
// const auth = require("./util/auth");
const cors = require("cors");

import auth from "./util/auth";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
  getAllUpcomingBirthdays,
  getAllUpcomingAnniversaries,
  getAllOutstandingInteractions,
} = require("./api/employees");

const {
  createMeeting,
  getAllMeetingsForEmployee,
  getMeetingDetails,
  updatedMeetingDetails,
  deleteMeeting,
} = require("./api/meetings");

app.post("/employees", auth, createEmployee);
app.get("/employees", auth, getAllEmployees);
app.get("/employees/anniversaries", auth, getAllUpcomingAnniversaries);
app.get("/employees/birthdays", auth, getAllUpcomingBirthdays);
app.get("/employees/interactions", auth, getAllOutstandingInteractions);
app.post("/employees/:employeeId/meetings", auth, createMeeting);
app.get("/employees/:employeeId/meetings", auth, getAllMeetingsForEmployee);
app.get("/employees/:employeeId/meetings/:meetingId", auth, getMeetingDetails);
app.put("/employees/:employeeId/meetings/:meetingId", auth, updatedMeetingDetails);
app.delete("/employees/:employeeId/meetings/:meetingId", auth, deleteMeeting);
app.get("/employees/:employeeId", auth, getSingleEmployee);
app.put("/employees/:employeeId", auth, updateEmployee);
app.delete("/employees/:employeeId", auth, deleteEmployee);

const { loginUser, getUserDetail, isUserSignedIn, signUpUser } = require("./api/users");

app.post("/login", loginUser);
app.get("/user", auth, getUserDetail);
app.post("/signup", signUpUser);
app.post("/user/auth", isUserSignedIn);

const { getSettings, saveSettings } = require("./api/settings");

app.get("/user/settings", auth, getSettings);
app.put("/user/settings", auth, saveSettings);

const { uploadFile } = require("./api/users");
app.post("/files", auth, uploadFile);

exports.engagement = functions.https.onRequest(app);

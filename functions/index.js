const functions = require("firebase-functions");
const multer = require("multer");
const app = require("express")();
const auth = require("./util/auth");
const cors = require("cors");
const express = require("express");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const upload = multer({
  storage: multer.memoryStorage(),
});

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
const { uploadProfilePicture } = require("./api/fileUpload");

app.post("/login", loginUser);
app.get("/user", auth, getUserDetail);
app.post("/user", signUpUser);
app.post("/user/auth", isUserSignedIn);
app.post("/upload", uploadProfilePicture, upload.single("file"));
exports.engagement = functions.https.onRequest(app);

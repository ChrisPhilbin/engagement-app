"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const app = require("express")();
// const auth = require("./util/auth");
const cors = require("cors");
const auth_1 = __importDefault(require("./util/auth"));
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const { createEmployee, getAllEmployees, getSingleEmployee, updateEmployee, deleteEmployee, getAllUpcomingBirthdays, getAllUpcomingAnniversaries, getAllOutstandingInteractions, } = require("./api/employees");
const { createMeeting, getAllMeetingsForEmployee, getMeetingDetails, updatedMeetingDetails, deleteMeeting, } = require("./api/meetings");
app.post("/employees", auth_1.default, createEmployee);
app.get("/employees", auth_1.default, getAllEmployees);
app.get("/employees/anniversaries", auth_1.default, getAllUpcomingAnniversaries);
app.get("/employees/birthdays", auth_1.default, getAllUpcomingBirthdays);
app.get("/employees/interactions", auth_1.default, getAllOutstandingInteractions);
app.post("/employees/:employeeId/meetings", auth_1.default, createMeeting);
app.get("/employees/:employeeId/meetings", auth_1.default, getAllMeetingsForEmployee);
app.get("/employees/:employeeId/meetings/:meetingId", auth_1.default, getMeetingDetails);
app.put("/employees/:employeeId/meetings/:meetingId", auth_1.default, updatedMeetingDetails);
app.delete("/employees/:employeeId/meetings/:meetingId", auth_1.default, deleteMeeting);
app.get("/employees/:employeeId", auth_1.default, getSingleEmployee);
app.put("/employees/:employeeId", auth_1.default, updateEmployee);
app.delete("/employees/:employeeId", auth_1.default, deleteEmployee);
const { loginUser, getUserDetail, isUserSignedIn, signUpUser } = require("./api/users");
app.post("/login", loginUser);
app.get("/user", auth_1.default, getUserDetail);
app.post("/signup", signUpUser);
app.post("/user/auth", isUserSignedIn);
const { getSettings, saveSettings } = require("./api/settings");
app.get("/user/settings", auth_1.default, getSettings);
app.put("/user/settings", auth_1.default, saveSettings);
const { uploadFile } = require("./api/users");
app.post("/files", auth_1.default, uploadFile);
exports.engagement = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map
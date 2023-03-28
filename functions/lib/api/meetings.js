"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeeting = exports.updatedMeetingDetails = exports.getMeetingDetails = exports.getAllMeetingsForEmployee = exports.createMeeting = void 0;
const admin_1 = require("../util/admin");
const createMeeting = (request, response) => {
    if (request.body.notes.trim() === "") {
        return response.status(400).json({ error: "Meeting notes cannot be blank" });
    }
    admin_1.db.doc(`/employees/${request.params.employeeId}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return response.status(404).json();
        }
        if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId) !== request.user.uid) {
            return response.status(401).json({ error: "You are not authorized." });
        }
    });
    const newMeeting = {
        userId: request.user.uid,
        notes: request.body.notes,
        meetingDate: request.body.meetingDate,
        createdAt: new Date().toISOString(),
        agreedUponActions: request.body.agreedUponActions,
        hasOutstandingActionItems: request.body.hasOutstandingActionItems,
    };
    admin_1.db.collection(`employees/${request.params.employeeId}/meetings`)
        .add(newMeeting)
        .then((doc) => {
        const responseMeeting = newMeeting;
        responseMeeting.id = doc.id;
        return response.status(200).json(responseMeeting);
    })
        .catch((error) => {
        response.status(500).json({ error: "Something went wrong." });
    });
};
exports.createMeeting = createMeeting;
const getAllMeetingsForEmployee = (request, response) => {
    admin_1.db.doc(`/employees/${request.params.employeeId}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return response.status(404).json();
        }
        if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId) !== request.user.uid) {
            return response.status(401).json({ error: "You are not authorized." });
        }
    });
    admin_1.db.collection(`/employees/${request.params.employeeId}/meetings`)
        .orderBy("createdAt", "asc")
        .get()
        .then((data) => {
        let meetings = [];
        data.forEach((doc) => {
            if (doc.data().userId !== request.user.uid) {
                return response.status(401).json({ error: "You are not authorized" });
            }
            meetings.push(Object.assign(Object.assign({}, doc.data()), { meetingId: doc.id }));
        });
        return response.status(200).json(meetings);
    })
        .catch((error) => {
        return response.status(500).json({ error: "Something went wrong." });
    });
};
exports.getAllMeetingsForEmployee = getAllMeetingsForEmployee;
const getMeetingDetails = (request, response) => {
    admin_1.db.doc(`/employees/${request.params.employeeId}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return response.status(404).json();
        }
        if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId) !== request.user.uid) {
            return response.status(401).json({ error: "You are not authorized." });
        }
    });
    admin_1.db.doc(`employees/${request.params.employeeId}/meetings/${request.params.meetingId}`)
        .get()
        .then((doc) => {
        var _a;
        if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId) !== request.user.uid) {
            return response.status(401).json({ error: "You are not authorized" });
        }
        return response.status(200).json(Object.assign(Object.assign({}, doc.data()), { meetingId: doc.id }));
    });
};
exports.getMeetingDetails = getMeetingDetails;
const updatedMeetingDetails = (request, response) => {
    admin_1.db.doc(`/employees/${request.params.employeeId}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return response.status(404).json();
        }
        if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId) !== request.user.uid) {
            return response.status(401).json({ error: "You are not authorized." });
        }
    });
    if (request.body.createdAt) {
        return response.status(403).json({ error: "Not allowed to edit." });
    }
    if (request.body.notes.trim() === "") {
        return response.status(403).json({ error: "Field cannot be blank." });
    }
    let document = admin_1.db.doc(`employees/${request.params.employeeId}/meetings/${request.params.meetingId}`);
    document
        .update(request.body)
        .then((updatedMeeting) => {
        return response.status(200).json(updatedMeeting);
    })
        .catch((error) => {
        return response.status(500).json({ error: "Something went wrong." });
    });
};
exports.updatedMeetingDetails = updatedMeetingDetails;
const deleteMeeting = (request, response) => {
    console.log("deleting meeting...");
    admin_1.db.doc(`/employees/${request.params.employeeId}`)
        .get()
        .then((doc) => {
        var _a;
        if (!doc.exists) {
            return response.status(404).json();
        }
        if (((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId) !== request.user.uid) {
            return response.status(401).json({ error: "You are not authorized." });
        }
    });
    admin_1.db.collection(`employees/${request.params.employeeId}/meetings`)
        .doc(request.params.meetingId)
        .delete()
        .then((doc) => {
        return response.status(200).json(request.params.meetingId);
    })
        .catch((error) => {
        response.status(500).json({ error: "Something went wrong." });
    });
};
exports.deleteMeeting = deleteMeeting;
//# sourceMappingURL=meetings.js.map
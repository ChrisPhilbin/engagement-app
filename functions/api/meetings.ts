import { Response } from "express";
import { db } from "../util/admin";
import { IAppRequest } from "./models/app-request-model";
import { IMeeting } from "./models/meeting-model";

export const createMeeting = (request: IAppRequest, response: Response) => {
  if (request.body.notes.trim() === "") {
    return response.status(400).json({ error: "Meeting notes cannot be blank" });
  }

  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }

      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
    });

  const newMeeting: IMeeting = {
    userId: request.user.uid,
    notes: request.body.notes,
    meetingDate: request.body.meetingDate,
    createdAt: new Date().toISOString(),
    agreedUponActions: request.body.agreedUponActions,
    hasOutstandingActionItems: request.body.hasOutstandingActionItems,
  };

  db.collection(`employees/${request.params.employeeId}/meetings`)
    .add(newMeeting)
    .then((doc) => {
      const responseMeeting = newMeeting;
      responseMeeting.id = doc.id;
      return response.status(200).json(responseMeeting);
    })
    .catch((error: Error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

export const getAllMeetingsForEmployee = (request: IAppRequest, response: Response) => {
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }

      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
    });

  db.collection(`/employees/${request.params.employeeId}/meetings`)
    .orderBy("createdAt", "asc")
    .get()
    .then((data) => {
      let meetings: IMeeting[] = [];
      data.forEach((doc) => {
        if (doc.data().userId !== request.user.uid) {
          return response.status(401).json({ error: "You are not authorized" });
        }
        meetings.push({ ...(doc.data() as IMeeting), meetingId: doc.id });
      });
      return response.status(200).json(meetings);
    })
    .catch((error) => {
      return response.status(500).json({ error: "Something went wrong." });
    });
};

export const getMeetingDetails = (request: IAppRequest, response: Response) => {
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }

      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
    });

  db.doc(`employees/${request.params.employeeId}/meetings/${request.params.meetingId}`)
    .get()
    .then((doc) => {
      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized" });
      }

      return response.status(200).json({ ...doc.data(), meetingId: doc.id });
    });
};

export const updatedMeetingDetails = (request: IAppRequest, response: Response) => {
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }

      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
    });

  if (request.body.createdAt) {
    return response.status(403).json({ error: "Not allowed to edit." });
  }

  if (request.body.notes.trim() === "") {
    return response.status(403).json({ error: "Field cannot be blank." });
  }

  let document = db.doc(`employees/${request.params.employeeId}/meetings/${request.params.meetingId}`);
  document
    .update(request.body)
    .then((updatedMeeting) => {
      return response.status(200).json(updatedMeeting);
    })
    .catch((error) => {
      return response.status(500).json({ error: "Something went wrong." });
    });
};

export const deleteMeeting = (request: IAppRequest, response: Response) => {
  console.log("deleting meeting...");
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }

      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
    });

  db.collection(`employees/${request.params.employeeId}/meetings`)
    .doc(request.params.meetingId)
    .delete()
    .then((doc) => {
      return response.status(200).json(request.params.meetingId);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

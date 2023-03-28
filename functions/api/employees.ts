import { db } from "../util/admin";
import { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } from "../util/dateChecker";
import { validRelations } from "../util/relations";
import { setupEmployeeObject, setupEmployeeObjectWithNews } from "../util/employeeHelper";
import { IAppRequest } from "./models/app-request-model";
import { IRelationship } from "./models/relationship-model";
import { Response } from "express";
import { IEmployee } from "./models/employee-model";
import { IMeeting } from "./models/meeting-model";
import { IInteraction } from "./models/interaction-model";

export const createEmployee = (request: IAppRequest, response: Response) => {
  if (request.body.firstName.trim() === "" || !request.user.uid) {
    return response.status(400).json({ error: "Employee first name cannot be blank." });
  }

  if (request.body.relations) {
    request.body.relations.forEach((relationship: IRelationship) => {
      if (!validRelations.includes(relationship.type.toLowerCase())) {
        return response.status(400).json({ error: "Unknown relationship type." });
      }
    });
  }

  const newEmployee: IEmployee = {
    userId: request.user.uid,
    firstName: request.body.firstName,
    lastName: request.body.lastName || "",
    email: request.body.email || "",
    linkedInUrl: request.body.linkedInUrl || "",
    facebookUrl: request.body.facebookUrl || "",
    profilePictureUrl: request.body.profilePictureUrl || "",
    createdAt: new Date().toISOString(),
    hireDate: new Date(request.body.hireDate) || null,
    birthDate: new Date(request.body.birthDate) || null,
    lastInteraction: new Date(request.body.lastInteraction) || null,
    interests: request.body.interests || [],
    relations: request.body.relations || [],
    sportsTeams: request.body.sportsTeams || [],
    pets: request.body.pets || [],
  };

  db.collection("employees")
    .add(newEmployee)
    .then((doc) => {
      const responseEmployee = newEmployee;
      responseEmployee.id = doc.id;
      return response.status(200).json(responseEmployee);
    })
    .catch((error: Error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

exports.getAllEmployees = async (request: IAppRequest, response: Response) => {
  try {
    const employeesRef = await db.collection("employees").where("userId", "==", request.user.uid).get();
    let employees: IEmployee[] = [];
    employeesRef.forEach((employeeDocument) => {
      //@ts-ignore
      employees.push(setupEmployeeObject(employeeDocument, request.headers));
    });
    for (const singleEmployee of employees) {
      const meetingsSnapshot = await db
        .collection(`/employees/${singleEmployee.employeeId}/meetings`)
        .orderBy("createdAt", "asc")
        .get();
      let meetings: IMeeting[] = [];
      meetingsSnapshot.forEach((meetingData) => {
        meetings.push({ ...(meetingData.data() as IMeeting), meetingId: meetingData.id });
      });
      singleEmployee.meetings = meetings;
    }
    return response.status(200).json(employees);
  } catch (error) {
    console.error(error, "Something went wrong");
    return response.status(500).json({ error: "Something went wrong." });
  }
};

exports.getSingleEmployee = (request: IAppRequest, response: Response) => {
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }
      if (doc.data()?.userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
      //@ts-ignore
      let employeeData = await setupEmployeeObjectWithNews(doc, request.headers);
      return response.status(200).json(employeeData);
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({ error: "Something went wrong" });
    });
};

exports.updateEmployee = async (request: IAppRequest, response: Response) => {
  if (request.body.createdAt || request.body.employeeId) {
    return response.status(403).json({ error: "Not allowed to edit" });
  }

  if (request.body.firstName.trim() === "") {
    return response.status(403).json({ error: "Field cannot be blank" });
  }
  request.body.birthDate = request.body.birthDate ? new Date(request.body.birthDate) : "";
  request.body.hireDate = request.body.hireDate ? new Date(request.body.hireDate) : "";
  request.body.lastInteraction = request.body.lastInteraction ? new Date(request.body.lastInteraction) : "";

  let document = db.collection("employees").doc(`${request.params.employeeId}`);
  document.update(request.body);
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then(async (updatedEmployeeDocument) => {
      //@ts-ignore
      let updatedEmployee = await setupEmployeeObjectWithNews(updatedEmployeeDocument, request.headers);
      updatedEmployee.employeeId = request.params.employeeId;
      return response.status(200).json(updatedEmployee);
    })
    .catch((error) => {
      return response.status(500).json({ error: "Something went wrong." });
    });
};

exports.deleteEmployee = (request: IAppRequest, response: Response) => {
  db.collection("employees")
    .doc(request.params.employeeId)
    .delete()
    .then((doc) => {
      return response.status(200).json(request.params.employeeId);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

exports.getAllUpcomingBirthdays = (request: IAppRequest, response: Response) => {
  const { birthdatethreshold } = request.headers;
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employeeBirthDates: IInteraction[] = [];
      data.forEach((doc) => {
        if (hasUpcomingBirthday(doc.data().birthDate, parseInt(birthdatethreshold))) {
          employeeBirthDates.push({
            employeeId: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            birthDate: doc.data().birthDate.toDate(),
          });
        }
      });
      return response.status(200).json(employeeBirthDates);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

exports.getAllUpcomingAnniversaries = (request: IAppRequest, response: Response) => {
  const { workanniversarythreshold } = request.headers;
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employees: IInteraction[] = [];
      data.forEach((doc) => {
        if (hasUpcomingWorkAnniversary(doc.data().hireDate, parseInt(workanniversarythreshold))) {
          employees.push({
            employeeId: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            hiredate: doc.data().hireDate.toDate(),
          });
        }
      });
      return response.status(200).json(employees);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

exports.getAllOutstandingInteractions = (request: IAppRequest, response: Response) => {
  const { lastinteractionthreshold } = request.headers;
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employees: IInteraction[] = [];
      data.forEach((doc) => {
        if (!hasRecentInteraction(doc.data().lastInteraction, parseInt(lastinteractionthreshold))) {
          employees.push({
            employeeId: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            lastInteraction: doc.data().lastInteraction ? doc.data().lastInteraction.toDate() : "",
          });
        }
      });
      return response.status(200).json(employees);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

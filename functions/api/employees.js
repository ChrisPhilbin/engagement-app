const { db } = require("../util/admin");
const { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } = require("../util/dateChecker");
const { fetchInterests, getInterestUpdates } = require("../util/getNews");
const { validRelations } = require("../util/relations");
const { meetingsHelper, defaultAppSettings } = require("./meetings");
const configureUserAppSettings = require("../util/settingsHelper");

exports.createEmployee = (request, response) => {
  if (request.body.firstName.trim() === "" || !request.user.uid) {
    return response.status(400).json({ error: "Employee first name cannot be blank." });
  }

  if (request.body.relations) {
    request.body.relations.forEach((relationship) => {
      if (!validRelations.includes(relationship.type.toLowerCase())) {
        return response.status(400).json({ error: "Unknown relationship type." });
      }
    });
  }

  const newEmployee = {
    userId: request.user.uid,
    firstName: request.body.firstName,
    lastName: request.body.lastName || "",
    email: request.body.email || "",
    linkedInUrl: request.body.linkedInUrl || "",
    facebookUrl: request.body.facebookUrl || "",
    createdAt: new Date().toISOString(),
    hireDate: new Date(request.body.hireDate) || null,
    birthDate: new Date(request.body.birthDate) || null,
    lastInteraction: new Date(request.body.lastInteraction) || null,
    interests: request.body.interests || [],
    relations: request.body.relations || [],
    sportsTeams: request.body.sportsTeams || [],
  };

  db.collection("employees")
    .add(newEmployee)
    .then((doc) => {
      const responseEmployee = newEmployee;
      responseEmployee.id = doc.id;
      return response.status(200).json(responseEmployee);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

exports.getAllEmployees = async (request, response) => {
  try {
    const employeesRef = await db.collection("employees").where("userId", "==", request.user.uid).get();
    let employees = [];
    employeesRef.forEach((doc) => {
      employees.push({
        employeeId: doc.id,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        email: doc.data().email,
        linkedInUrl: doc.data().linkedInUrl,
        facebookUrl: doc.data().facebookUrl,
        profilePictureUrl: doc.data().profilePictureUrl,
        createdAt: doc.data().createdAt,
        hireDate: doc.data().hireDate ? doc.data().hireDate.toDate() : "",
        birthDate: doc.data().birthDate ? doc.data().birthDate.toDate() : "",
        hasUpcomingBirthday: hasUpcomingBirthday(doc.data().birthDate),
        hasUpcomingWorkAnniversary: hasUpcomingWorkAnniversary(doc.data().hireDate),
        hasRecentInteraction: hasRecentInteraction(doc.data().lastInteraction),
        lastInteraction: doc.data().lastInteraction ? doc.data().lastInteraction.toDate() : "",
        interests: doc.data().interests,
        sportsTeams: doc.data().sportsTeams,
        relations: doc.data().relations,
      });
    });
    for (const singleEmployee of employees) {
      const meetingsSnapshot = await db
        .collection(`/employees/${singleEmployee.employeeId}/meetings`)
        .orderBy("createdAt", "asc")
        .get();
      let meetings = [];
      meetingsSnapshot.forEach((meetingData) => {
        meetings.push({ ...meetingData.data(), meetingId: meetingData.id });
      });
      singleEmployee.meetings = meetings;
    }
    return response.status(200).json(employees);
  } catch (error) {
    console.error(error, "Something went wrong");
    return response.status(500).json({ error: "Something went wrong." });
  }
};

exports.getSingleEmployee = (request, response) => {
  db.doc(`/employees/${request.params.employeeId}`)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        return response.status(404).json();
      }
      if (doc.data().userId !== request.user.uid) {
        return response.status(401).json({ error: "You are not authorized." });
      }
      employeeData = doc.data();
      employeeData.hireDate = doc.data().hireDate ? doc.data().hireDate.toDate() : null;
      employeeData.birthDate = doc.data().birthDate ? doc.data().birthDate.toDate() : null;
      employeeData.lastInteraction = doc.data().lastInteraction ? doc.data().lastInteraction.toDate() : null;
      employeeData.employeeId = doc.id;
      employeeData.hasUpcomingBirthday = hasUpcomingBirthday(doc.data().birthDate);
      employeeData.hasUpcomingWorkAnniversary = hasUpcomingWorkAnniversary(doc.data().hireDate);
      employeeData.hasRecentInteraction = hasRecentInteraction(doc.data().lastInteraction);
      (employeeData.interests = doc.data().interests ? doc.data().interests : null),
        (employeeData.sportsTeams = doc.data().sportsTeams ? doc.data().sportsTeams : null),
        (employeeData.relations = doc.data().relations ? doc.data().relations : null),
        await getInterestUpdates(doc.data().interests).then((interests) => {
          employeeData.newsFeed = interests;
        });
      await getInterestUpdates(doc.data().sportsTeams).then((sportsNews) => {
        employeeData.sportsNews = sportsNews;
      });
      return response.status(200).json(employeeData);
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({ error: "Something went wrong" });
    });
};

exports.updateEmployee = (request, response) => {
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
  document
    .update(request.body)
    .then((updatedEmployee) => {
      updatedEmployee.employeeId = request.params.employeeId;
      return response.status(200).json(updatedEmployee);
    })
    .catch((error) => {
      return response.status(500).json({ error: "Something went wrong." });
    });
};

exports.deleteEmployee = (request, response) => {
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

exports.getAllUpcomingBirthdays = (request, response) => {
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employees = [];
      data.forEach((doc) => {
        if (hasUpcomingBirthday(doc.data().birthDate)) {
          employees.push({
            employeeId: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            birthDate: doc.data().birthDate.toDate(),
          });
        }
      });
      return response.status(200).json(employees);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};

exports.getAllUpcomingAnniversaries = (request, response) => {
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employees = [];
      data.forEach((doc) => {
        if (hasUpcomingWorkAnniversary(doc.data().hireDate)) {
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

exports.getAllOutstandingInteractions = (request, response) => {
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employees = [];
      data.forEach((doc) => {
        if (!hasRecentInteraction(doc.data().lastInteraction)) {
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

const { db } = require("../util/admin");
const { hasUpcomingBirthday, hasUpcomingWorkAnniversary, hasRecentInteraction } = require("../util/dateChecker");
const { fetchInterests, getInterestUpdates } = require("../util/getNews");

exports.createEmployee = (request, response) => {
  if (request.body.employeeFirstName.trim() === "" || !request.user.uid) {
    return response.status(400).json({ error: "Employee first name cannot be blank." });
  }

  const newEmployee = {
    userId: request.user.uid,
    firstName: request.body.employeeFirstName,
    lastName: request.body.employeeLastName || "",
    email: request.body.employeeEmail || "",
    createdAt: new Date().toISOString(),
    hireDate: request.body.employeeHireDate || "",
    birthDate: new Date(request.body.employeeBirthDate) || null,
    lastInteraction: null,
    interests: request.body.employeeInterests || [],
    sportsTeams: request.body.employeeSportsTeams || [],
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

exports.getAllEmployees = (request, response) => {
  db.collection("employees")
    .where("userId", "==", request.user.uid)
    .get()
    .then((data) => {
      let employees = [];
      data.forEach((doc) => {
        employees.push({
          employeeId: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          createdAt: doc.data().createdAt,
          hireDate: doc.data().hireDate,
          birthDate: doc.data().birthDate,
          hasUpcomingBirthday: hasUpcomingBirthday(doc.data().birthDate),
          hasUpcomingWorkAnniversary: hasUpcomingWorkAnniversary(doc.data().hireDate),
          hasRecentInteraction: hasRecentInteraction(doc.data().lastInteraction),
          lastInteraction: doc.data().lastInteraction,
          interests: doc.data().interests,
          sportsTeams: doc.data().sportsTeams,
        });
      });
      return response.status(200).json(employees);
    })
    .catch((error) => {
      return response.status(500).json({ error: "Something went wrong" });
    });
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
      employeeData.employeeId = doc.id;
      employeeData.hasUpcomingBirthday = hasUpcomingBirthday(doc.data().birthDate);
      employeeData.hasUpcomingWorkAnniversary = hasUpcomingWorkAnniversary(doc.data().hireDate);
      employeeData.hasRecentInteraction = hasRecentInteraction(doc.data().lastInteraction);
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

  let document = db.collection("employees").doc(`${request.params.employeeId}`);
  document
    .update(request.body)
    .then((updatedPost) => {
      return response.status(200).json(updatedPost);
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
            birthDate: doc.data().birthDate,
          });
        }
        return response.status(200).json(employees);
      });
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
            hiredate: doc.data().hireDate,
          });
        }
        return response.status(200).json(employees);
      });
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
    });
};
// const admin = require("./firebase-admin");
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();
// const db = admin.firestore();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());

// app.post("/createProject", async (req, res) => {
//   try {
//     const { name, owner } = req.body;

//     if (!name || !owner) {
//       return res.status(400).json({ error: "Incomplete project data" });
//     }

//     const projectData = {
//       name,
//       owner: { ...owner }, 
//       participants: [{ ...owner }],
//       numParticipants: participants.length,
//     };

//     //projectData.numParticipants = projectData.participants.length
//     const projectRef = await db.collection("projects").add(projectData);
//     const projectDoc = await projectRef.get();
//     const project = projectDoc.data();
//     project.id = projectDoc.id;
//     console.log("Proiect creat cu ID:", typeof projectRef.id, projectRef.id);

//     return res
//       .status(201)
//       .json({ message: "Project created successfully", project });
//   } catch (error) {
//     console.error("Error creating project:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });



// app.get("/getAllProjects", async (req, res) => {
//   try {
//     const projectsSnapshot = await db.collection("projects").get();
//     const projects = [];
//     projectsSnapshot.forEach((projectDoc) => {
//       projects.push({id: projectDoc.id, ...projectDoc.data()})
//     });
//     res.json(projects);
//   } catch (error) {
//     console.error("Error fetching projects:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.put("/projects/:projectId", async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const { name, numParticipants, participants } = req.body;

//     const projectDoc = await db.collection("projects").doc(projectId).get();

//     if (!projectDoc.exists) {
//       return res.status(404).json({ error: "Project does not exist." });
//     }

//     await db.collection("projects").doc(projectId).update({ name, numParticipants, participants });

//     console.log(projectDoc)
//     return res.status(200).json({ message: "Project updated successfully" });
//   } catch (error) {
//     console.error("Error editing project:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.delete("/projects/:projectId", async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const projectDoc = await db.collection("projects").doc(projectId).get();

//     if (!projectDoc.exists) {
//       return res.status(404).json({ error: "Project does not exist." });
//     }

//     await db.collection("projects").doc(projectId).delete();

//     return res.status(200).json({ message: "Project deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting project:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
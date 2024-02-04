const generateFakerProjects = require("./faker-generate-data");
const admin = require("./firebase-admin");
const db = admin.firestore();

const createProject = async (req, res) => {
  try {
    const { name, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({ error: "Incomplete project data" });
    }

    const existingProject = await db.collection("projects").where("name", "==", name).get();

    if (!existingProject.empty) {
      return res.status(409).json({ error: "A project with the same name already exists" });
    }

    const projectData = {
      name,
      owner: { ...owner },
      participants: [{ ...owner }],
      numParticipants: 1,
    };

    const projectRef = await db.collection("projects").add(projectData);
    const projectDoc = await projectRef.get();
    const project = projectDoc.data();
    project.id = projectDoc.id;

    console.log("Proiect creat cu ID:", typeof projectRef.id, projectRef.id);

    return res
      .status(201)
      .json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Something went wrong.." });
  }
};


const createFakerProject = async (name, owner) => {
  try {
    const projectData = {
      name,
      owner: { ...owner },
      participants: [{ ...owner }],
      numParticipants: 1,
    };
    const projectRef = await db.collection("projects").add(projectData);
    const projectDoc = await projectRef.get();
    const project = projectDoc.data();
    project.id = projectDoc.id;

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projectsSnapshot = await db.collection("projects").get();
    const projects = [];
    projectsSnapshot.forEach((projectDoc) => {
      projects.push({ id: projectDoc.id, ...projectDoc.data() });
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, numParticipants, participants } = req.body;

    const projectDoc = await db.collection("projects").doc(projectId).get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project does not exist." });
    }

    

    await db.collection("projects").doc(projectId).update({ name, numParticipants, participants });

    console.log(projectDoc);
    return res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error editing project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const projectDoc = await db.collection("projects").doc(projectId).get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project does not exist." });
    }

    await db.collection("projects").doc(projectId).delete();

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const generateData = async (req, res) => {
  try {
    console.log("Endpoint /generateData called");
    const { owner } = req.body;

    const projects = generateFakerProjects(owner, 2);

    const projectsPromis = projects.map((p) =>
      createFakerProject(p.name, owner)
    );
    await Promise.all(projectsPromis);

    res.status(200).json({ message: "Successfully generated data." });
  } catch (error) {
    console.error("Error generating faker data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProject,
  updateProject,
  getAllProjects,
  deleteProject,
  generateData,
};

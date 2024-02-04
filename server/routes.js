const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/createProject", controller.createProject);
router.post("/generateData", controller.generateData);
router.get("/getAllProjects", controller.getAllProjects);
router.put("/projects/:projectId", controller.updateProject);
router.delete("/projects/:projectId", controller.deleteProject);

module.exports = router;

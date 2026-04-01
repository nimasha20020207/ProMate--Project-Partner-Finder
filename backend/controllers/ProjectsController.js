const Project = require("../models/ProjectsMock");

// Get all projects
exports.getProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};

// Update project
exports.updateProject = async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Delete project
exports.deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ msg: "Project deleted" });
};

// Create student (ADD THIS)
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
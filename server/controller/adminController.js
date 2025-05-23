import Project from "../model/projectModel.js"; // Adjust the path accordingly
import ProjectIncharge from "../model/projectEngineerModel.js";
import mongoose from "mongoose";
import authEssentials from "./index.js";
import Plaza from "../model/plazaModel.js";
import Admin from "../model/adminModel.js";
import { dotenvVar } from "../config.js";
import { genAttendancePdf } from "../utils/pdfgenerate.js";

import Issue from "../model/issueModel.js";
import { generatePDF } from "../utils/pdfgenerate.js";

import { User, RoleHistory } from "../model/user.js";
const adminCtrl = {

  //project create read update delete



  downloadattendancePdf: async (req, res) => {
    try {
      const filters = req.query;  // Extract filters from query params
      console.log(filters);

      const pdfBuffer = await genAttendancePdf(filters);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="issues_report.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (err) {
      console.error("Error generating PDF:", err);
      res.status(500).send('Error generating PDF');
    }
  },
  downloadPdf: async (req, res) => {
    try {
      const filters = req.query;  // Extract filters from query params
      console.log(filters);

      const pdfBuffer = await generatePDF(filters);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="issues_report.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (err) {
      console.error("Error generating PDF:", err);
      res.status(500).send('Error generating PDF');
    }
  },



  createProject: async (req, res) => {
    try {
      const { clientName, projectName, assignedTo, PIU_Name, location } = req.body;
      const createdBy = req.user.user; // Assuming you have user info in req.user

      if (!clientName || !projectName || !PIU_Name || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }

      let projectData = { clientName, projectName, createdBy, PIU_Name, location };

      if (assignedTo && assignedTo.trim() !== "") {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
          return res.status(400).json({ message: "Invalid ID" });
        }

        const incharge = await ProjectIncharge.findById(assignedTo);
        if (!incharge) {
          return res.status(400).json({ message: "Project incharge not found" });
        }

        projectData.assignedTo = assignedTo;
      }

      const project = new Project(projectData);
      await project.save();

      res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get all projects
  getProjects: async (req, res) => {
    try {
      const projects = await Project.find({ isActive: true }).populate("createdBy", "name email")
        .populate("assignedTo")
        .populate("plazas");
      console.log("projects");

      console.log(projects);

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjectBYInchargeId: async (req, res) => {
    try {
      const id = req.user.user;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "id is missing or invalid id " })
      }

      const project = await Project.find({ assignedTo: id }).populate("assignedTo")
        .populate("plazas");

      if (!project) {
        return res.state(400).json({ message: "no Project found" })
      }

      return res.status(200).json({ message: "founded", project })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "internal server error" })

    }
  },
  // Get a single project by ID
  getProjectById: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate("createdBy", "name email");
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a project
  updateProject: async (req, res) => {
    const { id } = req.params
    const { clientName, projectName, assignedTo, PIU_Name, location } = req.body;
    try {
      console.log(id);
      console.log(clientName);
      console.log(projectName);
      console.log(assignedTo);
      console.log(PIU_Name);
      console.log(location);






      if (!id || !mongoose.Types.ObjectId.isValid(id) || !assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: "invalid id" })
      }
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { clientName, projectName, assignedTo, PIU_Name, location },
        { new: true, runValidators: true }
      );

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a project
  deleteProject: async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //projectEngineer create read update delete 
  // Create a new Project Incharge
  createProjectIncharge: async (req, res) => {
    try {
      let { firstName, lastName, phoneNO, username, password, email, assignedProject, isEngineerAlso, address } = req.body;


      if (isEngineerAlso === "") {
        isEngineerAlso = undefined;
      }
      console.log(req.body);

      // Validation
      if (!firstName || !lastName || !phoneNO || !username || !email || !password || !assignedProject || !address?.city || !address?.state || !address?.homeAddress) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Hash Password
      const hash = await authEssentials.createHash(password, dotenvVar.SALT);

      // Create Project Incharge
      console.log(isEngineerAlso);
      console.log(req.user.user);

      const projectIncharge = new ProjectIncharge({
        firstName,
        lastName,
        phoneNO,
        username,
        isEngineerAlso,
        password: hash,
        email,
        assignedProject,
        assignedBy: req.user.user,  // ✅ Store ObjectId, not an object
        assignedByModel: req.user.role, // ✅ Store the role ("Admin" or "SuperAdmin")
        address
      });

      await projectIncharge.save();
      if (assignedProject) {
        await Project.findByIdAndUpdate(assignedProject, { assignedTo: assignedProject })
      }
      res.status(201).json({ message: "Project Incharge created successfully", projectIncharge });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProjectIncharges: async (req, res) => {
    try {
      const projectIncharges = await ProjectIncharge.find({ isActive: true })
        .populate("assignedProject", "projectName")
        .populate("assignedBy", "firstName");

      console.log(projectIncharges);
      res.status(200).json(projectIncharges);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
  // Get a single Project Incharge by ID
  getProjectInchargeById: async (req, res) => {
    const { id } = req.params;
    try {
      const projectIncharge = await ProjectIncharge.findById(id).populate("assignedProject", "projectName").populate("assignedBy", "email");
      if (!projectIncharge) {
        return res.status(404).json({ message: "Project Incharge not found" });
      }
      res.status(200).json(projectIncharge);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Update a Project Incharge
  updateProjectIncharge: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "invalid id" })
      }
      const { firstName, lastName, phoneNO, username, email, assignedProject, } = req.body;

      const projectIncharge = await ProjectIncharge.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, phoneNO, username, email, assignedProject },
        { new: true, runValidators: true }
      );

      if (!projectIncharge) {
        return res.status(404).json({ message: "Project Incharge not found" });
      }
      res.status(200).json({ message: "Project Incharge updated successfully", projectIncharge });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a Project Incharge
  deleteProjectIncharge: async (req, res) => {
    const { id } = req.params
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "invalid id" })
      }
      const projectIncharge = await ProjectIncharge.findByIdAndUpdate(id, { isActive: false });
      if (!projectIncharge) {
        return res.status(404).json({ message: "Project Incharge not found" });
      }
      res.status(200).json({ message: "Project Incharge deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //resolve issue

  resolveIssue: async (req, res) => {
    try {
      const { remarks, issueId } = req.body;

      if (!remarks || !issueId) {
        return res.status(400).json({ message: "Details are missing" });
      }

      const issueExist = await Issue.findOne({ issueId });

      if (!issueExist) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // Update issue with resolution details
      // Determine and assign the role model properly
      if (req.user.role === "Admin") {
        issueExist.rectifiedByModel = "Admin";
      } else if (req.user.role === "project_incharge") {
        issueExist.rectifiedByModel = "User";
      } else {
        issueExist.rectifiedByModel = "User"; // includes both site_engineer and plaza_incharge
      }
      issueExist.remarks = remarks;
      issueExist.rectifiedBy = req.user.user; // Assuming req.user contains authenticated user info
      issueExist.rectifiedTime = new Date();
      issueExist.status = "Resolved"; // Set status to Resolved

      await issueExist.save();

      // Remove issue from manageIssues arrays if needed
      await Admin.updateMany({}, { $pull: { manageIssues: issueExist._id } });


      return res.status(200).json({ message: "Issue resolved successfully", issue: issueExist });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // controllers/userController.js
  createUser: async (req, res) => {
    try {
      const { firstName, lastName, phoneNO, username, password, email, address, assignedBy, assignedPlaza } = req.body;
      console.log(assignedBy);
      console.log(req.user.user);


      const hash = await authEssentials.createHash(password);
      const user = await User.create({
        firstName,
        lastName,
        phoneNO,
        username,
        password: hash,
        email,
        address,
        currentPlaza: assignedPlaza,
        currentRole: "site_engineer", // default role
        roleHistory: [{
          role: "site_engineer",
          assignedEntity: req.body.assignedPlaza, // optional
          assignedEntityType: "Plaza",
          from: new Date()
        }],
        assignedBy: req.user.user,
        assignedByModel: req.user.role
      });
      if (assignedPlaza) {
        await Plaza.findByIdAndUpdate(assignedPlaza, {
          $push: { assignedTo: user._id }
        });
      }

      res.status(201).json({ message: "User created", user });
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  },

  // Controller function to change the role of a user and create a role history entry
  changeRoleAndCreateHistory: async (req, res) => {
    try {
      const { userId, assignedEntityId, newRole, assignedEntityType, changedBy } = req.body;

      // Validate roles and types
      if (!["site_engineer", "project_incharge", "plaza_incharge"].includes(newRole)) {
        return res.status(400).json({ message: "Invalid role specified." });
      }
      if (!["Plaza", "Project"].includes(assignedEntityType)) {
        return res.status(400).json({ message: "Invalid assigned entity type." });
      }

      // Fetch the assigned entity (Plaza or Project)
      const assignedEntity = assignedEntityType === "Plaza"
        ? await Plaza.findById(assignedEntityId)
        : await Project.findById(assignedEntityId);




      if (!assignedEntity) {
        return res.status(404).json({ message: `${assignedEntityType} not found.` });
      }

      // Fetch the user to update
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (assignedEntityType === "Project") {
        await Plaza.findByIdAndUpdate(user.currentPlaza, {
          $pull: { assignedTo: userId }
        })
        user.currentProject = assignedEntityId;
        user.currentPlaza = null;
      }

      // if(assignedEntityType=== "Plaza"){
      //   await Plaza.findByIdAndUpdate(assignedEntityId, {
      //     $push: { assignedTo: userId }
      // });
      // }
      const currentDate = new Date();

      // Close the current role in roleHistory if exists
      const lastHistory = user.roleHistory.find(h => !h.to);
      if (lastHistory) {
        lastHistory.to = currentDate;
      }

      // Add new role history
      user.roleHistory.push({
        role: newRole,
        assignedEntity: assignedEntity._id,
        assignedEntityType,
        from: currentDate,
        to: null
      });
      
      if (assignedEntityType === "Project") {
        await Project.findByIdAndUpdate(assignedEntityId, { assignedTo: user._id }, {new: true})
      
      }
      else {
        await Plaza.findByIdAndUpdate(assignedEntityId, {
          $push: { assignedTo: userId }, 
        })
       
        
        await Project.findByIdAndUpdate(user.currentProject, {assignedTo: null})
        user.currentPlaza = assignedEntityId;
        user.currentProject = null;
      }

      // Update current role
      user.currentRole = newRole;

      await user.save();

      return res.status(200).json({ message: "Role updated and history recorded.", user });

    } catch (error) {
      console.error("Error changing role and creating role history:", error);
      return res.status(500).json({ message: "An error occurred while changing the role." });
    }
  },

  getAllusers: async (req, res) => {

    try {

      const users = await User.find()
      if (!users || users.length === 0) {
        return res.status(400).json({ message: "no users" })
      }

      res.status(200).json({ message: "founded", users })
    } catch (err) {

      console.log(err.message);
      return res.status(500).json({ message: "internal server error" })

    }
  },




  updateIssue: async (req, res) => {
    try {
      const { issueId, updates } = req.body;
  
      if (!issueId) {
        return res.status(400).json({ message: "issueId is required to update the issue." });
      }
  
      const issue = await Issue.findOne({ issueId });
  
      if (!issue) {
        return res.status(404).json({ message: "Issue not found." });
      }
  
      // ✅ Destructure fields from updates
      const { rectifiedTime, remarks, status } = updates;
  
      // Update optional fields if provided
      if (rectifiedTime !== undefined) issue.rectifiedTime = rectifiedTime;
      if (remarks !== undefined) issue.remarks = remarks;
  
      if (status !== undefined) {
        const allowedStatuses = ["Pending", "Resolved"];
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ message: "Invalid status value." });
        }
        issue.status = status;
      }
  
      await issue.save();
  
      return res.status(200).json({ message: "Issue updated successfully", issue });
  
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  




}

export default adminCtrl;
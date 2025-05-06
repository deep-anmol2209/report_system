import { v4 as uuidv4 } from "uuid";
import crypto from "crypto"
import Issue from "../model/issueModel.js";
import Admin from "../model/adminModel.js";
import { User } from "../model/user.js";
import ProjectIncharge from "../model/projectEngineerModel.js";
import SiteEngineer from "../model/siteEngineerModel.js";
import mongoose from "mongoose";



const issueController = {
  addIssue: async (req, res) => {
    try {
      const { description, problemType, issueTime, plazaId } = req.body;
  
      if (!description || !problemType) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const generateId = () => {
        return crypto.randomBytes(5).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
      };
      const uniqueId = generateId();
  
      const user = await User.findById(req.user.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let assignedPlaza = null;
  
      if (user.currentRole === "project_incharge") {
        // Must receive plazaId from frontend
        if (!plazaId) {
          return res.status(400).json({ message: "Plaza must be selected by project incharge" });
        }
        assignedPlaza = plazaId;
      } else if (user.currentRole === "plaza_incharge" || user.currentRole === "site_engineer") {
        // Extract assigned plaza from roleHistory (currently active role)
        const activePlazaRole = user.roleHistory.find(
          role =>
            role.role === user.currentRole &&
            role.assignedEntityType === "Plaza" &&
            !role.to
        );
  
        if (!activePlazaRole || !activePlazaRole.assignedEntity) {
          return res.status(400).json({ message: "No active plaza assigned to this user" });
        }
  
        assignedPlaza = activePlazaRole.assignedEntity;
      } else {
        return res.status(403).json({ message: "Unauthorized role for reporting issues" });
      }
  
      const newIssue = new Issue({
        issueId: uniqueId,
        reportedBy: req.user.user,
        reportedByModel: "User",
        plazaId: assignedPlaza,
        description,
        problemType,
        issueTime,
      });
  
      await newIssue.save();
      await Admin.updateMany({}, { $push: { manageIssues: newIssue._id } });
  
      res.status(201).json({ msg: "Issue Created", issue: newIssue });
    } catch (error) {
      console.error("Error adding issue:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  },
  

  getAllPendingIssues: async (req, res) => {
    try {
      const issues = await Issue.find({status: "Pending"}).populate("reportedBy", "username")
      .populate("plazaId", "plazaName")
      
          console.log(issues);

        if(!issues || issues.length===0){
          return res.status(400).json({msg: "no issues"})
        }
          
      res.status(200).json({ issues });
    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  },

  getAllIssues: async (req, res) => {
    try {
      const issues = await Issue.find()
      .populate("reportedBy", "username")
      .populate("plazaId", "plazaName").populate("rectifiedBy");
  
      if (!issues || issues.length === 0) {
        return res.status(400).json({ msg: "No issues" });
      }
  
      res.status(200).json({ issues });
    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  },
  

  getAllIssuesById: async (req, res) => {
    try {
      const userId = req.user.user; // Get logged-in user ID
      const issues = await Issue.find({ reportedBy: userId })
        .populate("reportedBy", "username")
        .populate("plazaId", "plazaName")
        .populate("rectifiedBy", "firstName");
     console.log(issues);
     
      if (issues.length === 0) {
        return res.status(400).json({ msg: "No issues found for this user" });
      }
  
      res.status(200).json({ issues });
    } catch (error) {
      console.error("Error fetching user issues:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  },

  getIssuesByPlazaId: async(req, res)=>{
    try{

  const userId= req.user.user;

  if(!userId){
    return res.status(400).json({message: "invalid userid"})
  }

  const plazaIncharge= await SiteEngineer.findById(userId);
if(!plazaIncharge){
  return res.status(400).json({message: "no plazaINcharge found with this userID"})
}
    
   const plazaId= plazaIncharge.assignedPlaza

   const issues= await Issue.find({plazaId: plazaId}).populate('plazaId').populate('reportedBy', "username").populate('rectifiedBy', "firstName")
if(!issues){
  return res.status(400).json({message: "No issue in this plaza"})
}

   return res.status(200).json({message: "fonded", issues})
    }catch(err){
      return res.status(500),json("internal server error")
    }

    
  }
};

export default issueController;

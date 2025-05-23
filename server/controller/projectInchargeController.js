import SiteEngineer from "../model/siteEngineerModel.js";
import Plaza from "../model/plazaModel.js";
import Project from "../model/projectModel.js";
import Issue from "../model/issueModel.js";
import mongoose from "mongoose";
import authEssentials from "../controller/index.js";
import { User } from "../model/user.js";

const proejctinchargeController = {


    getPlazasByprojectId: async (req, res) => {
     
         try{
        const { projectId } = req.params;
        if(!projectId || !mongoose.Types.ObjectId.isValid(projectId)){
         return res.status(400).json({message: "project id is not a valid monggose id"})
        }

        const projectPlaza = await Project.findById(projectId).populate('plazas', 'plazaName');

        if (!projectPlaza) {
           return res.status(400).json({message: "no project found"})
        }
           
        res.status(200).json({message: "founded", projectPlaza})
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "internal server error"})
        
    }
    },

    // addSiteEngineer: async (req, res) => {
    //     try {
    //         const { firstName, lastName, address, phoneNO, username, password, email, assignedPlaza, role, assignedBy } = req.body;
    //         if (!firstName || !lastName || !username || !phoneNO || !password || !email || !role) {
    //             return res.status(400).json({ message: "all feilds are required" })
    //         }
    //         console.log("okay");

    //         const usernameExist = await SiteEngineer.findOne({ username });
    //         if (usernameExist) {
    //             return res.status(400).json({ message: "username already exist" })
    //         }
    //         console.log("okay2");

    //         if (assignedPlaza) {
    //             if (!mongoose.Types.ObjectId.isValid(assignedPlaza)) {
    //                 return res.status(403).json({ message: "plazaId is not valid " })
    //             }
    //             console.log("okay3");

    //             const existPlaza = await Plaza.findById(assignedPlaza);
    //             if (!existPlaza) {
    //                 return res.status(400).json({ message: "no Plaza found with this id" })
    //             }
    //             console.log("okay4");

    //         }
    //         const existEmail = await SiteEngineer.findOne({ email });
    //         if (existEmail) {
    //             return res.status(400).json({ message: "email already exist" })
    //         }
    //         // Check if Site Engineer already exists
    //         const existingSiteEngineer = await SiteEngineer.findOne({ username });
    //         if (existingSiteEngineer) {
    //             return res.status(400).json({ message: "Site Engineer already exists" });
    //         }
    //         const hash = await authEssentials.createHash(password);
    //         // Create a new Site Engineer document
    //         const siteEngineer = new SiteEngineer({
    //             firstName,
    //             lastName,
    //             username,
    //             address,
    //             role,
    //             phoneNO,
    //             password: hash, // You might want to hash this password before saving
    //             email,
    //             assignedPlaza,
    //             assignedBy: req.user.user,

    //         });

    //         // Save the new Site Engineer to the database
    //         await siteEngineer.save();

    //         if (assignedPlaza) {
    //             await Plaza.findByIdAndUpdate(assignedPlaza, {
    //                 $push: { assignedTo: siteEngineer._id }
    //             });
    //         }
    //         console.log(siteEngineer)
    //         res.status(201).json(siteEngineer);
    //     } catch (error) {
    //         console.log(error);

    //         res.status(500).json({ message: error.message });
    //     }
    // },


    getEngineersNamesByIds: async (req, res) => {
        try {
            const { engineerIds } = req.body;

            if (!engineerIds || !Array.isArray(engineerIds) || engineerIds.length === 0) {
                return res.status(400).json({ message: "Invalid request. Provide an array of employee IDs." });
            }

            // Fetch only names of employees with the given IDs
            const engineers = await User.find({ _id: { $in: engineerIds } }, 'firstName lastName');

            res.status(200).json({ engineers });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

    //get active site engineers

    getActiveUsers: async (req, res) => {
        try {
            const activeEngineers = await User.find({ isActive: true }) .populate({
                path: "roleHistory.assignedEntity",
                select: "plazaName projectName", // populate either name field depending on the type
              })
              .populate({
                path: "assignedBy",
                select: "firstName lastName username",
              });

            if (!activeEngineers) {
                return res.status(400).json({ message: "not found" })
            }
            return res.status(200).json({ message: "founded", activeEngineers })
        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ message: "internal server error" })
        }
    },


    // Get all Site Engineers
    getAllUsers: async (req, res) => {
        try {
            const siteEngineers = await User.find()
              .populate({
                path: "roleHistory.assignedEntity",
                select: "plazaName projectName", // populate either name field depending on the type
              })
              .populate({
                path: "assignedBy",
                select: "firstName lastName username",
              });
        
            res.status(200).json(siteEngineers);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },

    // Get a single Site Engineer by ID
    getSiteEngineerById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "id is invalid" })
            }
            const siteEngineer = await SiteEngineer.findById(id)
                .populate("assignedPlaza", "plazaName")
                .populate("assignedBy", "firstName lastName username");

            if (!siteEngineer) {
                return res.status(404).json({ message: "Site Engineer not found" });
            }

            res.status(200).json(siteEngineer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },



    // Update Site Engineer details by ID
    updateUser: async (req, res) => {
        try {
            console.log("update user");
            
            const { id } = req.params;
            const { firstName, lastName, email, assignedPlaza } = req.body;

            const updatedSiteEngineer = await User.findByIdAndUpdate(
                id,
                { firstName, lastName, email, assignedPlaza, },
                { new: true } // Returns the updated document
            );

            if (!updatedSiteEngineer) {
                return res.status(404).json({ message: "Site Engineer not found" });
            }

            res.status(200).json(updatedSiteEngineer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete Site Engineer by ID
    deleteUser: async (req, res) => {
        try {
            console.log("hello");

            const { username } = req.params;
            console.log(username);

            if (!username) {
                return res.status(400).json({ message: "Username is required" });
            }
            console.log("check passed");

            const engineer = await User.findOne({ username });
            console.log(engineer);

            if (!engineer) {
                return res.status(404).json({ message: "Site Engineer not found" });
            }

            engineer.isActive = false;
            await engineer.save();

            res.status(200).json({ message: "Site Engineer deactivated successfully", engineer });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },






    //create get update delete plaza

    createPlaza: async (req, res) => {
        const { project, plazaName } = req.body;

        try {
            // Validate required fields
            if (!project || !plazaName) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Validate project ID
            if (!mongoose.Types.ObjectId.isValid(project)) {
                return res.status(400).json({ message: "Invalid ObjectId for project" });
            }

            // Check if project exists
            const existingProject = await Project.findById(project);
            if (!existingProject) {
                return res.status(404).json({ message: "Project not found" });
            }

            // Check if plaza already exists
            const existingPlaza = await Plaza.findOne({ plazaName });
            if (existingPlaza) {
                return res.status(400).json({ message: "Plaza already exists" });
            }

            // Create new plaza
            const plaza = new Plaza({
                project,
                plazaName,
            });

            // Save the new plaza
            await plaza.save();

            // Push the plaza ID to the project's plazas array
            await Project.findByIdAndUpdate(project, {
                $push: { plazas: plaza._id }
            });

            res.status(201).json({ message: "Plaza created successfully", plaza });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all Plazas
    getPlazas: async (req, res) => {
        try {
            const plazas = await Plaza.find()
                .populate("project")
            // Populating project field with projectName


            res.status(200).json(plazas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPlazaById: async (req, res) => {
        const { id } = req.params;
        try {
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "invalid id" })
            }
            const plaza = await Plaza.findById(id)
                .populate("project", "projectName")
                .populate("assignedTo", "firstName lastName");

            if (!plaza) {
                return res.status(404).json({ message: "Plaza not found" });
            }

            res.status(200).json(plaza);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    getPlazaNamesByIds: async (req, res) => {
        try {
            const { plazaIds } = req.body; // Expect an array of plaza IDs from the request body

            if (!Array.isArray(plazaIds) || plazaIds.length === 0) {
                return res.status(400).json({ message: "Invalid plaza IDs provided" });
            }

            const plazas = await Plaza.find({ _id: { $in: plazaIds } }, "plazaName"); // Fetch only plaza names

            return res.status(200).json({ plazas });
        } catch (error) {
            console.error("Error fetching plazas:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },



    // Update Plaza details by ID
    updatePlaza: async (req, res) => {
        try {
            const { id } = req.params;
            const { project, plazaName, assignedTo, status } = req.body;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "invalid or missing id in params" })
            }
            if (!project || !mongoose.Types.ObjectId.isValid(project) || !assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo) || !plazaName) {
                return res.status(400).json({ message: "ivalid data in body" })
            }
            const updatedPlaza = await Plaza.findByIdAndUpdate(
                id,
                { project, plazaName, assignedTo, status },
                { new: true }  // Returns the updated document
            );

            if (!updatedPlaza) {
                return res.status(404).json({ message: "Plaza not found" });
            }

            res.status(200).json(updatedPlaza);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Delete Plaza by ID
    deletePlaza: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || !mongoose.Types.ObjectId.isValid()) {
                return res.status(400).json({ message: "invalid id " })
            }
            const deletedPlaza = await Plaza.findByIdAndUpdate(id, { status: false });

            if (!deletedPlaza) {
                return res.status(404).json({ message: "Plaza not found" });
            }

            res.status(200).json({ message: "Plaza deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    getIssuesByProjectId: async (req, res) => {
        const { projectId } = req.params;
      
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
          return res.status(400).json({ message: "Project ID is not a valid ObjectId" });
        }
      
        try {
          // Fetch project and its plaza IDs
          const project = await Project.findById(projectId).populate("plazas", "_id");
      
          if (!project) {
            return res.status(404).json({ message: "Project not found" });
          }
      
          const plazaIds = project.plazas.map(plaza => plaza._id);
      
          // Find only pending issues from those plazas
          const issues = await Issue.find({
            plazaId: { $in: plazaIds },
            
          }).populate("reportedBy", "username").populate('plazaId').populate("rectifiedBy")
      
          return res.status(200).json({
            message: "Pending issues fetched successfully",
            issues,
          });
        } catch (error) {
          console.error("Error fetching issues:", error);
          return res.status(500).json({ message: "Server error", error });
        }
      }
      

}



export default proejctinchargeController
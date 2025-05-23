import Issue from "../../model/issueModel.js";
import Plaza from "../../model/plazaModel.js";
import {User} from "../../model/user.js"
import Project from "../../model/projectModel.js"


 const countController = {
        count: async (req, res) => {
          try {
            const totalProjects = await Project.countDocuments({isActive: true}); 
            
            const totalPlazas= await Plaza.countDocuments({isActive: true});

            const totalSiteEngineers= await User.countDocuments({isActive: true});

            const totalProjectIncharges= await User.countDocuments({isActive: true, role: "project_incharge"})

            const totalPendingIssues= await Issue.countDocuments({status: "Pending"})

            
            // counts all projects
            res.status(200).json({ success: true , totalProjects: totalProjects,
                totalPendingIssues: totalPendingIssues,
                totalPlazas: totalPlazas,
                totalProjectIncharges: totalProjectIncharges,
                totalSiteEngineers: totalSiteEngineers

             });
          } catch (error) {
            console.error('Error counting :', error);
            res.status(500).json({ error: 'Failed to ' });
          }
        },

       






      };





export default countController
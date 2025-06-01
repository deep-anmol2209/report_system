import Admin from "../model/adminModel.js";
import SiteEngineers from "../model/siteEngineerModel.js";
import SuperAdmin from "../model/superAdminModel.js";
import ProjectIncharge from "../model/projectEngineerModel.js";
import authEssentials from "./index.js";
import { User } from "../model/user.js";

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Credentials required" });
      }

      let user = null;
      let role = null;

      // Check Admin
      const admin = await Admin.findOne({ email });
      if (admin) {
        user = admin;
        role = "Admin";
      }

      // Check SuperAdmin
      if (!user) {
        const superAdmin = await SuperAdmin.findOne({ email });
        if (superAdmin) {
          user = superAdmin;
          role = "SuperAdmin";
        }
      }

      // Check Site Engineer (in User model)
      if (!user) {
        const engineer = await User.findOne({ email });
        if (engineer) {
          user = engineer;
          role = engineer.currentRole;
        }
      }

      // No user found
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await authEssentials.verifyPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Generate access token only
      const token = authEssentials.createToken({ user: user._id, role });

      const responseData = {
        message: "Login success",
        token,
        user: user._id,
        role,
      };

      // Include isEngineerAlso only for project incharge
      if (role === "projectIncharge") {
        responseData.isEngineerAlso = user.isEngineerAlso;
      }

      return res.status(200).json(responseData);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default authController;

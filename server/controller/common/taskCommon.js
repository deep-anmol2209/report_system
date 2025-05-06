// import Task from "../../model/taskModel.js"; // Adjust the import path if needed
// import Employee from "../../model/employeeModel.js"; // Assuming employee model exists

// // Add a new task

// const taskCommonCtrl= {
//  addTask : async (req, res) => {
//     try {
//         console.log(req.user.user);
        
//         const { title, description, dueDate, assignedTo, assignedBy } = req.body;

//         // Create a new task
//         const newTask = new Task({
//             title,
//             description,
//             dueDate,
//             assignedTo,
//             assignedBy: req.user.user
//         });

//         // Save task to database
//         const savedTask = await newTask.save();

//         // Push task ID to Employee's givenTask array
//         await Employee.findByIdAndUpdate(assignedTo, {
//             $push: { givenTask: savedTask._id }
//         });

//         res.status(201).json({ message: "Task created successfully", task: savedTask });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding task", error: error.message });
//     }
// },

// // Get all tasks
//  getTasks : async (req, res) => {
//     try {
//         const tasks = await Task.find().populate("assignedTo", "name email"); // Populate assigned employee details
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching tasks", error: error.message });
//     }
// },

// // Update a task
// updateTask : async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

//         if (!updatedTask) {
//             return res.status(404).json({ message: "Task not found" });
//         }

//         res.status(200).json({ message: "Task updated successfully", task: updatedTask });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating task", error: error.message });
//     }
// },

// // Delete a task
//  deleteTask :  async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find task and get assignedTo ID
//         const task = await Task.findById(id);
//         if (!task) {
//             return res.status(404).json({ message: "Task not found" });
//         }

//         // Remove task ID from Employee's givenTask array
//         await Employee.findByIdAndUpdate(task.assignedTo, {
//             $pull: { givenTask: id }
//         });

//         // Delete the task
//         await Task.findByIdAndDelete(id);

//         res.status(200).json({ message: "Task deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting task", error: error.message });
//     }
// }
// }

// export default taskCommonCtrl
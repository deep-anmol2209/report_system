import attendenceModel from '../model/attendenceMOdel.js';
import { User } from '../model/user.js';
import { startOfDay, endOfDay } from 'date-fns';

// @desc    Mark attendance (for users)
// @route   POST /api/attendance/mark
// @access  Private (User only)
export const markAttendance = async (req, res) => {
  try {
    const userId = req.user.user;
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Check if attendance already marked today
    const existingAttendance = await attendenceModel.findOne({
      user: userId,
      date: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    // Create new attendance record
    const newAttendance = new attendenceModel({
      user: userId,
      date: new Date(),
      status: 'present',
      markedBy: 'user'
    });

    await newAttendance.save();

    res.status(201).json({
      _id: newAttendance._id,
      date: newAttendance.date,
      status: newAttendance.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's attendance
// @route   GET /api/attendance/user/:userId
// @access  Private (Admin or same user)
export const getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // // Authorization check
    // if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }

    const attendance = await attendenceModel.find({ user: userId })
      .sort({ date: -1 })
      .populate('user', 'firstName email');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all attendance (for admin)
// @route   GET /api/attendance/all
// @access  Private (Admin only)
export const getAllAttendance = async (req, res) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }

    const { date, status } = req.query;
    let query = {};

    if (date) {
      const dateStart = startOfDay(new Date(date));
      const dateEnd = endOfDay(new Date(date));
      query.date = { $gte: dateStart, $lte: dateEnd };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await attendenceModel.find(query)
      .sort({ date: -1 })
      .populate('user', 'firstName email');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update attendance status (for admin)
// @route   PUT /api/attendance/:id
// @access  Private (Admin only)
export const updateAttendance = async (req, res) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }

    const { status } = req.body;
    const attendance = await attendenceModel.findById(req.params.id).populate('user' ,'firstName email');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.status = status;
    attendance.markedBy = 'admin';
    attendance.lastUpdated = new Date();

    await attendance.save();

    res.json({
      _id: attendance._id,
      user: attendance.user,
      date: attendance.date,
      status: attendance.status,
      markedBy: attendance.markedBy
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin marks attendance for user
// @route   POST /api/attendance/admin-mark
// @access  Private (Admin only)
export const adminMarkAttendance = async (req, res) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }

    const { userId, date, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    const dateStart = startOfDay(attendanceDate);
    const dateEnd = endOfDay(attendanceDate);

    // Check if attendance already exists for this date
    let attendance = await attendenceModel.findOne({
      user: userId,
      date: {
        $gte: dateStart,
        $lte: dateEnd
      }
    }).populate('user', 'firstName email');

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.markedBy = 'admin';
      attendance.lastUpdated = new Date();
    } else {
      // Create new record
      attendance = new attendenceModel({
        user: userId,
        date: attendanceDate,
        status: status || 'present',
        markedBy: 'admin'
      });
    }

    await attendance.save();

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
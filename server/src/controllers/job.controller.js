import Job from "../models/Job.js";
import User from "../models/User.js";
import { canChooseJob } from "../services/job.service.js";

export const getAvailableJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.level < 25) {
      return res.status(403).json({
        message: "Jobs unlock at level 25",
        canChooseJob: false,
      });
    }

    const jobs = await Job.find({
      active: true,
      unlockLevel: { $lte: user.level },
    }).sort({ name: 1 });

    res.json({
      canChooseJob: canChooseJob(user),
      hasChosenJob: user.hasChosenJob,
      currentJob: user.job,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chooseJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user._id);

    if (user.level < 25) {
      return res.status(403).json({
        message: "You must reach level 25 to choose a job",
      });
    }

    if (user.hasChosenJob || user.job) {
      return res.status(400).json({
        message: "Job already chosen and cannot be changed",
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      active: true,
      unlockLevel: { $lte: user.level },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or not unlocked yet",
      });
    }

    user.job = job._id;
    user.hasChosenJob = true;
    user.jobUnlockedAt = new Date();

    await user.save();

    const updatedUser = await User.findById(user._id).populate("job");

    res.json({
      message: `You have chosen the path of ${job.name}`,
      user: updatedUser,
      job: updatedUser.job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
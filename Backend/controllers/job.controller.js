import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      nationality,
      gender,
      Language,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      showName,
      jobStatus,
    } = req.body;
    const userId = req.id;

    if (
      (!title ||
        !description ||
        !nationality ||
        !gender ||
        !Language ||
        !salary ||
        !location ||
        !jobType ||
        !experience ||
        !position ||
        !companyId,
      !jobStatus)
    ) {
      return res.status(400).json({
        message: "Somethin is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      nationality,
      gender,
      Language,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
      showName: true,
      jobStatus: "Open",
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// job seeker k liye
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// job seeker
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "company",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};
export const getJobByStatus = async (req, res) => {
  try {
    const status = req.params.status; // Access route parameter
    console.log("Requested Status:", status); // This will show the status being queried

    const jobs = await Job.find({ jobStatus: status }).populate({
      path: "company", // Assuming 'company' is a field referencing another model
    });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No Closed Jobs Available",
        success: false,
      });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// Update Job Status
export const updateJobStatus = async (req, res) => {
  const { jobStatus } = req.body;
  const jobId = req.params.id;

  // Check if the status is one of the valid options
  const validStatuses = ["Open", "Close", "Pause"];
  if (!validStatuses.includes(jobStatus)) {
    return res.status(400).json({
      message: "Invalid status. Status must be one of 'Open', 'Close', 'Pause'",
      success: false,
    });
  }

  try {
    const job = await Job.findById(jobId).populate({
      path: "company",
    });
    console.log(job);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Update the status based on the input
    job.jobStatus = jobStatus;
    await job.save();

    return res.status(200).json({
      message: `Job status updated to ${jobStatus} successfully.`,
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Status of this job cannot be updated!",
      error: error,
      success: false,
    });
  }
};

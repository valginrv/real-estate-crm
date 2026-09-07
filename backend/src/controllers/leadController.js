const Lead = require("../models/lead");

// ===============================
// CREATE LEAD
// ===============================

const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      source,
      stage,
      assignedTo,
      notes,
      followUpDate
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required"
      });
    }

    const leadData = {
      name,
      phone,
      email,
      source,
      stage: stage || "New",
      notes,
      followUpDate
    };

    // Admin can assign lead
    if (req.user.role === "admin" && assignedTo) {
      leadData.assignedTo = assignedTo;
    }

    // Sales employee automatically gets the lead
    if (req.user.role === "sales") {
      leadData.assignedTo = req.user.userId;
    }

    const lead = await Lead.create(leadData);

    res.status(201).json({
      message: "Lead created successfully",
      lead
    });

  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ===============================
// GET ALL LEADS
// ===============================

const getLeads = async (req, res) => {
  try {
    const { search, stage } = req.query;

    const filter = {};

    // Sales employee can see only assigned leads
    if (req.user.role === "sales") {
      filter.assignedTo = req.user.userId;
    }

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          phone: {
            $regex: search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Stage filter
    if (stage) {
      filter.stage = stage;
    }

    const leads = await Lead.find(filter)
      .populate(
        "assignedTo",
        "name email"
      )
      .sort({
        createdAt: -1
      });

    res.json({
      count: leads.length,
      leads
    });

  } catch (error) {
    console.error(
      "GET LEADS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ===============================
// GET LEAD BY ID
// ===============================

const getLeadById = async (req, res) => {
  try {

    const lead = await Lead.findById(
      req.params.id
    ).populate(
      "assignedTo",
      "name email"
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    // Sales employee can access
    // only their own leads
    if (
      req.user.role === "sales" &&
      lead.assignedTo?._id.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message:
          "You can access only your assigned leads"
      });
    }

    res.json({
      lead
    });

  } catch (error) {

    console.error(
      "GET LEAD ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ===============================
// UPDATE LEAD
// ===============================

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    // Sales can update only their assigned leads
    if (
      req.user.role === "sales" &&
      lead.assignedTo?.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can update only your assigned leads"
      });
    }

    // ✅ declare updateData FIRST, before using it anywhere
    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      source: req.body.source,
      stage: req.body.stage,
      notes: req.body.notes,
      followUpDate: req.body.followUpDate || null
    };

    // ADMIN — assign or explicitly unassign
    if (req.user.role === "admin") {
      const assignedTo = req.body.assignedTo;

      if (assignedTo && assignedTo !== "undefined" && assignedTo !== "null") {
        updateData.assignedTo = assignedTo;
      } else if (assignedTo === null || assignedTo === "") {
        updateData.assignedTo = null;   // explicit unassign
      }
    }

    // SALES
    if (req.user.role === "sales") {
      updateData.assignedTo = req.user.userId;
    }

    Object.assign(lead, updateData);

    await lead.save();

    res.json({
      message: "Lead updated successfully",
      lead
    });

  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// ===============================
// DELETE LEAD
// ===============================

const deleteLead = async (req, res) => {
  try {

    const lead = await Lead.findById(
      req.params.id
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    // Sales can delete only
    // their assigned leads
    if (
      req.user.role === "sales" &&
      lead.assignedTo?.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message:
          "You can delete only your assigned leads"
      });
    }

    await Lead.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Lead deleted successfully"
    });

  } catch (error) {

    console.error(
      "DELETE LEAD ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
};
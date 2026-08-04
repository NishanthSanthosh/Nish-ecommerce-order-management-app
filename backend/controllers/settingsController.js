const Settings = require("./../models/settingsModel");

const SETTINGS_KEY = "store-settings";

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { singletonKey: SETTINGS_KEY },
      { $setOnInsert: { singletonKey: SETTINGS_KEY } },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      status: "success",
      data: {
        settings,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { singletonKey: SETTINGS_KEY },
      { ...req.body, singletonKey: SETTINGS_KEY },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      status: "success",
      data: {
        settings,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

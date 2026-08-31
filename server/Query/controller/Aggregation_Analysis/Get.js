import { aggregatefn } from "./Aggreatetion.Fn.js";

export const getsearch = async (req, res) => {
  try {
    const users = await aggregatefn();

    res.status(200).json({
      data: users
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error"
    });
  }
};
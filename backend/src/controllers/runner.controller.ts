import { Response } from "express";
import axios from "axios";
import { AuthRequest } from "../middlewares/auth.middleware";

export const runRequest = async (req: AuthRequest, res: Response) => {
  const { method, url, headers, body } = req.body;

  if (!url) {
    return res.status(400).json({ message: "url is required" });
  }

  const startTime = Date.now();

  try {
    const response = await axios({
      method: method || "GET",
      url,
      headers: headers || {},
      data: body || undefined,
      validateStatus: () => true,
    });

    const duration = Date.now() - startTime;

    res.status(200).json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      durationMs: duration,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    res.status(200).json({
      error: true,
      message: error.message,
      durationMs: duration,
    });
  }
};
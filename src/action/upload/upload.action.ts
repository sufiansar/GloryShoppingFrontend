"use server";
import { makeApiCall } from "../apiClient";

export const uploadMultipleImages = async (formData: FormData) => {
  try {
    console.log("📤 Uploading multiple images");
    const result = await makeApiCall<any>("/upload/multiple", {
      method: "POST",
      body: formData,
    });
    console.log("upload result", result);
    return result;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload images");
  }
};

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase/config";

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'blogs', 'jobs')
 * @param {string} fileName - Optional custom file name (defaults to timestamp)
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImageToStorage = async (file, folder, fileName = null) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const name =
      fileName || `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storagePath = `${folder}/${name}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The full download URL of the image
 */
export const deleteImageFromStorage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("firebasestorage.googleapis.com")) {
      return; // Not a Firebase Storage URL
    }

    // Extract the path from the URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)$/);
    if (pathMatch) {
      const path = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw - image might not exist or already deleted
  }
};

/**
 * Extract file name from image URL for replacement
 * @param {string} imageUrl - The image URL
 * @returns {string|null} - The file name or null
 */
export const getFileNameFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)$/);
    if (pathMatch) {
      const path = decodeURIComponent(pathMatch[1]);
      return path.split("/").pop();
    }
  } catch {
    return null;
  }
  return null;
};

"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  ArrowLeft,
  User,
  Camera,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "@/core-components/Button";
import { cn } from "@/utils/cn";

export default function ProfileSettingsPage() {
  const { user, userData, setUserData } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    phone: userData?.phone || userData?.phoneNumber || "",
  });

  const [photoPreview, setPhotoPreview] = useState(userData?.photo || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSuccess(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setPhotoFile(reader.result);
      setIsSuccess(false);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async () => {
    if (!photoFile || !user?.uid) return null;

    const storageRef = ref(storage, `users/${user.uid}/profile-photo`);
    await uploadString(storageRef, photoFile, "data_url");
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      if (!user?.uid) throw new Error("User not authenticated");

      // Upload photo if changed
      let photoURL = userData?.photo;
      if (photoFile) {
        photoURL = await uploadPhoto();
      }

      // Update user document in Firestore
      const userRef = doc(db, "users", user.uid);
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        ...(photoURL && { photo: photoURL }),
        updatedAt: Date.now(),
      };

      await updateDoc(userRef, updateData);

      // Update local context
      setUserData((prev) => ({
        ...prev,
        ...updateData,
      }));

      setIsSuccess(true);
      setPhotoFile(null);

      // Hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    formData.firstName !== (userData?.firstName || "") ||
    formData.lastName !== (userData?.lastName || "") ||
    formData.phone !== (userData?.phone || userData?.phoneNumber || "") ||
    photoFile !== null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/settings"
            className="p-2 rounded-xl bg-white border border-gray-200 text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-heading">
              Profile Settings
            </h1>
            <p className="text-sm text-text-light">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <CheckCircle2 className="text-green-500" size={20} />
              <p className="text-sm font-medium text-green-700">
                Profile updated successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-heading mb-4">
              Profile Photo
            </label>
            <div className="flex items-center gap-6">
              <div
                onClick={handlePhotoClick}
                className="relative w-24 h-24 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 hover:border-primary transition-colors"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <User size={32} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-text-light mb-2">
                  Click to upload a new photo
                </p>
                <p className="text-xs text-text-light/70">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-semibold text-heading">
              Personal Information
            </h2>

            {/* Name Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-text-light cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-text-light mt-2">
                Email cannot be changed. Contact support if you need to update
                it.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/settings" className="flex-1 max-w-[200px] w-full">
              <Button variant="outline" fullWidth type="button">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={isLoading || !hasChanges}
              className={`${cn(!hasChanges && "opacity-50 cursor-not-allowed")} max-w-[200px] w-full`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

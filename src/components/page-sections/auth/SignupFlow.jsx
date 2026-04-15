"use client";

import React, { useState } from "react";
import AuthStepWrapper from "@/components/page-sections/auth/AuthStepWrapper";
import InputField from "@/core-components/InputField";
import Button from "@/core-components/Button";
import { Camera, Phone, User, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignupFlow = () => {
  const router = useRouter();
  const { signup, user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only redirect if they are on step 1 and already logged in
    if (!authLoading && user && step === 1) {
      router.push("/");
    }
  }, [user, authLoading, step, router]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    profileImage: null,
    profileImageFile: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(formData.email, formData.password);
      setStep(2); // Go straight to Profile Setup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");
    try {
      let photoURL = "";

      // Upload image to Firebase Storage if exists
      if (formData.profileImageFile) {
        const storageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, formData.profileImageFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firestore via API Route (demonstrating speed optimization/abstraction)
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          photo: photoURL,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile via API");

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(file),
        profileImageFile: file,
      });
    }
  };

  // Step 1: Basic Info
  if (step === 1) {
    return (
      <AuthStepWrapper
        illustration="/images/auth/signup-bg.png"
        title="Create Account"
        description="Share your moving burden with Bulky. Let's get you set up!"
        onBack={null}
      >
        <form
          onSubmit={handleStep1Submit}
          className="space-y-6 mt-10 text-left"
        >
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              placeholder="John"
              variant="underline"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <InputField
              label="Last Name"
              placeholder="Doe"
              variant="underline"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            variant="underline"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            variant="underline"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            rightIcon={showPassword ? Eye : EyeOff}
            onRightIconClick={() => setShowPassword(!showPassword)}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-full py-3"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Continue"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-text-light text-sm">
              Already have an account?{" "}
              <Link
                href="/auth"
                className="text-primary font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </AuthStepWrapper>
    );
  }

  // Step 2: Profile Setup
  if (step === 2) {
    return (
      <AuthStepWrapper
        illustration="/images/auth/signup-bg.png"
        title="Complete Profile"
        description="Just a few more details to get your bulky service started."
        onBack={handleBack}
        showLogo={false}
      >
        <div className="flex flex-col items-center mt-6 space-y-8">
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-gray-50 flex items-center justify-center overflow-hidden relative">
              {formData.profileImage ? (
                <Image
                  src={formData.profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={48} className="text-gray-300" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          </div>

          <form
            onSubmit={handleStep2Submit}
            className="w-full space-y-8 text-left"
          >
            <div className="grid grid-cols-2 gap-4 text-left">
              <InputField
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                variant="underline"
                required
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                variant="underline"
                required
              />
            </div>
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              variant="underline"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              icon={Phone}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-full py-3"
              disabled={loading}
            >
              {loading ? "Saving Profile..." : "Complete Setup"}
            </Button>
          </form>
        </div>
      </AuthStepWrapper>
    );
  }

  return null;
};

export default SignupFlow;

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Loader2,
  CheckCircle,
  Building2,
  Calendar,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPinned,
  GraduationCap,
  Award,
  Car,
} from "lucide-react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { uploadImageToStorage } from "@/utils/imageUpload";

const fieldConfig = {
  fullName: { label: "Full Name", icon: User, type: "text", required: true },
  email: { label: "Email Address", icon: Mail, type: "email", required: true },
  phone: { label: "Phone Number", icon: Phone, type: "tel", required: false },
  address: {
    label: "Address",
    icon: MapPinned,
    type: "textarea",
    required: false,
  },
  cv: { label: "CV / Resume", icon: FileText, type: "file", required: false },
  coverLetter: {
    label: "Cover Letter",
    icon: FileText,
    type: "textarea",
    required: false,
  },
  driverLicense: {
    label: "Driver's License Number",
    icon: Car,
    type: "text",
    required: false,
  },
  drivingExperience: {
    label: "Years of Driving Experience",
    icon: Award,
    type: "number",
    required: false,
  },
  education: {
    label: "Highest Education Level",
    icon: GraduationCap,
    type: "text",
    required: false,
  },
  workExperience: {
    label: "Previous Work Experience",
    icon: Briefcase,
    type: "textarea",
    required: false,
  },
  availableStartDate: {
    label: "Available Start Date",
    icon: Calendar,
    type: "date",
    required: false,
  },
  references: {
    label: "Professional References",
    icon: User,
    type: "textarea",
    required: false,
  },
  certifications: {
    label: "Relevant Certifications",
    icon: Award,
    type: "textarea",
    required: false,
  },
  backgroundCheck: {
    label: "Background Check Consent",
    icon: CheckCircle,
    type: "checkbox",
    required: false,
  },
};

export default function JobApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const docRef = doc(db, "jobs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const jobData = docSnap.data();
        setJob({ id: docSnap.id, ...jobData });

        // Initialize form data with required fields
        const initialData = {};
        jobData.requiredFields?.forEach((field) => {
          initialData[field] = "";
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (fieldId, file) => {
    setFiles((prev) => ({ ...prev, [fieldId]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload files to Firebase Storage
      const fileUrls = {};

      for (const [fieldId, file] of Object.entries(files)) {
        if (file) {
          const url = await uploadImageToStorage(
            file,
            "jobApplications",
            `${id}_${fieldId}_${Date.now()}_${file.name}`,
          );
          fileUrls[`${fieldId}Url`] = url;
          fileUrls[`${fieldId}Name`] = file.name;
        }
      }

      await addDoc(collection(db, "jobApplications"), {
        jobId: id,
        jobTitle: job.title,
        ...formData,
        ...fileUrls,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-text-light">Loading...</p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-white pt-28">
        <div className="container-custom text-center py-20">
          <h1 className="text-3xl font-bold text-heading mb-4">
            Job Not Found
          </h1>
          <p className="text-text-light mb-6">
            The position you are looking for does not exist.
          </p>
          <Link href="/careers" className="text-primary hover:underline">
            Back to Careers
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-white pt-28">
        <div className="container-custom max-w-2xl mx-auto py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-heading mb-4">
            Application Submitted!
          </h1>
          <p className="text-text-light mb-8">
            Thank you for applying for the {job.title} position. We have
            received your application and will review it shortly. You will hear
            back from us within 5-7 business days.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Careers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#fafaff] via-white to-blue-50/50">
        <div className="container-custom">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-text-light hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Careers
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Briefcase size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-heading">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Briefcase size={14} />
                  {job.type || "Full-time"}
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={14} />
                  {job.location || "Remote"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-600">
                  <Building2 size={12} />
                  Internal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold text-heading mb-2">
              Apply for this Position
            </h2>
            <p className="text-text-light mb-8">
              Please fill out the form below. Fields marked with{" "}
              <span className="text-red-500">*</span> are required.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {job.requiredFields?.map((fieldId) => {
                const config = fieldConfig[fieldId];
                if (!config) return null;

                const Icon = config.icon;
                const value = formData[fieldId] || "";

                return (
                  <div key={fieldId}>
                    <label className="block text-sm font-medium text-heading mb-2">
                      <span className="flex items-center gap-2">
                        <Icon size={16} className="text-primary" />
                        {config.label}
                        {config.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </span>
                    </label>

                    {config.type === "textarea" ? (
                      <textarea
                        value={value}
                        onChange={(e) =>
                          handleInputChange(fieldId, e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        required={config.required}
                      />
                    ) : config.type === "file" ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(fieldId, e.target.files?.[0])
                          }
                          className="hidden"
                          id={`file-${fieldId}`}
                          accept=".pdf,.doc,.docx"
                        />
                        <label
                          htmlFor={`file-${fieldId}`}
                          className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                          <Upload size={24} className="text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {files[fieldId]?.name ||
                              "Click to upload PDF or Word document"}
                          </span>
                        </label>
                      </div>
                    ) : config.type === "checkbox" ? (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value === true || value === "true"}
                          onChange={(e) =>
                            handleInputChange(fieldId, e.target.checked)
                          }
                          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-text-light">
                          I consent to a background check as part of the
                          application process
                        </span>
                      </label>
                    ) : (
                      <input
                        type={config.type}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(fieldId, e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        required={config.required}
                      />
                    )}
                  </div>
                );
              })}

              <div className="pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Tag, Loader2 } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const q = query(collection(db, "blogs"), where("slug", "==", slug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const blogData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        };
        setBlog(blogData);
        fetchRelatedBlogs(blogData.category, blogData.id);
      } else {
        const docRef = doc(db, "blogs", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const blogData = { id: docSnap.id, ...docSnap.data() };
          setBlog(blogData);
          fetchRelatedBlogs(blogData.category, blogData.id);
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, currentId) => {
    try {
      const q = query(
        collection(db, "blogs"),
        where("category", "==", category),
      );
      const snapshot = await getDocs(q);
      const blogs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((b) => b.id !== currentId)
        .slice(0, 3);
      setRelatedBlogs(blogs);
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          paddingTop: "7rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Loader2
            size={40}
            style={{ animation: "spin 1s linear infinite", color: "#2563eb" }}
          />
          <p style={{ color: "#6b7280" }}>Loading article...</p>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main
        style={{
          minHeight: "100vh",

          paddingTop: "7rem",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            padding: "0 1rem",
            textAlign: "center",
            paddingTop: "5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "1rem",
            }}
          >
            Blog Not Found
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            The article you are looking for does not exist.
          </p>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#2563eb",
              fontWeight: "700",
            }}
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-custom" style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          paddingTop: "7rem",
          paddingBottom: "3rem",
        }}
      >
        <div style={{ margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ margin: "0 auto" }}>
            <div className="flex items-center gap-3 w-full justify-between">
              {/* Back Link */}
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#4b5563",
                  marginBottom: "1.5rem",
                }}
              >
                <ArrowLeft size={18} />
                Back to Blog
              </Link>

              {/* Category */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "1.5rem",
                }}
              >
                <Tag size={14} />
                {blog.category}
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "1.5rem",
                color: "#000000",
              }}
            >
              {blog.title}
            </h1>

            {/* Meta */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "1.5rem",
                fontSize: "0.875rem",
                color: "#374151",
                marginBottom: "2rem",
              }}
            >
              {blog.author && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "9999px",
                      backgroundColor: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={14} style={{ color: "#2563eb" }} />
                  </div>
                  {blog.author}
                </span>
              )}
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Calendar size={16} />
                {formatDate(blog.createdAt)}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Clock size={16} />
                {blog.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.imageUrl && (
        <section style={{ paddingBottom: "2rem" }}>
          <div style={{ margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ margin: "0 auto" }}>
              <div
                style={{
                  position: "relative",
                  height: "16rem",
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div style={{ margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ margin: "0 auto" }}>
            {/* Excerpt */}
            <div
              style={{
                background:
                  "linear-gradient(to right, rgba(37,99,235,0.05), rgba(239,246,255,1))",
                borderLeft: "4px solid #2563eb",
                padding: "1.5rem",
                borderRadius: "0 0.75rem 0.75rem 0",
                marginBottom: "2.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#1f2937",
                  fontWeight: "500",
                  lineHeight: "1.625",
                }}
              >
                {blog.excerpt}
              </p>
            </div>

            {/* Main Content - Rendered HTML */}
            <article
              style={{
                fontSize: "1.125rem",
                lineHeight: "1.75",
                color: "#374151",
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            background: "linear-gradient(to bottom, #fafaff, #ffffff)",
          }}
        >
          <div style={{ margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "2rem",
                }}
              >
                Related <span style={{ color: "#2563eb" }}>Articles</span>
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {relatedBlogs.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug || post.id}`}
                    style={{
                      display: "block",
                      backgroundColor: "#ffffff",
                      border: "1px solid #f3f4f6",
                      borderRadius: "1rem",
                      padding: "1.5rem",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#f3f4f6",
                        color: "#4b5563",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {post.category}
                    </span>
                    <h3
                      style={{
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "0.5rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

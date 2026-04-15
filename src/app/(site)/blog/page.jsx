"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  User,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  useScrollAnimation,
  useScrollAnimationGroup,
} from "@/hooks/useScrollAnimation";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { containerRef: postsRef, visibleItems: postsVisible } =
    useScrollAnimationGroup(blogs.length > 0 ? blogs.length - 1 : 0);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc"),
        limit(20),
      );
      const snapshot = await getDocs(q);
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, "blogCategories"), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      const cats = snapshot.docs.map((doc) => doc.data().name);
      setCategories(["All", ...cats]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  const featuredPost = filteredBlogs[0];
  const otherPosts = filteredBlogs.slice(1);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBlogImage = (index) => {
    const images = [
      "/why-us/easy-booking.svg",
      "/why-us/bulky-deliveries.svg",
      "/why-us/fastest-delivery.svg",
      "/section-four/truck.png",
    ];
    return images[index % images.length];
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative  pt-28 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-[#fafaff] via-white to-blue-50/50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div ref={heroRef} className="max-w-3xl mx-auto text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 text-primary rounded-full text-sm font-semibold mb-6 shadow-sm transition-all duration-700 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <BookOpen size={14} className="fill-primary" />
              Bulky Blog
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-heading transition-all duration-700 delay-100 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              Tips & Insights for{" "}
              <span className="text-primary">Better Moves</span>
            </h1>

            <p
              className={`text-lg text-text-light max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              Expert advice, guides, and insights to make your moving and
              delivery experience seamless.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-gray-100 bg-white sticky top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="section-padding">
          <div className="container-custom text-center">
            <Loader2
              size={40}
              className="animate-spin text-primary mx-auto mb-4"
            />
            <p className="text-text-light">Loading articles...</p>
          </div>
        </section>
      ) : filteredBlogs.length === 0 ? (
        <section className="section-padding">
          <div className="container-custom text-center">
            <p className="text-text-light">No articles found.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="section-padding bg-gradient-to-b from-white to-[#fafaff] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

              <div className="container-custom relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="grid md:grid-cols-2">
                    <div className="relative  max-h-[300px] md:h-auto min-h-[400px] bg-gradient-to-br from-gray-50 to-white">
                      {featuredPost.imageUrl ? (
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={getBlogImage(0)}
                          alt={featuredPost.title}
                          fill
                          className="object-contain p-8"
                        />
                      )}
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 w-fit">
                        {featuredPost.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-text-light mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                        {featuredPost.author && (
                          <span className="flex items-center gap-1.5">
                            <User size={14} />
                            {featuredPost.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {formatDate(featuredPost.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${featuredPost.slug || featuredPost.id}`}
                        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                      >
                        Read Article
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Blog Posts Grid */}
          {otherPosts.length > 0 && (
            <section className="section-padding bg-gradient-to-b from-[#fafaff] to-white">
              <div className="container-custom">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
                    <Sparkles size={16} />
                    Latest Articles
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-heading">
                    More From Our <span className="text-primary">Blog</span>
                  </h2>
                </div>

                <div
                  ref={postsRef}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {otherPosts.map((post, index) => (
                    <article
                      key={post.id}
                      className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-500 ${
                        postsVisible.includes(index)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-white">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={getBlogImage(index + 1)}
                            alt={post.title}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                          {post.category}
                        </span>
                        <h3 className="text-lg font-bold text-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-text-light text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug || post.id}`}
                          className="mt-4 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                        >
                          Read More
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white/80 mb-8">
                Subscribe to our newsletter for the latest moving tips,
                exclusive offers, and company news.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

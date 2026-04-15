"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  orderBy,
  limit,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Send,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  ArrowLeft,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  User,
  Loader2,
  X,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import { uniqueID, formatChatUserData, formatMessage } from "@/utils/chat";
import EmojiPicker from "emoji-picker-react";

export default function ChatPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlChatId = searchParams.get("id");
  const initialWithId = searchParams.get("with"); // Backward compatibility/Deep link

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null); // This will be the chat document
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: "", // 'block' or 'delete'
    title: "",
    message: "",
    onConfirm: null,
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const dropdownRef = useRef(null);

  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Handle clicks outside emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  // Handle clicks outside dropdown emoji menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  // 1. Listen to all conversations for the current user
  useEffect(() => {
    if (!user?.uid) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("keys", "array-contains", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by updatedAt descending
      const sortedConvos = convos.sort(
        (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
      );
      setConversations(sortedConvos);
      setLoadingConversations(false);

      // Handle initial selection from URL
      if (!selectedChat) {
        if (urlChatId) {
          const found = sortedConvos.find((c) => c.id === urlChatId);
          if (found) setSelectedChat(found);
        } else if (initialWithId) {
          const found = sortedConvos.find(
            (c) => c.keys && c.keys.includes(initialWithId),
          );
          if (found) setSelectedChat(found);
        }
      }
    });

    return () => unsub();
  }, [user?.uid, urlChatId]);

  // 2. Listen to messages for the selected chat
  useEffect(() => {
    if (!selectedChat?.id) {
      setMessages([]);
      return;
    }

    const unsub = onSnapshot(doc(db, "chats", selectedChat.id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages || []);
      }
    });

    return () => unsub();
  }, [selectedChat?.id]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedChat || !user?.uid)
      return;

    let imageUrl = "";
    const textToSend = newMessage;

    // Reset inputs immediately for responsive feel
    setNewMessage("");
    setUploadPreview(null);
    const fileToUpload = selectedFile;
    setSelectedFile(null);

    try {
      setIsUploading(true);

      // Handle file upload if present
      if (fileToUpload) {
        const fileRef = ref(
          storage,
          `chats/${selectedChat.id}/${Date.now()}_${fileToUpload.name}`,
        );
        const uploadResult = await uploadBytes(fileRef, fileToUpload);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const senderData = {
        uid: user.uid,
        name: `${userData?.firstName || "User"} ${userData?.lastName || ""}`.trim(),
        avatar: userData?.photo || "",
      };

      const messageObj = formatMessage({
        text: textToSend,
        image: imageUrl,
        user: senderData,
        receiverId: getOtherUserId(selectedChat),
      });

      const chatRef = doc(db, "chats", selectedChat.id);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const currentMessages = chatDoc.data().messages || [];
        await updateDoc(chatRef, {
          messages: [...currentMessages, messageObj],
          updatedAt: Date.now(),
          lastMessage: {
            text: imageUrl ? "📷 Photo" : textToSend,
            sender: user.uid,
            createdAt: Date.now(),
            image: imageUrl || "",
          },
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const getOtherUser = (chat) => {
    if (!chat || !chat.users) return {};
    return chat.users.find((u) => u._id !== user.uid) || {};
  };

  const getOtherUserId = (chat) => {
    if (!chat || !chat.keys) return "";
    return chat.keys.find((k) => k !== user.uid) || "";
  };

  const handleCall = () => {
    const otherUser = getOtherUser(selectedChat);
    const phone = otherUser.phone;
    if (phone && typeof window !== "undefined") {
      window.location.href = `tel:${phone}`;
    } else {
      alert("Phone number not available for this user");
    }
  };

  const handleBlockChat = async () => {
    if (!selectedChat) return;

    const isBlocked = selectedChat.blockedBy?.includes(user.uid);

    setConfirmModal({
      show: true,
      type: "block",
      title: isBlocked ? "Unblock User?" : "Block User?",
      message: isBlocked
        ? "You will be able to send and receive messages from this user again."
        : "Are you sure you want to block this user? You will not be able to send or receive messages in this chat.",
      onConfirm: async () => {
        try {
          const chatRef = doc(db, "chats", selectedChat.id);
          const newBlockedBy = isBlocked
            ? selectedChat.blockedBy.filter((id) => id !== user.uid)
            : [...(selectedChat.blockedBy || []), user.uid];

          await updateDoc(chatRef, {
            blockedBy: newBlockedBy,
          });
          setShowDropdown(false);
          setConfirmModal((prev) => ({ ...prev, show: false }));
        } catch (error) {
          console.error("Error blocking chat:", error);
        }
      },
    });
  };

  const handleDeleteChat = async () => {
    if (!selectedChat) return;

    setConfirmModal({
      show: true,
      type: "delete",
      title: "Delete Conversation?",
      message:
        "This will permanently remove the conversation and all its messages. This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "chats", selectedChat.id));
          setSelectedChat(null);
          setShowDropdown(false);
          setConfirmModal((prev) => ({ ...prev, show: false }));
        } catch (error) {
          console.error("Error deleting chat:", error);
        }
      },
    });
  };

  const filteredConversations = conversations.filter((c) => {
    const otherUser = getOtherUser(c);
    const fullName = `${otherUser.userName || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex  pt-[100px] flex-col h-[calc(100vh-112px)] min-h-[700px] overflow-hidden bg-gray-50/50 font-poppins">
      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full p-4 lg:p-6 gap-6">
        {/* Sidebar */}
        <div
          className={cn(
            "w-full lg:w-[400px] flex flex-col bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl overflow-hidden transition-all duration-500",
            selectedChat && "hidden lg:flex",
          )}
        >
          <div className="p-8 border-b border-gray-100/50">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                Messages
              </h1>
            </div>
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-4 bg-gray-100/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all font-medium placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loadingConversations ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-3 w-40 bg-gray-50 rounded" />
                  </div>
                </div>
              ))
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((chat) => {
                const otherUser = getOtherUser(chat);
                const isActive = selectedChat?.id === chat.id;

                return (
                  <motion.button
                    key={chat.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedChat(chat)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-xl transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-[dodgerblue] to-[#7a7afa] text-white shadow-xl shadow-primary/20"
                        : "hover:bg-white hover:shadow-lg hover:shadow-gray-200/50",
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      {otherUser.avatar ? (
                        <div className="relative">
                          <img
                            src={otherUser.avatar}
                            alt=""
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/50"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 border-white/50",
                            isActive
                              ? "bg-white/20"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          {otherUser.userName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-black truncate tracking-tight text-base">
                          {otherUser.userName}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            isActive ? "text-white/60" : "text-gray-400",
                          )}
                        >
                          {chat.updatedAt
                            ? format(chat.updatedAt, "h:mm a")
                            : ""}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs truncate font-medium tracking-tight",
                          isActive ? "text-white/80" : "text-gray-500",
                        )}
                      >
                        {chat.lastMessage?.text || "Started a conversation..."}
                      </p>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-chat-indicator"
                        className="absolute left-0 top-0 w-1.5 h-full bg-white rounded-full -ml-0.5"
                      />
                    )}
                  </motion.button>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <User size={32} />
                </div>
                <p className="text-sm font-bold text-gray-900">
                  No conversations yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Start a conversation from your booking details page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={cn(
            "flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl flex flex-col relative overflow-hidden transition-all duration-500",
            !selectedChat && "hidden lg:flex",
          )}
        >
          {selectedChat ? (
            <>
              {/* Header */}
              {(() => {
                const otherUser = getOtherUser(selectedChat);
                return (
                  <div className="p-4 lg:p-6  border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="p-2 -ml-2 hover:bg-gray-50 rounded-xl text-gray-400 lg:hidden"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="relative">
                        {otherUser.avatar ? (
                          <img
                            src={otherUser.avatar}
                            alt=""
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                            {otherUser.userName?.[0]}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 leading-none mb-1 tracking-tight">
                          {otherUser.userName}
                        </h3>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                          Active Now
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCall}
                        className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors"
                      >
                        <Phone size={18} />
                      </button>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setShowDropdown(!showDropdown)}
                          className={cn(
                            "p-3 rounded-2xl transition-all",
                            showDropdown
                              ? "bg-gray-100 text-gray-900"
                              : "hover:bg-gray-50 text-gray-400",
                          )}
                        >
                          <MoreVertical size={18} />
                        </button>
                        <AnimatePresence>
                          {showDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                            >
                              <button
                                onClick={handleBlockChat}
                                className="w-full text-start flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <ShieldAlert
                                  size={16}
                                  className="text-amber-500"
                                />
                                {selectedChat.blockedBy?.includes(user.uid)
                                  ? "Unblock User"
                                  : "Block User"}
                              </button>
                              <button
                                onClick={handleDeleteChat}
                                className="w-full flex text-start items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Messages Area */}
              <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden  p-6 lg:p-10 space-y-8 bg-gradient-to-b from-gray-50/50 to-white/50 relative custom-scrollbar"
              >
                {/* Subtle background decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
                {messages.length > 0 ? (
                  messages.map((msg, i) => {
                    const isMe = msg.user?._id === user.uid;
                    const isFirstInGroup =
                      i === 0 || messages[i - 1].user?._id !== msg.user?._id;

                    return (
                      <motion.div
                        key={msg._id || i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        className={cn(
                          "flex w-full mb-1",
                          isMe ? "justify-end" : "justify-start",
                          isFirstInGroup ? "mt-6" : "mt-1",
                        )}
                      >
                        <div
                          className={cn(
                            "flex flex-col group",
                            isMe ? "items-end" : "items-start",
                          )}
                        >
                          {!isMe && isFirstInGroup && (
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">
                              {msg.user?.name || "Helper"}
                            </span>
                          )}

                          <div
                            className={cn(
                              "max-w-[400px] rounded-[2rem] shadow-xl relative overflow-hidden transition-all hover:shadow-2xl",
                              isMe
                                ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-none"
                                : "bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-100 rounded-tl-none",
                            )}
                          >
                            {msg.image && (
                              <div className="p-1.5">
                                <img
                                  src={msg.image}
                                  alt="attachment"
                                  className="rounded-[1.5rem] max-h-[400px] w-full object-cover cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                                  onClick={() => {
                                    if (typeof window !== "undefined") {
                                      window.open(msg.image);
                                    }
                                  }}
                                />
                              </div>
                            )}
                            <div className="px-6 py-4">
                              {msg.text && (
                                <p className="text-[15px] font-medium leading-relaxed tracking-tight">
                                  {msg.text}
                                </p>
                              )}
                              <div
                                className={cn(
                                  "flex items-center gap-2 mt-2",
                                  isMe ? "justify-end" : "justify-start",
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-[10px] font-bold uppercase tracking-tight opacity-60",
                                    isMe ? "text-white/80" : "text-gray-400",
                                  )}
                                >
                                  {msg.createdAt
                                    ? format(msg.createdAt, "h:mm a")
                                    : ""}
                                </span>
                                {isMe && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center"
                                  >
                                    {msg.isSeen ? (
                                      <CheckCheck
                                        size={12}
                                        className="text-white/80"
                                      />
                                    ) : (
                                      <Check
                                        size={12}
                                        className="text-white/80"
                                      />
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 lg:p-24 relative z-10">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 rotate-12 hover:rotate-0 transition-transform duration-500 border border-gray-50">
                      <ImageIcon size={48} className="text-primary/20" />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter italic">
                      No Messages Yet
                    </h4>
                    <p className="max-w-xs text-sm font-medium text-gray-500 leading-relaxed">
                      Every great collaboration starts with a single message.
                      Reach out and start the conversation today.
                    </p>
                  </div>
                )}
                {/* Removed floating ref div to use container scroll */}
              </div>

              {/* Input Area */}
              <div className="p-8 bg-white border-t border-gray-50/50 relative">
                {uploadPreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute bottom-full left-8 mb-4 group"
                  >
                    <div className="relative inline-block overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
                      <img
                        src={uploadPreview}
                        alt="preview"
                        className="h-32 w-32 object-cover transition-transform group-hover:scale-110 duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={() => {
                          setUploadPreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-red-500 rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all border border-red-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-4 bg-gray-100/50 backdrop-blur-sm rounded-[2rem] p-2 border border-transparent focus-within:border-primary/10 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-primary/5 transition-all relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>

                  <input
                    type="text"
                    placeholder={
                      selectedChat.blockedBy?.length > 0
                        ? "Conversation blocked"
                        : "Type your message..."
                    }
                    className="flex-1 focus:outline-none bg-transparent border-none focus:ring-0 text-sm font-medium py-3 disabled:cursor-not-allowed"
                    value={newMessage}
                    disabled={selectedChat.blockedBy?.length > 0}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />

                  <div className="flex items-center gap-1">
                    <div className="relative" ref={emojiPickerRef}>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={cn(
                          "p-3 transition-colors",
                          showEmojiPicker
                            ? "text-primary"
                            : "text-gray-400 hover:text-primary",
                        )}
                      >
                        <Smile size={20} />
                      </button>
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-100"
                          >
                            <EmojiPicker
                              onEmojiClick={onEmojiClick}
                              width={320}
                              height={400}
                              previewConfig={{ showPreview: false }}
                              skinTonesDisabled
                              searchDisabled
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        (!newMessage.trim() && !selectedFile) ||
                        isUploading ||
                        selectedChat.blockedBy?.length > 0
                      }
                      className={cn(
                        "p-3 rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[44px]",
                        (newMessage.trim() || selectedFile) &&
                          !isUploading &&
                          !(selectedChat.blockedBy?.length > 0)
                          ? "bg-primary text-white shadow-primary/20 scale-100"
                          : "bg-gray-200 text-gray-400 scale-95 opacity-50",
                      )}
                    >
                      {isUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-primary/10 rounded-full animate-pulse blur-2xl absolute inset-0" />
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10 border border-gray-50">
                  <Send className="text-primary" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                Your Direct InBox
              </h2>
              <p className="max-w-xs text-sm font-medium text-gray-500 leading-relaxed mb-8">
                Select a chat from the list to continue or start a new chat.
              </p>
              <div className="px-6 py-3 bg-primary/10 rounded-full border border-primary/10">
                <span className="text-xs font-black text-primary uppercase tracking-widest">
                  Stay Connected with Drivers and Helpers
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setConfirmModal((prev) => ({ ...prev, show: false }))
              }
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 lg:p-10 text-center">
                <div
                  className={cn(
                    "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6",
                    confirmModal.type === "delete"
                      ? " text-red-500"
                      : " text-amber-500",
                  )}
                >
                  {confirmModal.type === "delete" ? (
                    <Trash2 size={40} />
                  ) : (
                    <ShieldAlert size={40} />
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  {confirmModal.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
                  {confirmModal.message}
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={confirmModal.onConfirm}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all",
                      confirmModal.type === "delete"
                        ? "bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95"
                        : "bg-amber-600 text-white shadow-lg shadow-amber-200 hover:bg-amber-700 active:scale-95",
                    )}
                  >
                    Confirm {confirmModal.type}
                  </button>
                  <button
                    onClick={() =>
                      setConfirmModal((prev) => ({ ...prev, show: false }))
                    }
                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

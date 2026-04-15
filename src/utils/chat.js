/**
 * Generates a unique ID matching the mobile app logic.
 */
export function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  return (
    chr4() +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    chr4() +
    chr4()
  );
}

/**
 * Standardizes the user data object for chat documents to match mobile parity.
 */
export function formatChatUserData(userData, uid) {
  return {
    _id: uid,
    userName: `${userData?.firstName || "User"} ${userData?.lastName || ""}`.trim(),
    avatar: userData?.photo || "",
    phone: userData?.phoneNumber || userData?.phone || "",
  };
}

/**
 * Standardizes the message object to match mobile parity.
 */
export function formatMessage({ text = "", image = "", user, receiverId }) {
  return {
    _id: Date.now(),
    text,
    image,
    createdAt: Date.now(), // Mobile uses Date.parse(new Date()), which is equivalent to Date.now()
    user: {
      _id: user.uid,
      name: user.name,
      avatar: user.avatar,
    },
    recieverId: receiverId, // Note: Mobile uses "recieverId" (typo in original code usually, but keeping parity)
    isSeen: false
  };
}

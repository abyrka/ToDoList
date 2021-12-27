const userListKey = "user_list";
const getUserToDoItemsKey = (userId) => `user_${userId}_todo_items`;
const getItemAttachmentsKey = (itemId) => `itemId_${itemId}_attachments`;

module.exports = {
  userListKey,
  getUserToDoItemsKey,
  getItemAttachmentsKey,
};

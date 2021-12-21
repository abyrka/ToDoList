const userListKey = "user_list";
const getUserToDoItemsKey = (userId) => `user_${userId}_todo_items`;
const getItemFilesKey = (itemId) => `itemId_${itemId}_files`;

module.exports = {
  userListKey,
  getUserToDoItemsKey,
  getItemFilesKey,
};

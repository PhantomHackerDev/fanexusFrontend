export const isIndexExists = i => i !== -1;
export const getLastIndex = arr => arr.length - 1;
export const isLastIndex = (i, arr) => !!(i === getLastIndex(arr));
export const getIndexById = (id, arr) =>
  arr.findIndex(item => +item.id === +id);
export const getById = (id, arr) => arr.find(item => +item.id === +id);
export const deleteItemById = (id, arr, callback) => {
  const indexToDelete = getIndexById(id, arr);

  if (isIndexExists(indexToDelete)) {
    if (callback && typeof callback === 'function') callback(indexToDelete);
    arr.splice(indexToDelete, 1);
  }
};
export const removeCommentById = (id, arr, callback) => {
  const indexToDelete = getIndexById(id, arr);

  if (isIndexExists(indexToDelete)) {
    if (callback && typeof callback === 'function') callback(indexToDelete);
    if ('content' in arr[indexToDelete]) arr[indexToDelete].content = ' ';
  }
};

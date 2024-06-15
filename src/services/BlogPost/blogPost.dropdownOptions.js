export default (isAuthor, isModerator) => [
  ...(isModerator || isAuthor
    ? [
        {
          text: 'Delete post',
          action: 'delete',
          special: true,
          togglable: false
        }
      ]
    : []),
  ...(isAuthor
    ? [
        {
          text: 'Edit post',
          action: 'edit',
          special: false,
          togglable: false
        }
      ]
    : []),
  {
    text: 'Report post',
    action: 'report',
    special: true,
    toggleable: false
  }
];

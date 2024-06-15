export default (isAuthor, isModerator) => [
  ...(isAuthor || isModerator
    ? [
        {
          text: 'Delete comment',
          action: 'delete',
          special: true,
          togglable: false
        }
      ]
    : []),
  ...(isAuthor
    ? [
        {
          text: 'Edit comment',
          action: 'edit',
          special: false,
          togglable: false
        }
      ]
    : []),
  {
    text: 'Report comment',
    action: 'report',
    special: true,
    toggleable: false
  }
];

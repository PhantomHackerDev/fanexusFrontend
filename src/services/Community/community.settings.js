/** @TODO add whiteList and blackList settings later */

export default {
  visibility: {
    id: 'general',
    title: 'General settings',
    type: 'switch',
    data: [
      {
        name: 'hideFromMinors',
        text: 'Hide from minors'
      },
      {
        name: 'hideFromSearch',
        text: 'Hide from search results'
      },
      {
        name: 'requireApproval',
        text: 'Require approval for membership'
      }
    ]
  },
  content: {
    id: 'contentAccessControl',
    title: 'Content',
    value: null,
    data: [
      {
        text: 'Full (anyone can see the posts)',
        value: 1
      },
      {
        text: 'Members (only members can see posts)',
        value: 3
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ],
    selectOptions: [
      {
        text: 'Unfollow',
        action: 'delete',
        special: true,
        togglable: false
      },
      {
        text: 'Block user',
        action: 'block',
        special: true,
        togglable: false
      },
      {
        text: 'Manage tags',
        action: 'editTags',
        special: false,
        togglable: false
      },
      {
        text: 'Add to security group',
        action: 'visible',
        special: false,
        togglable: true
      }
    ]
  },
  comments: {
    id: 'commentsAccessControl',
    title: 'Comments',
    value: null,
    data: [
      {
        text: 'Full (anyone can comment)',
        value: 1
      },
      {
        text: 'Members (only members can comment)',
        value: 3
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  },
  reactions: {
    id: 'reactionsAccessControl',
    title: 'Reactions',
    value: null,
    data: [
      {
        text: 'Full (anyone can react)',
        value: 1
      },
      {
        text: 'Members (only members can react)',
        value: 3
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  },
  members: {
    id: 'membersAccessControl',
    title: 'Members',
    /** @TODO revise usage of this */
    value: null,
    data: [
      {
        text: 'Full (anyone can see members)',
        value: 1
      },
      {
        text: 'Members (only members can see members)',
        value: 3
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  }
};

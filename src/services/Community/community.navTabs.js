import { communityAreas } from './community.service';

export default ({
  blogPostCount,
  hasViewMembersPermission = false,
  userHasEditPermissions = false
}) => [
  {
    title: 'All Posts',
    component: communityAreas.posts,
    count: blogPostCount
  },
  {
    title: 'Rules',
    component: communityAreas.rules
  },
  ...(hasViewMembersPermission
    ? [
        {
          title: 'Members',
          component: communityAreas.members
        },
        {
          title: 'Moderators',
          component: communityAreas.moderators
        }
      ]
    : []),
  ...(userHasEditPermissions
    ? [
        {
          title: 'Requests',
          component: communityAreas.requests
        }
      ]
    : [])
];

import VueRouter from 'vue-router';
/*@TODO remove*/
import Testing from '@/views/Testing.vue';
import NewsFeed from '@/views/NewsFeed.vue';
import Blog from '@/views/Blog.vue';
import Community from '@/views/Community.vue';
import MyCommunities from '@/views/MyCommunities.vue';
import Followers from '@/views/Followers.vue';
import Following from '@/views/Following';
import Blocking from '@/views/Blocking';
import CommunityCreateCommunity from '@/components/Community/CommunityCreateCommunity';
import Tagged from '@/views/Tagged';
import TaggedBlogPosts from '@/components/Tagged/TaggedBlogPosts';
import TaggedBlogs from '@/components/Tagged/TaggedBlogs';
import TaggedCommunities from '@/components/Tagged/TaggedCommunities';
import TagShow from '@/views/TagShow';
import TagEdit from '@/views/TagEdit';
import Likes from '@/views/Likes';
import LikesBlogPosts from '@/components/Likes/LikesBlogPosts';
import LikesComments from '@/components/Likes/LikesComments';
import Invites from '@/views/Invites';
import Activities from '@/views/Activities';
import Settings from '@/views/Settings';
import AuthSettings from '@/components/Auth/AuthSettings';
import BlogSettings from '@/components/Blog/BlogSettings';
import BlogPrivacyGroup from '@/components/Blog/BlogPrivacyGroup';
import EmptyRouter from '@/views/EmptyRouter';
import Support from '@/views/Support';
import Moderation from '@/views/Moderation';
import SignupKeys from '@/views/SignupKeys';
import PasswordReset from '@/views/PasswordReset';
import ModerationLog from '@/components/Moderation/ModerationLog';
import TaggingBasics from '@/components/StaticPages/TaggingBasics';
import AdvancedTagging from '@/components/StaticPages/AdvancedTagging';
import NewUserGuide from '@/components/StaticPages/NewUserGuide';
import TermsOfService from '@/components/StaticPages/TermsOfService';

import store from '@/store/index';

const orderParam = ':order(id|score|liked|commented|reblogged)?';
const paginationParam = ':currentPage(\\d+)?';
const commonParams = `${orderParam}/${paginationParam}`;

const authenticatedRouteParams = {
  meta: { authentication: true },
  beforeEnter(to, from, next) {
    next({
      ...(!store.state.auth.isAuthenticated && { name: 'home' })
    });
  }
};

let redirectedFeed;

const routes = [
  {
    path: `/${commonParams}`,
    name: 'home',
    props: true,
    component: NewsFeed,
    meta: { createPost: true, page: 'home' },
    children: [
      {
        path: 'post/:postId',
        name: 'home-with-blog-post',
        props: true,
        meta: { createPost: true, page: 'home' }
      }
    ],
    beforeEnter(to, from, next) {
      if (!from.name && !redirectedFeed) {
        redirectedFeed = true;
        const params = {
          order: store.state.feed.mainFeedOrder
        };
        for (const key in to.params) {
          if (Object.hasOwnProperty.call(to.params, key)) {
            const value = to.params[key];
            if (value) {
              params[key] = value;
            }
          }
        }
        next({
          name: to.name || 'home',
          params,
          query: to.query,
          replace: true
        });
      } else {
        next();
      }
    }
  },
  {
    path: `/tags/:tagNames/${commonParams}`,
    name: 'home-by-tags',
    props: true,
    meta: {
      showPost: true,
      main: 'home',
      page: 'home-by-tags',
      tabIndex: 0
    },
    component: NewsFeed,
    children: [
      {
        path: 'post/:postId',
        name: 'home-by-tags-with-blog-post',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'home-by-tags',
          tabIndex: 0
        },
        component: NewsFeed
      }
    ]
  },
  {
    path: '/testing',
    name: 'testing',
    component: Testing
  },
  {
    path: '/blog',
    component: EmptyRouter,
    children: [
      {
        path: `:name/:id(id)?/${commonParams}`,
        name: 'blog',
        props: true,
        meta: { createPost: true, page: 'blog' },
        component: Blog,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'blog' },
            component: Blog,
            children: [
              {
                path: 'comment/:commentId',
                name: 'comment-blog-with-blog-post',
                props: true,
                meta: { createPost: true, page: 'blog' },
                component: Blog
              }
            ]
          }
        ]
      },
      {
        path: `:name/:id(id)?/tags/:tagNames/${commonParams}`,
        name: 'blog-by-tags',
        props: true,
        meta: { createPost: true, page: 'blog-by-tags' },
        component: Blog,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-by-tags-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'blog-by-tags' },
            component: Blog
          }
        ]
      },
      {
        path: ':name/:id(id)?/edit',
        name: 'edit-blog',
        props: true,
        meta: { createPost: true, page: 'blog' },
        component: Blog
      }
    ]
  },
  {
    path: '/likes',
    props: true,
    component: Likes,
    children: [
      {
        path: commonParams,
        name: 'likes',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'likes',
          tabIndex: 0
        },
        component: LikesBlogPosts,
        children: [
          {
            path: 'post/:postId',
            name: 'likes-with-blog-post',
            props: true,
            meta: {
              showPost: true,
              main: 'likes',
              page: 'likes',
              tabIndex: 0
            }
          }
        ]
      },
      {
        path: `tags/:tagNames/${commonParams}`,
        name: 'likes-by-tags',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'likes-by-tags',
          tabIndex: 0
        },
        component: LikesBlogPosts,
        children: [
          {
            path: 'post/:postId',
            name: 'likes-by-tags-with-blog-post',
            props: true,
            meta: {
              showPost: true,
              main: 'likes',
              page: 'likes-by-tags',
              tabIndex: 0
            },
            component: LikesBlogPosts
          }
        ]
      },
      {
        path: 'comments/:pagination(\\d+)?',
        name: 'likes-comments',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'likes-comments',
          tabIndex: 1
        },
        component: LikesComments,
        children: [
          {
            path: 'post/:postId',
            name: 'likes-comments-with-blog-post',
            props: true,
            meta: {
              showPost: true,
              main: 'likes',
              page: 'likes-comments',
              tabIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    path: '/community',
    component: EmptyRouter,
    children: [
      {
        path: `:name/${commonParams}`,
        name: 'community',
        props: true,
        meta: { createPost: true, page: 'community' },
        component: Community,
        children: [
          {
            path: 'post/:postId',
            name: 'community-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'community' },
            component: Community,
            children: [
              {
                path: 'comment/:commentId',
                name: 'comment-community-with-blog-post',
                props: true,
                meta: { createPost: true, page: 'community' },
                component: Community
              }
            ]
          }
        ]
      },
      {
        path: `:name/tags/:tagNames/${commonParams}`,
        name: 'community-by-tags',
        props: true,
        meta: { createPost: true, page: 'community-by-tags' },
        component: Community,
        children: [
          {
            path: 'post/:postId',
            name: 'community-by-tags-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'community-by-tags' },
            component: Community
          }
        ]
      },
      {
        path: ':name/edit',
        name: 'edit-community',
        props: true,
        meta: { createPost: true, page: 'community' },
        component: Community
      }
    ]
  },
  {
    path: '/create-community',
    name: 'create-community',
    component: CommunityCreateCommunity
  },
  /** @TODO revise name */
  {
    path: '/my-communities',
    name: 'my-communities',
    props: true,
    component: MyCommunities
  },
  {
    path: '/followers',
    name: 'followers',
    props: true,
    component: Followers,
    ...authenticatedRouteParams
  },
  {
    path: '/following',
    name: 'following',
    props: true,
    component: Following,
    ...authenticatedRouteParams
  },
  {
    path: '/blocking',
    name: 'blocking',
    props: true,
    component: Blocking,
    ...authenticatedRouteParams
  },
  {
    path: '/tag/:name?',
    name: 'tag-show',
    props: true,
    component: TagShow
  },
  {
    path: '/tag/:name/edit',
    name: 'tag-edit',
    props: true,
    component: TagEdit,
    ...authenticatedRouteParams
  },
  {
    path: '/tag/:tagNames',
    props: true,
    component: Tagged,
    children: [
      {
        path: `blog-posts/${commonParams}`,
        name: 'tagged-blog-posts',
        props: true,
        meta: {
          main: 'tagged',
          createPost: true,
          page: 'tagged-blog-posts',
          tabIndex: 0
        },
        component: TaggedBlogPosts,
        children: [
          {
            path: 'post/:postId',
            name: 'tagged-blog-posts-with-blog-post',
            props: true,
            meta: {
              main: 'tagged',
              createPost: true,
              page: 'tagged-blog-posts',
              tabIndex: 0
            }
          }
        ]
      },
      {
        path: 'blogs/:pagination(\\d+)?',
        name: 'tagged-blogs',
        props: true,
        meta: { main: 'tagged', page: 'tagged-blogs', tabIndex: 1 },
        component: TaggedBlogs
      },
      {
        path: 'communities/:pagination(\\d+)?',
        name: 'tagged-communities',
        props: true,
        meta: { main: 'tagged', page: 'tagged-communities', tabIndex: 2 },
        component: TaggedCommunities
      }
    ]
  },
  {
    path: '/new-tag',
    name: 'new-tag',
    component: TagEdit,
    ...authenticatedRouteParams
  },
  {
    path: '/invites',
    name: 'invites',
    component: Invites,
    ...authenticatedRouteParams
  },
  {
    path: '/activities',
    name: 'activities',
    component: Activities,
    ...authenticatedRouteParams
  },
  {
    path: '/privacy-groups',
    name: 'privacy-groups',
    component: BlogPrivacyGroup
  },
  {
    path: '/settings',
    component: Settings,
    ...authenticatedRouteParams,
    meta: { settings: true, authentication: true },
    children: [
      {
        path: 'user',
        name: 'settings-auth',
        meta: { tabIndex: 0 },
        component: AuthSettings
      },
      {
        path: 'blog',
        name: 'settings-blog',
        meta: { tabIndex: 1 },
        component: BlogSettings
      }
    ]
  },
  {
    path: '/support',
    name: 'support',
    component: Support
  },
  {
    path: '/tagging-basics',
    name: 'tagging-basics',
    component: TaggingBasics
  },
  {
    path: '/advanced-tagging',
    name: 'advanced-tagging',
    props: true,
    component: AdvancedTagging
  },
  { path: '/new-user-guide', name: 'new-user-guide', component: NewUserGuide },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: TermsOfService
  },
  {
    path: '/',
    component: Moderation,
    meta: { moderation: true },
    children: [
      {
        path: 'signup-keys',
        name: 'signup-keys',
        meta: { tabIndex: 0 },
        component: SignupKeys
      },
      {
        path: 'moderation-log',
        name: 'moderation-log',
        meta: { tabIndex: 1 },
        component: ModerationLog
      }
    ]
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: PasswordReset
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

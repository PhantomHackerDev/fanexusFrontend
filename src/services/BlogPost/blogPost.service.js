import { get } from '~api';
export const blogPostRoot = 'blogPost';
const blogRoot = 'blog';

export const blogPostEditorTitles = {
  newPost: 'New',
  editPost: 'Edit',
  share: 'Share'
};

export const blogPostOrders = newsFeed => [
  {
    value: undefined,
    label: newsFeed ? 'Score' : 'Created'
  },
  ...(newsFeed
    ? [
        {
          value: 'id',
          label: 'Created'
        }
      ]
    : []),
  ...(!newsFeed
    ? [
        {
          value: 'score',
          label: 'Score'
        }
      ]
    : []),
  {
    value: 'liked',
    label: 'Most likes'
  },
  {
    value: 'reblogged',
    label: 'Most reblogs'
  },
  {
    value: 'commented',
    label: 'Most comments'
  }
];

export const getBlogPostLikes = ({ name, pagination, tagNames, order }) =>
  get(
    `${blogRoot}/${name}/likes/blogPosts${
      tagNames ? `/tags/${encodeURIComponent(tagNames)}` : ''
    }${order ? `/${order}` : ''}/${pagination}`
  );
export const getCommentLikes = ({ name }) =>
  get(`${blogRoot}/${name}/likes/comments`);

const blogPostsPerPage = 8;
export const lastBlogPostPage = count => Math.ceil(count / blogPostsPerPage);

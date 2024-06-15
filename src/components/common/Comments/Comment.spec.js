import { shallowMount } from '@vue/test-utils';
import Comment from '~common/Comments/Comment';
import Expandable from '~common/Expandable';

HTMLCollection.prototype.forEach = Array.prototype.forEach;
const getPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
CSSStyleDeclaration.prototype.getPropertyValue = function(property) {
  return property === 'color'
    ? 'rgb(0,0,0)'
    : getPropertyValue.call(this, property);
};

describe('Comment', () => {
  it('is expandable', () => {
    const wrapper = shallowMount(Comment, {
      propsData: {
        blogPostId: 1,
        comment: {
          id: 0,
          content: `<div style="color: white">asdf</div>${'a<br>'.repeat(100)}`,
          Alias: {
            name: 'alias',
            Blog: {
              link: '',
              id: ''
            },
            avatar: {
              src: ''
            }
          },
          childComments: [],
          userHasEditPermissions: false,
          userLiked: true,
          parentCommentId: 0,
          rootBlogPostId: 0,
          updatedAt: new Date(),
          engagementStats: {},
          hasChildComments: false,
          lastCommentThread: null
        },
        backgroundColor: [0, 0, 0]
      }
    });
    const expandable = wrapper.findComponent(Expandable);
    expect(expandable.exists()).toBe(true);
  });
});

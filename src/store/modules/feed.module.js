import Vue from 'vue';
import {
  getColumns,
  setColumns,
  getShowReblogs,
  setShowReblogs,
  getFeedOrder,
  setFeedOrder
} from '@/services/storage.service';
import { feedTypes, getNewsFeed } from '@/services/feed.service';
import {
  getBlogPost,
  deleteBlogPost,
  getBlogData
} from '@/services/Blog/blog.service';
import { getTaggedBlogPosts } from '@/services/tag.service';
import {
  getBlogPostLikes,
  getCommentLikes
} from '@/services/BlogPost/blogPost.service';
import { getComment } from '@/services/Comment/comment.service';
import { getCommunity } from '@/services/Community/community.service';
import { isIndexExists, getIndexById } from '@/utils/array.js';

const defaultPage = 1;

const state = {
  type: null,
  currentPage: defaultPage,
  data: { BlogPosts: [], id: 0, communityRules: [] },
  display: {
    columns: Number(getColumns()) || 2,
    showReblogs: getShowReblogs() || 'show'
  },
  feedParams: null,
  mainFeedOrder: getFeedOrder(),
  showSubmitReportModal: false
};

const getters = {
  layout(state, getters) {
    if (getters.isTablet) {
      return 'one-sidebar';
    }
    return state.display.columns > 2 ? 'one-sidebar' : 'two-sidebars';
  }
};

const actions = {
  openSubmitReportModal({ commit }, value = true) {
    commit('openSubmitReportModal', value);
  },
  /** @TODO move to @see 'src\store\modules\blogPost.module.js' */
  async setFeedPage({ commit, dispatch }, { page, type, ...payload }) {
    commit('setFeedPage', page);
    await dispatch('getFeedData', { pagination: page, type, ...payload });
  },
  async getFeedData({ commit }, { type, ...payload }) {
    commit('setFeedParams', { type, ...payload });
    let getData;
    try {
      switch (type) {
        case feedTypes.blog:
          getData = getBlogData;
          break;
        case feedTypes.community:
          getData = getCommunity;
          break;
        case feedTypes.tagged:
          getData = getTaggedBlogPosts;
          break;
        case feedTypes.likes:
          getData = getBlogPostLikes;
          break;
        case feedTypes.comments:
          getData = getCommentLikes;
          break;
        default:
          getData = getNewsFeed;
          break;
      }
      const data = await getData(payload);

      commit('setFeedType', type);
      commit('setFeedData', data);
    } catch (e) {
      if (e.response.status === 404) {
        throw e;
      } else {
        return false;
      }
    }
  },
  async reloadFeed({ state, dispatch }) {
    await dispatch('getFeedData', state.feedParams);
  },
  setMainFeedOrder({ commit }, order) {
    commit('setMainFeedOrder', order);
  },
  sortRules({ commit }) {
    commit('sortRules');
  },
  async updateFeedParams({ commit }, params) {
    commit('updateFeedParams', params);
  },
  async deleteBlogPost({ commit, state }, { id, payload }) {
    const index = getIndexById(id, state.data.BlogPosts);

    if (isIndexExists(index)) {
      await deleteBlogPost(id, payload);
      commit('deleteBlogPost', index);
    }
  },
  async updateBlogPostData({ commit, state }, id) {
    if (!state.data.BlogPosts) return;

    const index = getIndexById(id, state.data.BlogPosts);

    if (isIndexExists(index)) {
      const showingComments = state.type === feedTypes.comments;
      const [blogPost, comment] = await Promise.all([
        getBlogPost(id),
        ...(showingComments
          ? [getComment(state.data.BlogPosts[index].showComment.id)]
          : [])
      ]);
      const payload = {
        ...blogPost,
        ...(showingComments && { showComment: comment })
      };
      commit('updateBlogPostData', { index, payload });
    }
  },
  updateOptions({ commit }, input) {
    commit('setDisplay', input);
  }
};

const mutations = {
  openSubmitReportModal(state, value) {
    state.showSubmitReportModal = value;
  },
  setFeedPage(state, page) {
    state.currentPage = page || defaultPage;
  },
  setMainFeedOrder(state, order) {
    state.mainFeedOrder = order;
    setFeedOrder(order);
  },
  setFeedData(state, payload) {
    state.data = payload;
  },
  setFeedType(state, type) {
    state.type = type || feedTypes.news;
  },
  sortRules(state) {
    state.data.communityRules.sort((rule1, rule2) => rule1.id - rule2.id);
  },
  updateBlogPostData(state, { index, payload }) {
    /** @TODO fix newsfeed it's 'blogPosts' there */
    Vue.set(state.data.BlogPosts, index, payload);
  },
  /** @TODO revise delete issue */
  deleteBlogPost(state, index) {
    Vue.delete(state.data.BlogPosts, index);
  },
  setDisplay(state, { name, value }) {
    state.display[name] = value;
    if (name === 'columns') {
      setColumns(value);
    } else if (name === 'showReblogs') {
      setShowReblogs(value);
    }
  },
  setFeedParams(state, params) {
    state.feedParams = params;
  },
  updateFeedParams(state, params) {
    state.feedParams = {
      ...state.feedParams,
      ...params
    };
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

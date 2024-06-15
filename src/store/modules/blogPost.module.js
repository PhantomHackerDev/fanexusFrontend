const initialData = { content: '', Tags: [], id: 0 };
const state = {
  editingBlogPost: false,
  sharingBlogPost: false,
  imagePreviewSrc: null,
  data: initialData
};

const actions = {
  setImagePreviewSrc({ commit }, src) {
    commit('setImagePreviewSrc', src);
  },
  setEditBlogPost({ commit }, settings = { data: initialData }) {
    commit('setData', settings.data);
    commit('setEditingBlogPost', true);
    commit('setSharingBlogPost', false);
  },
  setShareBlogPost({ commit }, settings = { data: initialData }) {
    commit('setData', { id: settings.data.id, ...initialData });
    commit('setShareData', settings.data);
    commit('setTags', settings.data.Tags);
    commit('setEditingBlogPost', true);
    commit('setSharingBlogPost', true);
  },
  setBlogPostContent({ commit }, content) {
    commit('setContent', content);
  },
  setBlogPostTags({ commit }, tags) {
    commit('setTags', tags);
  },
  setEditingBlogPost({ commit }, editing) {
    commit('setEditingBlogPost', editing);
    commit('setSharingBlogPost', editing);
  }
};

const mutations = {
  setData(state, data) {
    state.data = { ...data };
  },
  setShareData(state, data) {
    state.shareData = { ...data };
  },
  setContent(state, content) {
    state.data.content = content;
  },
  setTags(state, tags) {
    state.data.Tags = tags;
  },
  setImagePreviewSrc(state, src) {
    state.imagePreviewSrc = src;
  },
  setEditingBlogPost(state, editing) {
    state.editingBlogPost = editing;
  },
  setSharingBlogPost(state, value) {
    state.sharingBlogPost = value;
  }
};

export default {
  state,
  actions,
  mutations
};

const KEY_PREFIX = 'fanexus';

export const ACCESS_TOKEN_KEY = `${KEY_PREFIX}_access_token`;
export const USER_DATA_KEY = `${KEY_PREFIX}_user_data`;
export const USER_ACTIVE_ALIAS = `${KEY_PREFIX}_active_alias`;
const COLUMNS_PREFERENCE = `${KEY_PREFIX}_columns`;
const SHOW_REBLOG_PREFERENCE = `${KEY_PREFIX}_show_reblogs`;
export const ACTIVITY_COUNT = `${KEY_PREFIX}_activity_count`;
export const WATCHING_ACTIVITIES = `${KEY_PREFIX}_watching_activities`;
const FEED_ORDER = `${KEY_PREFIX}_feed_order`;

export const getUserData = () =>
  localStorage.getItem(USER_DATA_KEY)
    ? JSON.parse(localStorage.getItem(USER_DATA_KEY))
    : null;
export const setUserData = userData =>
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
export const removeUserData = () => localStorage.removeItem(USER_DATA_KEY);
export const getActiveAliasStorage = () =>
  localStorage.getItem(USER_ACTIVE_ALIAS)
    ? parseInt(localStorage.getItem(USER_ACTIVE_ALIAS))
    : null;
export const setActiveAliasStorage = activeAlias =>
  localStorage.setItem(USER_ACTIVE_ALIAS, activeAlias);
export const removeActiveAliasStorage = () =>
  localStorage.removeItem(USER_ACTIVE_ALIAS);

export const getColumns = () => localStorage.getItem(COLUMNS_PREFERENCE);
export const setColumns = layout =>
  localStorage.setItem(COLUMNS_PREFERENCE, layout);
export const getShowReblogs = () =>
  localStorage.getItem(SHOW_REBLOG_PREFERENCE);
export const setShowReblogs = show =>
  localStorage.setItem(SHOW_REBLOG_PREFERENCE, show);

export const setActivityCount = count =>
  localStorage.setItem(ACTIVITY_COUNT, count);

export const getWatchingActivities = () =>
  localStorage.getItem(WATCHING_ACTIVITIES);
export const setWatchingActivities = watching =>
  localStorage.setItem(WATCHING_ACTIVITIES, watching);

export const getFeedOrder = () => localStorage.getItem(FEED_ORDER);
export const setFeedOrder = order => localStorage.setItem(FEED_ORDER, order);

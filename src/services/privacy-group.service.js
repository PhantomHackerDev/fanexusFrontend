import { get, post, put, remove } from '~api';

const root = 'accessControl';

export const getPrivacyGroup = id => get(`${root}/${id}`);
export const getPrivacyGroups = () => get(`${root}/my`);
export const createPrivacyGroup = payload => put(`${root}`, payload);
export const updatePrivacyGroup = (id, payload) =>
  post(`${root}/${id}`, payload);
export const removePrivacyGroup = id => remove(`${root}/${id}`);
export const addAliasesToPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/addAliases`, payload);
export const removeAliasesFromPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/removeAliases`, payload);
export const addPrivacyGroupToPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/addAccessControlGroup`, payload);
export const removePrivacyGroupFromPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/removeAccessControlGroup`, payload);

export const privacyOptions = [
  {
    name: 'name',
    type: 'input',
    title: 'Privacy group name'
  },
  {
    name: 'isDefault',
    type: 'toggler',
    title: 'Include as a default'
  },
  {
    name: 'accessControlSetting',
    type: 'radio-button',
    title: 'Access control setting',
    selections: [
      {
        description: 'Public (no effect)',
        value: 1
      },
      {
        description: 'Followers only',
        value: 2
      },
      {
        description: 'Allowlist (show only to...)',
        value: 4
      },
      {
        description: 'Denylist (hide from...)',
        value: 5
      }
    ]
  }
];

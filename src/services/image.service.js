import { post } from '~api';

export const createFormData = event => {
  const data = new FormData();
  for (const file of event.target.files) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    data.append('image', file);
  }

  return data;
};

const imageRoot = 'image';
// payload should be type of FormData
export const imageUpload = payload => post(`${imageRoot}/upload`, payload);

export const defaultAvatar =
  'http://media.fanexus.net/users/root/images/851cfc5a-d18a-4541-91ba-3a34ca283234';

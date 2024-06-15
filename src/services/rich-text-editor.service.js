import { createFormData, imageUpload } from '@/services/image.service';

export const actions = {
  formatBlock: 'formatBlock',
  formatBlockH1: 'formatBlockH1',
  formatBlockH2: 'formatBlockH2',
  uploadImage: 'uploadImage',
  formatBlockquote: 'formatBlockquote',
  outDent: 'outDent',
  insertHTML: 'insertHTML'
};

export const commands = [
  { id: 1, type: 'bold', icon: 'bold' },
  { id: 2, type: 'italic', icon: 'italic' },
  { id: 3, type: 'underline', icon: 'underline' },
  { id: 4, type: 'strikeThrough', icon: 'strikeThrough' },
  { id: 5, type: 'subscript', icon: 'subscript' },
  { id: 6, type: 'superscript', icon: 'superscript' },
  { id: 7, type: 'formatBlockH1', icon: 'formatBlockH1' },
  { id: 8, type: 'formatBlockH2', icon: 'formatBlockH2' },
  { id: 9, type: 'insertUnorderedList', icon: 'insertUnorderedList' },
  { id: 10, type: 'insertOrderedList', icon: 'insertOrderedList' },
  { id: 11, type: 'formatBlockquote', icon: 'quote' }
];

const videos = [
  {
    reg: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/i,
    url: 'https://www.youtube.com/embed/$5'
  },
  {
    reg: /^.*vimeo.com\/(\d+)($|\/|\b)/i,
    url: 'https://player.vimeo.com/video/$1'
  },
  {
    reg: /^.*(?:\/video|dai.ly)\/([A-Za-z0-9]+)([^#]*).*/i,
    url: 'https://www.dailymotion.com/embed/video/$1'
  },
  {
    reg: /^.*coub.com\/(?:embed|view)\/([A-Za-z0-9]+)([^#]*).*/i,
    url: 'https://coub.com/embed/$1'
  },
  {
    reg: /https?:\/\/(?:w\.|www\.|)(?:soundcloud\.com\/)(?:(?:player\/\?url=https3A\/\/api.soundcloud.com\/tracks\/)|)(((\w|-)[^A-z]{7})|([A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*(?!\/sets(?:\/|$))(?:\/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*){1,2}))/,
    url: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/$1'
  }
];

export const mediaActions = [
  { id: 1, type: 'createLink', icon: 'link-icon' },
  { id: 2, type: 'uploadImage', icon: 'image-icon' },
  { id: 3, type: 'mediaLink', icon: 'media-icon' }
];

export const nodeTypes = {
  textNode: 3
};

const insertHttp = url =>
  url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `http://${url}`;

const insertMedia = url => {
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.minHeight = '300px';
  iframe.allowfullscreen = 'allowfullscreen';

  let valid = false;
  let new_url = '';

  if (url) {
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      const m = v.reg.exec(url);
      if (m) {
        new_url = url.replace(v.reg, v.url);
        valid = true;
      }
    }
  }

  if (valid) {
    iframe.src = new_url;
    return iframe.outerHTML;
  }

  return;
};

const createLink = () => {
  // eslint-disable-next-line no-alert
  const urlInput = prompt('Enter the URL');
  return urlInput ? insertHttp(urlInput) : undefined;
};

const mediaLink = () => {
  // eslint-disable-next-line no-alert
  const urlInput = prompt('Enter the Media URL');
  return urlInput ? insertMedia(urlInput) : undefined;
};

/** @TODO revise usage of editorContent */
const createImageElement = (accessUrl, callback) => {
  const img = document.createElement('img');
  img.src = accessUrl;
  callback(img);
};

export const uploadImage = async (editorContent, event, callback) => {
  const formData = createFormData(event);
  const results = await imageUpload(formData);
  if (Array.isArray(results)) {
    for (const { accessUrl } of results) {
      createImageElement(accessUrl, callback);
    }
  } else {
    createImageElement(results.accessUrl, callback);
  }
};

export const getQueryCommandState = aCommandName =>
  document.queryCommandState(aCommandName);

export const execCommand = (aCommandName, formatBlock, value) => {
  if (
    aCommandName === 'formatBlockH1' ||
    aCommandName === 'formatBlockH2' ||
    aCommandName === 'formatBlockquote'
  ) {
    document.execCommand('formatBlock', false, formatBlock);
  } else if (aCommandName === 'insertHTML') {
    document.execCommand('insertHTML', false, value);
  } else if (aCommandName === 'mediaLink') {
    document.execCommand('insertHTML', false, mediaLink());
  } else {
    document.execCommand(
      aCommandName,
      false,
      aCommandName === 'createLink' ? createLink() : ''
    );
  }
};

export const exitBlockquote = (event, exitHere, exitBackspace) => {
  const selection = window.getSelection();
  const anchorNode = selection.anchorNode;
  if (
    anchorNode.tagName === 'BLOCKQUOTE' &&
    (exitHere || // Firefox/gecko
      (anchorNode.childNodes[selection.anchorOffset - 1] &&
        anchorNode.childNodes[selection.anchorOffset - 1].tagName === 'BR' &&
        anchorNode.childNodes[selection.anchorOffset - 2] &&
        anchorNode.childNodes[selection.anchorOffset - 2].tagName === 'BR'))
  ) {
    if (!exitHere) {
      anchorNode.removeChild(anchorNode.childNodes[selection.anchorOffset - 2]);
    } else {
      event.preventDefault();
    }
    execCommand(actions.outDent);
  } else if (
    // Chromium and Edge
    anchorNode.tagName === 'BLOCKQUOTE' &&
    anchorNode.childNodes.length === 1 &&
    anchorNode.previousSibling &&
    anchorNode.previousSibling.tagName === 'BLOCKQUOTE' &&
    anchorNode.previousSibling.childNodes.length === 1 &&
    anchorNode.previousSibling.childNodes[0].tagName === 'BR' &&
    anchorNode.previousSibling.previousSibling &&
    anchorNode.previousSibling.previousSibling.tagName === 'BLOCKQUOTE'
  ) {
    event.preventDefault();
    const previousSibling = anchorNode.previousSibling;
    previousSibling.replaceWith(...previousSibling.childNodes);
    execCommand(actions.outDent);
  } else if (
    anchorNode.innerText &&
    anchorNode.parentNode.tagName === 'BLOCKQUOTE' &&
    ((exitHere && selection.focusOffset === 0) ||
      (!anchorNode.innerText.trim().length &&
        anchorNode.previousSibling &&
        !anchorNode.previousSibling.innerText.trim().length))
  ) {
    if (!exitHere) {
      anchorNode.parentNode.removeChild(anchorNode.previousSibling);
    } else {
      event.preventDefault();
    }
    execCommand(actions.outDent);
  } else if (
    exitBackspace &&
    anchorNode.nodeType === nodeTypes.textNode &&
    selection.focusOffset === 0 &&
    (anchorNode.parentNode.tagName === 'BLOCKQUOTE' ||
      anchorNode.parentNode.parentNode.tagName === 'BLOCKQUOTE')
  ) {
    event.preventDefault();
    execCommand(actions.outDent);
  }
};

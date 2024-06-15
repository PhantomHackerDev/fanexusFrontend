import sanitize from 'sanitize-html';

const allowedTags = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'b',
  'i',
  'em',
  'strong',
  'a',
  'blockquote',
  'p',
  'ul',
  'ol',
  'nl',
  'li',
  'strike',
  'code',
  'hr',
  'br',
  'div',
  'table',
  'thead',
  'caption',
  'tbody',
  'tr',
  'tr',
  'th',
  'td',
  'pre',
  'iframe',
  'img',
  'dl',
  'dd',
  'dt',
  'u',
  'strike',
  'sub',
  'sup'
];
const allowedAttributes = {
  a: ['href', 'name', 'target'],
  img: ['src'],
  td: ['rowspan', 'colspan'],
  table: ['border'],
  iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
  '*': ['style']
};
const allowedStyles = {
  '*': {
    color: [
      /^#(0x)?[0-9a-f]+$/i,
      /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
    ],
    'text-align': [/^left$/, /^right$/, /^center$/],
    'font-size': [/^\d+(?:px|em|%)$/],
    'text-decoration': [/^underline$/]
  }
};

const allowedIframeHostnames = ['www.youtube.com'];

export default contents => {
  return sanitize(contents, {
    allowedTags,
    allowedAttributes,
    allowedIframeHostnames,
    allowedStyles
  });
};

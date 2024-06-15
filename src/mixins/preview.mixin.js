import { htmlTag } from '@/utils/regExp';

export default {
  methods: {
    preview(content) {
      const plainText = content.replace(htmlTag, '');
      const previewLength = 200;
      return (
        plainText.substring(0, previewLength) +
        (plainText.length > previewLength ? '...' : '')
      );
    }
  }
};

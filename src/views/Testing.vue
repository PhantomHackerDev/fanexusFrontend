<template
  ><div class="testing">
    <form-rich-text-editor v-model="content" /></div
></template>

<script>
import FormRichTextEditor from '~fields/FormRichTextEditor';

export default {
  components: {
    FormRichTextEditor
  },
  data() {
    return {
      content: ''
    };
  }
};
</script>

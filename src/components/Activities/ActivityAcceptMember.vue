<template>
  <span>
    has accepted your membership request to
    <router-link
      :to="{
        name: 'community',
        params: {
          name: data.targetCommunity.link
        }
      }"
      >{{ data.targetCommunity.name }}</router-link
    >.</span
  >
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>

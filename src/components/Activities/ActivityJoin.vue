<template>
  <span>
    has joined on your
    <router-link
      :to="{ name: 'community', params: { name: data.targetCommunity.link } }"
      >{{ data.targetCommunity.name }}</router-link
    >
    community.
  </span>
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

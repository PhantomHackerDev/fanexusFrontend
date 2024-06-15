<template>
  <footer class="footer">
    <copyrights /> |
    <router-link class="aside-menu__support-link" :to="{ name: 'support' }"
      >Fanexus support</router-link
    >
    |
    <router-link class="asidemenu__link" :to="{ name: 'tagging-basics' }"
      >Tagging guide</router-link
    >
    |
    <router-link class="asidemenu__link" :to="{ name: 'new-user-guide' }"
      >New user guide</router-link
    >
    |
    <router-link class="asidemenu__link" :to="{ name: 'terms-of-service' }"
      >Terms of service</router-link
    >
  </footer>
</template>
<script>
import Copyrights from '~common/Copyrights';
export default {
  components: {
    Copyrights
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.footer {
  grid-area: footer;
  text-align: center;
  font-size: var(--size-button);
  display: block;
  color: var(--text-primary);
  margin: var(--element-margin-s) auto;
  @include mobile {
    color: var(--color-white);
  }

  ::v-deep a {
    color: var(--text-primary);
    transition: var(--transition-default);
    @include mobile {
      color: var(--color-white);
    }

    &:hover {
      color: var(--text-button-hover);
      transition: var(--transition-default);
    }
  }
}
</style>

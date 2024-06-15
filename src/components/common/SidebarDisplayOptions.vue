<template>
  <div class="sidebar-display-options">
    <h3 class="sidebar-display-options__title">Display options</h3>
    <options-row :selections="selections" @input="updateDisplay" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import OptionsRow from '~common/Fields/OptionsRow';

export default {
  props: {
    excludeReblogOption: {
      type: Boolean,
      default: false
    }
  },
  components: {
    OptionsRow
  },
  computed: {
    selections() {
      const result = [];
      if (this.maxColumnsCount > 1) {
        result.push({
          name: 'columns',
          heading: 'Columns',
          values: Array.from(
            { length: this.maxColumnsCount },
            (_, index) => index + 1
          ).map(value => ({
            value,
            label: value
          })),
          selected: Math.min(this.maxColumnsCount, this.columns)
        });
      }
      if (this.excludeReblogOption) {
        result.push({
          name: 'showReblogs',
          heading: 'Reblog display',
          values: [
            { value: 'show', label: 'Show' },
            { value: 'hide', label: 'Hide' }
          ],
          selected: this.showReblogs
        });
      }
      return result;
    },
    ...mapState({
      columns: state => state.feed.display.columns,
      showReblogs: state => state.feed.display.showReblogs
    }),
    ...mapGetters({
      maxColumnsCount: 'maxColumnsCount'
    })
  },
  methods: {
    ...mapActions(['updateOptions']),
    updateDisplay({ name, value }) {
      this.updateOptions({ name, value });
      if (name === 'showReblogs') {
        this.$emit('update-display');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.sidebar-display-options {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-l);
  color: var(--text-primary);
  font-size: var(--size-regular);
  @include mobile {
    padding: var(--element-padding-s);
    background-color: transparent;
  }
  &__title {
    text-align: center;
    font-size: var(--size-title);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-m);
    @include mobile {
      display: none;
    }
  }
}
</style>

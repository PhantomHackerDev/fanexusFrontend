<template>
  <div class="options-rows">
    <div
      class="options-rows__row"
      v-for="({ name, heading, values, selected }, index) of selections"
      :key="`${name}-${index}`"
    >
      <h4
        class="options-rows__heading"
        :class="{ 'text-overflow': ellipsesHeading }"
      >
        {{ heading }}
      </h4>
      <ul class="options-rows__value-list">
        <li
          class="options-rows__value-list-item"
          @click="$emit('input', { name, value })"
          v-for="({ value, label }, index) of values"
          :key="`${value}-${index}`"
          :class="{ selected: value === selected }"
        >
          {{ label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selections: {
      type: Array,
      required: true
    },
    ellipsesHeading: {
      type: Boolean
    }
  }
};
</script>

<style lang="scss" scoped>
.options-rows {
  list-style: none;
  margin-bottom: 0;

  &__heading {
    text-align: center;
    font-size: var(--size-regular);
    margin-bottom: var(--element-margin-xs);
  }

  &__value-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &-item {
      border: var(--border-width-default) solid var(--border-tag);
      border-radius: var(--border-radius);
      padding: var(--element-padding-xs);

      &:not(:last-child) {
        margin-right: var(--element-margin-s);
      }

      &.selected {
        background-color: var(--border-tag);
      }

      &:not(.selected) {
        cursor: pointer;
      }
    }
  }

  &__row:last-child &__value-list {
    margin-bottom: 0;
  }
}
</style>

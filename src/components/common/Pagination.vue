<template>
  <div class="pagination">
    <button
      class="pagination__arrow--prev"
      type="button"
      @click="$emit('pageChanged', currentPage - 1)"
      aria-label="Go to previous page"
      :class="{ pagination__hidden: currentPage === 1 }"
    ></button>
    <ul class="pagination__buttons">
      <li class="pagination__button" v-if="startPage > 1">
        <button
          class="pagination__button-page"
          type="button"
          @click="$emit('pageChanged', 1)"
          aria-label="Go to first page"
        >
          1
        </button>
      </li>
      <li class="pagination__button" v-if="startPage > 2">
        <button class="pagination__button-page button-dots" type="button">
          ...
        </button>
      </li>
      <li
        v-for="(number, index) in pages"
        :key="index"
        class="pagination__button"
      >
        <button
          class="pagination__button-page"
          type="button"
          @click="$emit('pageChanged', number)"
          :disabled="currentPage === number"
          :class="{ active: currentPage === number }"
          :aria-label="`Go to page number ${number}`"
        >
          {{ number }}
        </button>
      </li>
      <li class="pagination__button" v-if="endPage < lastPage - 1">
        <button class="pagination__button-page button-dots" type="button">
          ...
        </button>
      </li>
      <li class="pagination__button" v-if="endPage < lastPage">
        <button
          class="pagination__button-page"
          type="button"
          @click="$emit('pageChanged', lastPage)"
          aria-label="Go to last page"
        >
          {{ lastPage }}
        </button>
      </li>
    </ul>
    <button
      class="pagination__arrow--next"
      type="button"
      @click="$emit('pageChanged', currentPage + 1)"
      aria-label="Go to next page"
      :class="{ pagination__hidden: currentPage === lastPage }"
    ></button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    lastPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters['isMobile'];
    },
    pageRange() {
      return !this.isMobile ? 3 : 2;
    },
    startPage() {
      return Math.max(this.currentPage - this.pageRange, 1);
    },
    endPage() {
      return Math.min(this.currentPage + this.pageRange, this.lastPage);
    },
    pages() {
      return Array.from(
        { length: this.endPage - this.startPage + 1 },
        (undefined, i) => this.startPage + i
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  padding-top: var(--element-padding-l);
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  max-width: var(--width-large);

  &__arrow--prev,
  &__arrow--next,
  &__button-page {
    height: 30px;
    color: var(--text-primary);
    border-radius: var(--border-radius);
    background-color: transparent;
    border: var(--border-width-thin) solid var(--text-primary);
    padding: 0 var(--element-padding-s);
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: var(--transition-default);
    position: relative;
    font-size: var(--size-regular);
    outline: none;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    list-style: none;
    margin: 0;
  }
  &__button {
    margin-right: var(--element-margin-s);
    &:last-child {
      margin-right: 0;
    }
    .button-dots {
      cursor: text;
    }
  }

  &__button-page {
    &:hover {
      color: var(--BG-button-pagination-active);
      border-color: var(--BG-button-pagination-active);
    }
    &.active {
      color: var(--text-button-comment);
      border-color: transparent;
      background-color: var(--BG-button-pagination-active);
    }
  }

  &__arrow--prev:before,
  &__arrow--next:before {
    content: '';
    border-top: var(--border-width-default) solid var(--text-primary);
    border-left: var(--border-width-default) solid var(--text-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%), rotate(45deg);
    width: 7px;
    height: 7px;
  }

  &__arrow--next:before {
    transform: translate(-60%, -50%) rotate(135deg);
  }

  &__arrow--prev:before {
    transform: translate(-40%, -50%) rotate(-45deg);
  }

  &__arrow--prev,
  &__arrow--next {
    width: 30px;
    background-color: transparent;
    &:focus {
      outline: none;
    }

    &:hover {
      background-color: transparent;
      border-color: var(--BG-button-pagination-active);

      &:before {
        border-color: var(--BG-button-pagination-active);
      }
    }
    &:disabled {
      border-color: var(--border-button-disabled);

      &:before {
        border-color: var(--border-button-disabled);
      }
    }
  }

  &__hidden {
    visibility: hidden;
  }
}
</style>

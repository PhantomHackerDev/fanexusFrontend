<template>
  <div class="request">
    <div class="request-header">
      <p class="request__date" v-if="isValidDate">
        {{ date | dateFormat }}
      </p>
      <dots-button v-if="showDots" />
    </div>
    <div class="request-body">
      <div class="request-title">
        <!--  @TODO make data dynamic -->
        <author-title
          :name="alias.name"
          imageSize="md"
          :image="alias.avatar.src"
        >
          <span class="request-title__text" v-if="activityName">
            {{ activityName }}
            <template v-if="activityText">{{ activityText }}</template>
            <template v-if="activityDate && isValidActivityDate">{{
              activityDate | dateFormat
            }}</template>
          </span>
        </author-title>
      </div>
      <!--  @TODO make data dynamic -->
      <!-- <avatar size="md" :file="require('@/assets/img/png/Image_28.png')" /> -->
    </div>
    <div class="request-footer" v-if="showButtons">
      <form-button
        type="button"
        text="Decline Request"
        class="request-footer__decline-btn"
        @click.native.stop="$emit('decline')"
      />
      <form-button
        type="button"
        text="Accept request"
        class="request-footer__accept-btn button--submit"
        @click.native.stop="$emit('accept')"
      />
    </div>
  </div>
</template>

<script>
import { isValidDate } from '@/filters/date.filter';
import AuthorTitle from '~common/AuthorTitle';
// import Avatar from '~common/Avatar';
import DotsButton from '~common/Buttons/DotsButton';
import FormButton from '~common/Buttons/FormButton';

export default {
  components: {
    DotsButton,
    AuthorTitle,
    // Avatar,
    FormButton
  },
  props: {
    alias: {
      type: Object,
      required: true
    },
    activityName: {
      type: String
    },
    activityText: {
      type: String
    },
    activityDate: {
      type: String
    },
    date: {
      type: String
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    showDots: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isValidDate() {
      return isValidDate(this.date);
    },
    isValidActivityDate() {
      return isValidDate(this.activityDate);
    }
  }
};
</script>
<style lang="scss" scoped>
.request {
  padding: var(--element-padding-l);
  border-radius: var(--border-radius);
  background-color: var(--BG-blog-post);

  &__date {
    color: var(--text-date-and-time);
    font-size: var(--size-small);
    margin-bottom: 0;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--element-margin-m);
  }

  &-body {
    display: flex;
    justify-content: space-between;
  }

  &-footer {
    display: flex;
    margin-top: var(--element-margin-s);

    &__accept-btn {
      flex: 1 0 0;
      margin-left: var(--element-margin-xs);
    }

    &__decline-btn {
      flex: 1 0 0;
      margin-right: var(--element-margin-xs);
    }
  }

  &-title {
    color: var(--text-primary);
    &__text {
      font-size: var(--size-button);
      margin-top: var(--element-margin-m);
    }
  }
}
::v-deep {
  .button--submit {
    background-color: var(--BG-button-secondary);
    color: var(--text-button-secondary);
    &:focus {
      background-color: var(--BG-button-secondary-hover);
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-comment);
    }
    &:hover {
      background-color: var(--BG-button-secondary-hover);
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-comment);
    }
    &.button--disabled,
    &.button--disabled:hover {
      cursor: not-allowed;
      background-color: var(--BG-button-secondary-disabled);
      border-color: var(--border-button-secondary-disabled);
      color: var(--text-button-comment);
    }
  }
}
</style>

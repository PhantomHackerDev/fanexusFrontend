<template>
  <modal
    class="mobile-follow-modal modal-overlay--centered"
    :settings="settings"
  >
    <template slot="body">
      <form-button
        class="mobile-follow-modal__button"
        type="info"
        text="Membership pending"
        v-if="membershipPending"
      />
      <form-button
        class="mobile-follow-modal__button"
        @click.native.stop="$emit('join')"
        type="submit"
        text="Join"
        v-else-if="!isMember"
      />
      <form-button
        class="mobile-follow-modal__button"
        @click.native.stop="$emit('leave')"
        type="cancel"
        text="Leave"
        v-else
      />
      <form-button
        class="mobile-follow-modal__button"
        type="info"
        text="Followship pending"
        v-if="awaitFollow"
      />
      <form-button
        class="mobile-follow-modal__button"
        type="cancel"
        text="Unfollow"
        @click.native.stop="$emit('unsubscribe')"
        v-else-if="isSubscribe"
        :disabled="awaitFollow"
      />
      <form-button
        class="mobile-follow-modal__button"
        type="submit"
        text="Follow"
        @click.native.stop="$emit('subscribe')"
        v-else
        :disabled="awaitFollow"
      />
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal';
import FormButton from '~common/Buttons/FormButton';

export default {
  components: {
    Modal,
    FormButton
  },
  props: {
    settings: {
      type: Object,
      required: true
    },
    isMember: {
      type: Boolean
    },
    membershipPending: {
      type: Boolean
    },
    isSubscribe: {
      type: Boolean
    },
    awaitFollow: {
      type: Boolean
    }
  }
};
</script>

<style lang="scss" scoped>
.mobile-follow-modal {
  &__button {
    width: 100%;

    & + & {
      margin-top: 10px;
    }
  }
}
</style>

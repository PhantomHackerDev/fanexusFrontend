<template>
  <div class="auth-form-content create-account">
    <form-input
      placeholder="Email"
      type="email"
      name="email"
      v-model="formData.email"
      required
    />
    <form-input
      placeholder="Name"
      type="name"
      name="name"
      v-model="formData.name"
      required
    />
    <form-checkbox
      @input="ageCheckHandler"
      v-model="formData.ageCheck"
      name="ageCheck"
    >
      I am a minor (not 18 yet)
    </form-checkbox>
    <date-dropdown
      v-if="formData.ageCheck"
      :default="fifteenYearsAgo"
      :min="(new Date().getFullYear() - 17).toString()"
      :max="(new Date().getFullYear() - 12).toString()"
      v-model="formData.selectedDate"
    />
    <form-input
      placeholder="Password"
      type="password"
      name="password"
      v-model="formData.password"
      required
    />
    <form-input
      placeholder="Confirm password"
      type="password"
      name="passwordConfirm"
      v-model="formData.passwordConfirm"
      ref="passwordConfirmRef"
      required
    />
    <form-checkbox
      v-model="formData.termsOfService"
      name="terms-of-service"
      required
    >
      I agree to abide by the
      <router-link :to="{ name: 'terms-of-service' }" target="_blank"
        >terms of service</router-link
      >.
    </form-checkbox>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { authAreas } from '@/services/auth.service';
import authMixin from '@/mixins/auth.mixin';

export default {
  name: authAreas.createUser,
  mixins: [authMixin],
  methods: {
    ageCheckHandler() {
      if (!this.formData.ageCheck) {
        this.formData.selectedDate = null;
      }
    },
    nYearsAgo(n) {
      const date = new Date();
      date.setFullYear(date.getFullYear() - n);
      return date;
    },
    ...mapActions(['addFlashMessage'])
  },
  computed: {
    fifteenYearsAgo() {
      const date = this.nYearsAgo(15);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() +
        1}`;
    }
  },
  watch: {
    ['formData.selectedDate'](value) {
      const selectedDate = new Date(...value.split('.').reverse());
      if (selectedDate > this.nYearsAgo(13)) {
        this.addFlashMessage({
          message: 'User must be at least 13 years of age.',
          type: 'failure'
        });
        this.$emit('invalid-date', true);
      } else if (selectedDate < this.nYearsAgo(18)) {
        this.addFlashMessage({
          message: 'This date is already over 18 years in age.',
          type: 'failure'
        });
        this.$emit('invalid-date', true);
      } else {
        this.$emit('invalid-date', false);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .checkbox {
    margin: var(--element-margin-m) 0;
    align-self: flex-start;
    &__icon:before {
      border-bottom: 2px solid var(--color-white);
      border-right: 2px solid var(--color-white);
    }
  }
  .date-dropdown-container {
    margin-bottom: var(--element-margin-s);
  }
}
</style>

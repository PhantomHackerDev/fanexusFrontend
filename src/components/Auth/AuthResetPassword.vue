<template>
  <div class="auth-form-content reset-password">
    <form-input type="password" name="password" v-model="formData.password" />
    <form-input
      type="password"
      name="passwordConfirm"
      v-model="formData.passwordConfirm"
    />
  </div>
</template>

<script>
import { authAreas } from '@/services/auth.service';
import authMixin from '@/mixins/auth.mixin';

export default {
  name: authAreas.resetPassword,
  mixins: [authMixin]
};
</script>

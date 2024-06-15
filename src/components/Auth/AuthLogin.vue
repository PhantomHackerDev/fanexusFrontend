<template>
  <div class="auth-form-content login">
    <form-input
      placeholder="Your email address"
      type="email"
      name="email"
      v-model="formData.email"
      required
    />
    <form-input
      placeholder="Password"
      type="password"
      name="password"
      v-model="formData.password"
      required
    />
  </div>
</template>

<script>
import { authAreas } from '@/services/auth.service';
import authMixin from '@/mixins/auth.mixin';

export default {
  name: authAreas.login,
  mixins: [authMixin]
};
</script>

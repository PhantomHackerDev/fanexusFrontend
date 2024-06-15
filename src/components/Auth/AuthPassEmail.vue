<template>
  <div class="auth-form-content pass-email">
    <form-input type="email" name="email" v-model="formData.email" />
    <form-input
      type="email"
      name="emailConfirm"
      v-model="formData.emailConfirm"
    />
  </div>
</template>

<script>
import { authAreas } from '@/services/auth.service';
import authMixin from '@/mixins/auth.mixin';

export default {
  name: authAreas.passEmail,
  mixins: [authMixin]
};
</script>

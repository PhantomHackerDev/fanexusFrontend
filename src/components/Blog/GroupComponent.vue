<template>
  <div class="group">
    <div class="group-wrapper">
      <div class="group-title">
        <!--  @TODO make data dynamic -->
        <router-link
          :to="{
            name: groupComponentType,
            params: { name: link || id, id: link ? undefined : 'id' }
          }"
          class="group-link"
        >
          <author-title
            :name="name"
            :id="id"
            :link="link"
            :blogParams="{ name: link || id, id: link ? undefined : 'id' }"
            :date="date"
            imageSize="md"
            :image="image"
          >
            <span class="group-title__text" v-if="activityName">
              {{ activityName }} {{ date | dateFormat }}
            </span>
          </author-title>
        </router-link>
      </div>
      <div v-if="userHasEditPermissions" class="group-btns">
        <dots-button
          :isAddingUser="isAddingUser"
          @add="$emit('add', id)"
          @delete="$emit('delete', id)"
          :options="options"
          :userHasEditPermissions="userHasEditPermissions"
        />
      </div>
      <div v-if="buttonType" class="group-btn-action-area">
        <div class="group-btn-action" @click="handleButtonAction">
          {{ groupComponentActions[buttonType][buttonAction].label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DotsButton from '~common/Buttons/DotsButton';
import AuthorTitle from '~common/AuthorTitle';
import { isValidDate } from '@/filters/date.filter';
import { groupComponentActions } from '@/services/Blog/blog.service';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    AuthorTitle,
    DotsButton
  },
  props: {
    id: {
      type: [Number, String]
    },
    link: {
      type: [Number, String]
    },
    groupComponentType: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      /*@TODO preventing error. switch to true*/
      required: false,
      default: require('@/assets/img/png/Image_29.png')
    },
    isAddingUser: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    bottomText: {
      type: String
    },
    date: {
      type: String
    },
    activityName: {
      type: String
    },
    userHasEditPermissions: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array
    },
    buttonType: {
      type: String
    }
  },
  data() {
    return {
      dropdownShow: false,
      groupComponentActions,
      buttonPressed: false
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownShow = !this.dropdownShow;
    },
    /*@TODO revise click outside*/
    handleActionDropdownClose() {
      this.dropdownShow = false;
    },
    async handleButtonAction() {
      await groupComponentActions[this.buttonType][this.buttonAction].action(
        this.id,
        this.groupComponentType
      );
      this.buttonPressed = !this.buttonPressed;
    }
  },
  computed: {
    isValidDate() {
      return isValidDate(this.date);
    },
    getBlogPostParams() {
      return { ...this.$route.params, postId: this.data.id };
    },
    buttonAction() {
      return this.buttonPressed ? 'create' : 'destroy';
    },
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    ...mapGetters(['activeAliasBlogId'])
  }
};
</script>
<style lang="scss" scoped>
.group {
  &-wrapper {
    padding: var(--element-padding-l);
    display: flex;
    background-color: var(--BG-blog-post);
    justify-content: space-between;
    border-radius: var(--border-radius);
  }
  &-title {
    color: var(--text-primary);
    ::v-deep a {
      color: var(--text-primary);
    }
    &__text {
      font-size: var(--size-regular);
    }
  }

  &-btn-action {
    color: var(--text-primary);
    border-radius: var(--border-radius);
    border: var(--border-width-default) solid var(--border-button-select);
    padding: var(--element-padding-xs);
    cursor: pointer;

    &-area {
      margin-left: var(--element-margin-s);
    }
  }

  &-link {
    text-decoration: none;
  }
}
</style>

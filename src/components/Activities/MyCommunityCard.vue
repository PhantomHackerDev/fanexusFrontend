<template>
  <div class="my-community">
    <div class="my-community__image">
      <router-link
        class="my-community__link"
        :to="{ name: communityRoot, params: { name: data.link || data.id } }"
      >
        <img :src="src" :alt="communityName" />
      </router-link>
    </div>

    <div class="my-community__footer">
      <div class="my-community__text">
        <router-link
          class="my-community__link"
          :to="{ name: communityRoot, params: { name: data.link || data.id } }"
        >
          <span class="my-community__name">
            {{ communityName }}
          </span>
        </router-link>
        <span class="my-community__members" v-if="membersCount"
          >{{ membersCount }} member(s)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { communityRoot } from '@/services/Community/community.service';

export default {
  props: {
    src: {
      type: String,
      default: require('@/assets/img/png/Image_8.png')
    },
    data: {
      type: Object
    },
    communityName: {
      type: String
    },
    membersCount: {
      type: String
    }
  },
  data() {
    return {
      communityRoot
    };
  }
};
</script>
<style lang="scss" scoped>
.my-community {
  display: flex;
  flex-direction: column;
  height: 150px;
  border-radius: var(--border-radius);
  background-color: var(--BG-blog-post);
  transition: var(--transition-default);
  &:hover {
    box-shadow: var(--box-shadow);
  }

  &__image {
    height: 50%;
    border-radius: var(--border-radius);
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      display: block;
      object-position: top;
    }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 50%;
    padding: var(--element-padding-m) var(--element-padding-l);
  }

  &__text {
    color: var(--text-primary);
    font-family: 'OpenSans-Bold', sans-serif;
    font-size: var(--size-regular);
    max-width: 100%;
    overflow: hidden;
  }

  &__members {
    display: block;
    font-family: 'OpenSans-Regular', sans-serif;
    margin-top: var(--element-margin-m);
    color: var(--tab-normal);
    font-size: var(--size-button);
  }

  &__link {
    text-decoration: none;
    color: var(--text-primary);
  }

  &__name {
    white-space: nowrap;
  }
}
</style>

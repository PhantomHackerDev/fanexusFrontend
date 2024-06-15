<template>
  <div class="tag-edit" v-if="mounted">
    <div class="tag-edit__wrapper">
      <flash-message v-if="success">{{ successMessage }}</flash-message>
      <form class="tag-edit__form" @submit.prevent="submitTagEdit" ref="form">
        <!-- @TODO fix input borders -->
        <!-- add input labels, remove headers -->
        <show-all-button
          class="tag-edit__link-back"
          @click.native="goToTag(name)"
          text="Back to tag page"
        />
        <form-input
          class="tag-edit__input"
          labelText="Tag name"
          name="tag-name"
          placeholder="Tag name"
          v-model="tagName"
        />
        <h4 class="tag-edit__title">Parent tags:</h4>
        <tag-input
          class="tag-edit__input"
          name="parent-tags"
          placeholder="Add parent tag"
          :list="parentTags"
          @list-change="updateList('parentTags', $event)"
          :no-locked-tags="!(isTagWrangler || isSuperTagWrangler)"
        />
        <h4 class="tag-edit__title">Child tags:</h4>
        <tag-input
          class="tag-edit__input"
          name="child-tags"
          placeholder="Add child tag"
          :list="childTags"
          @list-change="updateList('childTags', $event)"
          :no-locked-tags="!(isTagWrangler || isSuperTagWrangler)"
        />
        <h4 class="tag-edit__title">Synonyms:</h4>
        <tag-input
          class="tag-edit__input"
          name="synonyms"
          placeholder="Add synonym"
          :synonyms="true"
          :list="synonyms"
          @list-change="updateList('synonyms', $event)"
        />
        <h4 class="tag-edit__title">Description:</h4>
        <form-rich-text-editor
          v-model="description"
          placeholder="Tag description"
          @space-remaining="spaceRemaining = $event"
        />
        <template v-if="(isTagWrangler || isSuperTagWrangler) && !newTag">
          <form-toggler
            v-model="isLocked"
            class="tag-edit__toggler"
            context="settings"
            >Lock tag</form-toggler
          >
        </template>
        <div class="tag-edit__buttons">
          <descendant-loop-warning
            v-if="descendantLoops.length"
            :descendant-loops="descendantLoops"
          />
          <form-button
            class="tag-edit__cancel-btn"
            @click.native.prevent="getData"
            text="Reset"
          />
          <form-button
            class="tag-edit__save-btn"
            type="submit"
            text="Save"
            :disabled="success || !tagName.length || spaceRemaining < 0"
          />
        </div>
      </form>
      <form
        class="tag-edit__reassign-form"
        @submit.prevent="reassignTag"
        ref="reassignForm"
        v-if="reassigning"
      >
        <div class="tag-edit__title">
          Replace this tag on all blog posts, blogs, and communities with:
        </div>
        <p class="note">
          The tag display synonym on blog posts, blogs, and communities will
          remain the same.
        </p>
        <tag-input
          :single="true"
          :list="reassignTarget ? [reassignTarget] : []"
          :allow-new="false"
          placeholder="Reassign to"
          @input="reassignTarget = $event"
        />
        <div class="tag-edit__reassign-button">
          <form-button
            class="tag-edit__cancel-btn"
            @click.native.prevent="endReassign"
            text="Cancel"
          />
          <form-button
            class="tag-edit__save-btn"
            type="submit"
            text="Replace"
            :disabled="!reassignTarget"
          />
        </div>
      </form>
      <div class="tag-edit__reassign-form" v-else-if="isSuperTagWrangler">
        <form-button
          class="tag-edit__save-btn"
          type="submit"
          text="Reassign tag"
          @click.native.prevent="reassigning = true"
        />
      </div>
      <form class="tag-edit__delete-form" v-if="isSuperTagWrangler">
        <form-button
          class="tag-edit__save-btn"
          type="submit"
          text="Delete this tag"
          @click.native.prevent="deleteTag"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  getTag,
  createTag,
  editTag,
  reassignTag,
  deleteTag,
  tagLengthLimit,
  tagLengthErrorMessage
} from '@/services/tag.service';
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import FormToggler from '~common/Fields/FormToggler';
import TagInput from '~common/Fields/TagInput';
import ShowAllButton from '~common/Buttons/ShowAllButton';
import tagListMixin from '@/mixins/tag-list.mixin';
import formMessagesMixin from '@/mixins/form-messages.mixin';
import FormRichTextEditor from '~common/Fields/FormRichTextEditor';
import DescendantLoopWarning from '~common/DescendantLoopWarning';

export default {
  props: {
    name: {
      default: '',
      type: [Number, String]
    }
  },
  components: {
    FormButton,
    FormInput,
    FormToggler,
    TagInput,
    ShowAllButton,
    FormRichTextEditor,
    DescendantLoopWarning
  },
  data() {
    return {
      newTag: false,
      tagName: '',
      description: '',
      id: null,
      parentTags: [],
      childTags: [],
      synonyms: [],
      isLocked: null,
      descendantLoops: [],
      mounted: false,
      tagCounter: 0,
      reassigning: false,
      reassignTarget: null,
      spaceRemaining: 0
    };
  },
  mixins: [tagListMixin, formMessagesMixin],
  computed: {
    tagData() {
      return {
        name: this.tagName,
        description: this.description,
        parentTags: this.parentTags.map(({ name }) => name),
        childTags: this.childTags.map(({ name }) => name),
        synonyms: this.synonyms.map(({ name }) => name),
        isLocked: this.isLocked
      };
    },
    ...mapState({
      isTagWrangler: state => state.auth.userData.tagWrangler,
      isSuperTagWrangler: state => state.auth.userData.superTagWrangler
    })
  },
  methods: {
    updateList(list, newList) {
      this[list] = newList;
    },
    async getData() {
      try {
        const {
          tag: { id, name, description, synonyms, isLocked },
          parentTags,
          childTags,
          loops
        } = await getTag(this.name);
        this.id = id;
        this.tagName = name;
        this.description = description;
        this.parentTags = this.tagObjects(parentTags);
        this.childTags = this.tagObjects(childTags);
        this.synonyms = this.tagObjects(synonyms);
        this.isLocked = isLocked;
        this.descendantLoops = loops;
      } catch (e) {
        this.newTag = true;
        this.tagName = this.name;
      }
    },
    tagObjects(tagNames) {
      return tagNames.map(tagName => ({
        name: tagName,
        id: -++this.tagCounter
      }));
    },
    async submitTagEdit() {
      try {
        if (this.newTag) {
          this.checkTagLength(this.tagName);
          const payload = [this.tagName, this.tagData];
          await createTag(...payload);
          this.newTag = false;
        } else {
          if (this.tagName !== this.name) {
            this.checkTagLength(this.name);
          }
          const payload = [this.name, this.tagData];
          await editTag(...payload);
        }
        this.showSuccess();
        if (this.tagName !== this.name) {
          this.$router.push({
            name: 'tag-edit',
            params: {
              name: this.tagName
            }
          });
        } else {
          this.getData();
        }
      } catch (e) {
        this.addFlashMessage({ message: e, type: 'failure' });
      }
    },
    checkTagLength(tagName) {
      const tagByteLength = new TextEncoder().encode(tagName).length;
      if (tagByteLength > tagLengthLimit) {
        throw new Error(tagLengthErrorMessage(tagByteLength));
      }
    },
    async reassignTag() {
      this.setAction({
        message:
          'This is a potentially destructive operation. Are you sure you wish to proceed?',
        action: async () => {
          const payload = [this.id, this.reassignTarget.id];
          await reassignTag(...payload);
          this.endReassign();
          this.addFlashMessage({
            message:
              'The tag has been replaced on all blog posts, blogs, and communities',
            link: {
              name: 'tagged-blog-posts',
              params: {
                tagNames: JSON.stringify([this.name])
              }
            },
            linkText: 'Check'
          });
        }
      });
    },
    endReassign() {
      this.reassigning = false;
      this.reassignTarget = null;
    },
    async deleteTag() {
      this.setAction({
        message: 'Are you sure?',
        action: async () => {
          await deleteTag(this.id);
          this.addFlashMessage({ message: 'Tag has been deleted.' });
          this.$router.push({ name: 'home' });
        }
      });
    },
    ...mapActions(['setAction', 'addFlashMessage'])
  },
  async mounted() {
    await this.getData();
    this.mounted = true;
  }
};
</script>
<style lang="scss" scoped>
/** @TODO revise styling */
.tag-edit {
  padding: var(--element-padding-l);
  overflow-y: auto;
  grid-area: content;

  &__wrapper {
    padding: var(--element-padding-s);
    border: var(--border-width-default) solid var(--border-block);
    border-radius: var(--border-radius);
    background-color: var(--BG-blog-post);
    max-width: var(--width-large);
    min-height: 100%;
    margin: 0 auto;
  }

  &__link-back {
    margin-bottom: var(--element-margin-xs);
  }

  h4 {
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xs);
  }

  &__input {
    margin-bottom: var(--element-margin-l);
    display: inline-block;
    border-radius: var(--border-radius);
  }

  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }

  &__buttons {
    border-top: var(--border-width-thin) solid var(--popular-blog-divider);
    padding-top: var(--element-padding-l);
  }

  &__title {
    font-size: var(--size-button);
    font-family: 'OpenSans-Bold', sans-serif;
    margin-bottom: var(--element-margin-s);
    color: var(--text-primary);
  }
  &__toggler {
    font-size: var(--size-button);
    padding-bottom: var(--element-padding-s);
  }

  &__reassign-form,
  &__delete-form {
    border-top: var(--border-width-thin) solid var(--popular-blog-divider);
    margin-top: var(--element-margin-l);
    padding-top: var(--element-padding-l);
  }

  &__reassign-button {
    margin-top: var(--element-margin-l);
  }
}

.note {
  font-size: var(--size-small);
  color: var(--text-primary);
}

::v-deep {
  input {
    background-color: var(--BG-blog-post);
  }
}
</style>

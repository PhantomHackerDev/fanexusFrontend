<template>
  <div class="submit-report">
    <modal
      class="submit-report-modal modal-overlay--centered"
      :settings="settings"
      @save="handleSave"
      :close-on-save="false"
      :action-disabled="reasonChoice === null"
    >
      <template slot="body">
        <h3 class="title-wrapper">Content being reported</h3>
        <p v-if="settings.isBlogPost == true">
          You are submitting a report for the post made by '{{
            settings.postingAlias
          }}' at {{ settings.updatedAt | dateFormat }}.
        </p>
        <p v-else>
          You are submitting a report for the comment made by '{{
            settings.postingAlias
          }}' at {{ settings.updatedAt | dateFormat }}.
        </p>
        <h3 class="title-wrapper">Report category</h3>
        <div class="report-reason-selection">
          <form-select
            title="Select a reason"
            :options="reportReasons"
            v-model="reasonChoice"
            optionsType="text-single"
            class="report-reason-selection__select"
            name="report-reason-select"
            @select="handleSelect"
          />
        </div>
        <br />
        <div>
          <h3 class="title-wrapper">Additional information</h3>
          <p>Please provide any additional information or comments.</p>
          <form-input name="comments" type="textarea" v-model="comments">
          </form-input>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Modal from '~common/Modal';
import FormSelect from '~common/Fields/FormSelect';
import FormInput from '~common/Fields/FormInput';
import { submitReport } from '@/services/report.service';

export default {
  components: {
    Modal,
    FormInput,
    FormSelect
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      reasonChoice: null,
      comments: null,
      reportReasons: [
        {
          label: 'Harassment/Block Evasion/Doxxing',
          name: 'Harassment/Block Evasion/Doxxing'
        },
        {
          label: 'Repost/Copyright',
          name: 'Repost/Copyright'
        },
        {
          label: 'Illegal Content',
          name: 'Illegal Content'
        },
        {
          label: 'Gore/Violence',
          name: 'Gore/Violence'
        },
        {
          label: 'Suicidal Behavior/Self-Harm',
          name: 'Suicidal Behavior/Self-Harm'
        },
        {
          label: 'Missing Mandatory Tags',
          name: 'Missing Mandatory Tags'
        },
        {
          label: 'Tag Vandalism',
          name: 'Tag Vandalism'
        },
        {
          label: 'Inappropriate Conduct/Discrimination/Hate Speech',
          name: 'Inappropriate Conduct/Discrimination/Hate Speech'
        },
        {
          label: 'Impersonation/Catfishing/Minor with Adult Account',
          name: 'Impersonation/Catfishing/Minor with Adult Account'
        },
        {
          label: 'Spam/Misinformation/Misleading Links',
          name: 'Spam/Misinformation/Misleading Links'
        }
      ]
    };
  },
  methods: {
    ...mapActions(['addFlashMessage']),
    async handleSave() {
      const payload = {
        violationCategory: this.reasonChoice.name,
        content: `Report submitted with alias: ${this.activeAliasId ||
          'Anonymous'}<br />${
          this.settings.isBlogPost ? 'Poster' : 'Commenter'
        } reported: ${this.settings.postingAlias}<br />${
          this.settings.isBlogPost ? 'Post' : 'Comment'
        } timestamp: ${this.settings.updatedAt}<br />Post Id: ${
          this.settings.postId
        }<br />${
          this.settings.commentId
            ? `Comment Id: ${this.settings.commentId}<br />`
            : ''
        }Additional information: ${this.comments}`
      };
      const result = await submitReport(payload);
      this.addFlashMessage({
        message: 'Report submitted',
        link: null
      });
      this.$emit('submit');
      return result;
    },
    handleSelect(reasonSelected) {
      this.reasonChoice = reasonSelected;
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  }
};
</script>
<style lang="scss" scoped>
.report-reason-selection {
  margin: var(--element-margin-m) 0;
  display: relative;

  &__select {
    width: 100%;
  }
}

.submit-report {
  overflow: auto;
  background-color: var(--BG-primary);
}

.title-wrapper {
  font-size: var(--size-regular);
  font-family: 'OpenSans-Bold', sans-serif;
  margin-bottom: var(--element-margin-m);
  color: var(--text-primary);
  border-top: var(--border-width-thin) solid var(--popular-blog-divider);
  padding-top: var(--element-padding-l);
}

::v-deep {
  .form-input {
    input {
      background-color: var(--BG-blog-post);
    }
  }

  p {
    font-size: var(--size-regular);
    font-family: 'OpenSans', sans-serif;
    margin-bottom: var(--element-margin-m);
    color: var(--text-primary);
  }

  textarea {
    min-height: 214px;
  }

  .modal {
    margin: 0 auto;
    width: var(--width-medium);
    overflow: visible;

    &-content {
      margin: 0;
    }
  }
  .modal-header,
  .modal-footer {
    background-color: var(--BG-create-post-modal);
  }
  .modal-body {
    background-color: var(--BG-create-post-modal-body);
  }
}
</style>

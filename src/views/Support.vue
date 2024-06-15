<template>
  <div class="support">
    <iframe
      title="Feedback Form"
      class="freshwidget-embedded-form"
      id="freshwidget-embedded-form"
      src="https://morsecodexgigas.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=No"
    >
    </iframe>
  </div>
</template>

<style lang="scss" scoped>
.support {
  grid-area: content;
  overflow: auto;
  background-color: var(--color-white);
  padding: var(--element-padding-l);
}

.freshwidget-embedded-form {
  height: 500px;
  width: 100%;
  border: none;
  overflow: hidden;
}
</style>

<template>
  <p>{{ item.subject }}</p>

  <p>
    <strong>{{ item.from }}</strong>
  </p>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    return {};
  }
};
</script>

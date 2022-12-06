<template>
  <div>
    <h3>All emails: {{ emails.length }}</h3>
  </div>
</template>

<script>
import useEmailSelection from "../../composables/use-email-selection";
import { ref } from "vue";
export default {
  props: {
    emails: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    return {};
  }
};
</script>

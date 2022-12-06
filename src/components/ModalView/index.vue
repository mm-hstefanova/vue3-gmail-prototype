<template>
  <div class="modal" @closeModal="closeModal">
    <div class="overlay" @click="closeModal"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount } from "vue";
import useKeyDown from "@/composables/use-keydown";

export default {
  setup(props, { emit }) {
    const closeModal = event => emit("closeModal");

    useKeyDown([{ key: "Escape", fn: closeModal }]);

    return {
      closeModal
    };
  }
};
</script>

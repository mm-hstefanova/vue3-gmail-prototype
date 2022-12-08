<template>
  <div>
    <div>
      <button @click="toggleArchive">
        {{ item.archive ? "Move to Inbox (e)" : "Archive (e)" }}
      </button>
      <button @click="toggleRead">
        {{ item.read ? "Mark Read (r)" : "Mark unread (r)" }}
      </button>
      <button @click="goNewer" :disabled="isNewest">Newer (j)</button>
      <button @click="goOlder" :disabled="isOldest">Older (k)</button>
      <button @click="closeModal">X</button>
    </div>

    <p>Read: {{ item.read }}</p>

    <p>{{ item.subject }}</p>

    <p>
      <strong>{{ item.from }}</strong>
    </p>

    <div>
      <button @click="updateEmail">Save Changes</button>
    </div>
  </div>
</template>

<script>
import useKeyDown from "@/composables/use-keydown";

export default {
  props: {
    item: {
      type: Object,
      default: null,
      required: true
    },
    isNewest: {
      type: Boolean,
      default: false
    },
    isOldest: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    /**
     * emit one event with different options
     * */

    const toggleRead = () => {
      emit("changeEmail", { toggleRead: true, save: true });
    };

    const toggleArchive = () => {
      emit("changeEmail", { toggleArchive: true, save: true });
    };

    const goNewer = () => {
      emit("changeEmail", { goNewer: true });
    };

    const goOlder = () => {
      emit("changeEmail", { goOlder: true });
    };

    const closeModal = () => {
      emit("changeEmail", { closeModal: true });
    };

    const goNewerAndArchive = () => {
      emit("changeEmail", { changeIndex: -1, toggleArchive: true, save: true });
    };

    const goOlderAndArchive = () => {
      emit("changeEmail", { changeIndex: 1, toggleArchive: true, save: true });
    };

    useKeyDown([
      {
        key: "r",
        fn: toggleRead
      },
      {
        key: "e",
        fn: toggleArchive
      },
      {
        key: "j",
        fn: goNewer
      },
      {
        key: "k",
        fn: goOlder
      },
      {
        key: "[",
        fn: goNewerAndArchive
      },
      {
        key: "]",
        fn: goOlderAndArchive
      },
      {
        key: "Escape",
        fn: closeModal
      }
    ]);

    return {
      toggleRead,
      toggleArchive,
      goNewer,
      goOlder,
      closeModal
    };
  }
};
</script>

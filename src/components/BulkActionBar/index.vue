<template>
  <div class="d-flex">
    <div style="padding: 5px">
      <input
        type="checkbox"
        :checked="allEmailsSelected"
        @click="selectAll"
        :class="[someEmailsSelected ? 'partial-check' : '']"
      />
    </div>

    <button @click="emailSelection.markRead" :disabled="emailSelection.allEmailsAreRead">
      Mark Read
    </button>

    <button @click="emailSelection.markUnread" :disabled="emailSelection.allEmailsAreUnread">
      Mark Unread
    </button>

    <button
      @click="emailSelection.markArchive"
      :disabled="noneSelected"
      v-if="selectedScreen == 'inbox'"
    >
      Archive
    </button>

    <button v-else @click="emailSelection.undoArchive" :disabled="noneSelected">
      Undo Archive
    </button>
  </div>
</template>

<script lang="ts">
import useEmailSelection from "../../composables/use-email-selection";
import type { Email } from '@/types'
import { ref, computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    emails: {
      type: Array,
      default: () => []
    },
    selectedScreen: {
      type: String,
      default: "inbox"
    }
  },
  setup(props) {
    const emailSelection = useEmailSelection();

    const numberSelected = computed(() => emailSelection.emails.size);
    const numberEmails = computed(() => props.emails.length);

    const noneSelected = computed(() => numberSelected.value === 0);
    const allEmailsSelected = computed(() => numberSelected.value === numberEmails.value);
    const someEmailsSelected = computed(
      () => numberSelected.value > 0 && numberSelected.value < numberEmails.value
    );

    const selectAll = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    };

    return {
      emailSelection,
      selectAll,
      someEmailsSelected,
      allEmailsSelected,
      noneSelected
    };
  }
});
</script>

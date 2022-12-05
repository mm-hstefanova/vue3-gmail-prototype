<template>
  <div v-if="loading">Loading ...</div>
  <div v-else>
    <div class="d-flex">
      <div style="padding: 5px">
        <input type="checkbox" />
      </div>

      <div>
        <button>Mark Read</button>
        <button>Mark Unread</button>
        <button>Archive</button>
      </div>
    </div>

    <table class="mail-table">
      <tbody>
        <tr v-for="email in items" :key="email.id" :class="[email.read ? 'read' : '']">
          <td>
            <input
              tabindex="0"
              type="checkbox"
              v-model="email.read"
              @click="email.read = !email.read"
            />
          </td>

          <td>
            {{ email.from }}
          </td>

          <td class="clickable" @click="openModal(email)">
            <strong>{{ email.subject }}</strong>
          </td>

          <td class="date">
            {{ format(new Date(email.sentAt), "MMM dd yyyy") }}
          </td>

          <td>
            <button @click="email.archived = true">
              Archive
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalView v-if="openedEmail" @closeModal="closeModal">
      <MailView
        :item="openedEmail"
        :isNewest="isNewest"
        :isOldest="isOldest"
        @changeEmail="changeEmail"
      />
    </ModalView>
  </div>
</template>

<script>
import { format } from "date-fns";
import { ref, computed, watch } from "vue";
import MailView from "../MailView";
import ModalView from "../ModalView";

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MailView,
    ModalView
  },
  setup(props) {
    const isNewest = ref(false);
    const isOldest = ref(false);

    const openedEmail = ref(null);
    const openedEmailIndex = computed(() =>
      props.items.findIndex(item => item.id === openedEmail.value?.id)
    );

    function openModal(email) {
      email.read = true;
      // update in db - it's read
      updateEmail(email);

      openedEmail.value = email;
    }

    function closeModal() {
      reset();
    }

    function reset() {
      openedEmail.value = null;
      isNewest.value = false;
      isOldest.value = false;
    }

    function showNewerEmail() {
      if (isOldest.value) isOldest.value = false;
      openedEmail.value = props.items[openedEmailIndex.value - 1];
    }

    function showOlderEmail() {
      if (isNewest.value) isNewest.value = false;
      openedEmail.value = props.items[openedEmailIndex.value + 1];
    }

    function changeEmail({ toggleRead, toggleArchive, save, closeModal, goNewer, goOlder }) {
      if (toggleRead) {
        openedEmail.value.read = !openedEmail.value.read;
      }

      if (toggleArchive) {
        openedEmail.value.archive = !openedEmail.value.archive;
      }

      if (goNewer && !isNewest.value) {
        showNewerEmail();
      }
      if (goOlder && !isOldest.value) {
        showOlderEmail();
      }

      if (save) {
        updateEmail(openedEmail.value);
      }

      if (closeModal) {
        reset();
      }
    }

    function updateEmail(email) {
      // axios request to update the current email
      //axios.put('url', email)
    }

    watch(
      () => openedEmailIndex.value,

      value => {
        if (!openedEmailIndex.value) {
          isNewest.value = true;

          return;
        }

        if (value == props.items.length - 1) {
          isOldest.value = true;
        }
      }
    );

    return {
      format,
      openedEmail,
      openModal,
      isNewest,
      isOldest,
      changeEmail,
      updateEmail,
      closeModal
    };
  }
};
</script>

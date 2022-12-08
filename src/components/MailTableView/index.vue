<template>
  <div v-if="loading">Loading ...</div>
  <div v-else>
    <h3>{{ emailSelection.emails.size }} of {{ filteredEmails.length }} emails selected</h3>

    <div>
      <button :disabled="selectedScreen == 'inbox'" @click="selectScreen('inbox')">
        Inbox
      </button>
      <button :disabled="selectedScreen == 'archived'" @click="selectScreen('archived')">
        Archived
      </button>
    </div>
    <BulkActionBar :emails="filteredEmails" :selectedScreen="selectedScreen" />

    <table class="mail-table" v-if="!!filteredEmails.length">
      <tbody>
        <tr v-for="email in filteredEmails" :key="email.id" :class="[email.read ? 'read' : '']">
          <td>
            <input
              tabindex="0"
              type="checkbox"
              :checked="emailSelection.emails.has(email)"
              @click="emailSelection.toggle(email)"
              :class="[emailSelection.emails.has(email) ? 'selected' : '']"
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
            <button
              @click="
                selectedScreen == 'inbox' ? (email.archived = true) : (email.archived = false)
              "
            >
              {{ selectedScreen == "inbox" ? "Archive" : "Undo Archive" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>No new or archived emails.</div>
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
import { ref, computed, watch, reactive } from "vue";
import MailView from "../MailView";
import ModalView from "../ModalView";
import BulkActionBar from "../BulkActionBar";
import useEmailSelection from "@/composables/use-email-selection";

export default {
  props: {
    emails: {
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
    ModalView,
    BulkActionBar
  },
  setup(props) {
    const emailSelection = useEmailSelection();

    /**
     * Switch between screens
     */
    const selectedScreen = ref("inbox");

    const selectScreen = newScreen => {
      // clear the selections from the previous screen
      emailSelection.emails.clear();
      selectedScreen.value = newScreen;
    };
    const filteredEmails = computed(() => {
      if (selectedScreen.value == "inbox") {
        return props.emails.filter(email => !email.archived);
      } else {
        return props.emails.filter(email => email.archived);
      }
    });

    /**
     * Single Email Actions
     * */

    const isNewest = ref(false);
    const isOldest = ref(false);

    const openedEmail = ref(null);
    const openedEmailIndex = computed(() =>
      props.emails.findIndex(item => item.id === openedEmail.value?.id)
    );

    function openModal(email) {
      email.read = true;
      // update in db
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
      openedEmail.value = props.emails[openedEmailIndex.value - 1];
    }

    function showOlderEmail() {
      if (isNewest.value) isNewest.value = false;
      openedEmail.value = props.emails[openedEmailIndex.value + 1];
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

        if (value == props.emails.length - 1) {
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
      closeModal,
      emailSelection,
      filteredEmails,
      selectedScreen,
      selectScreen
    };
  }
};
</script>
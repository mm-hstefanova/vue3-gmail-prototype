<template>
  <div v-if="loading">Loading ...</div>
  <div v-else>
    <BulkActionBar :emails="items" />

    <h3>Selected emails: {{ emailSelection.emails.size }}</h3>

    <div class="d-flex">
      <div style="padding: 5px">
        <input type="checkbox" v-model="allEmailsSelected" />
      </div>

      <div>
        <button @click="markRead" :disabled="noneSelected || !isUnread">
          Mark Read
        </button>
        <button @click="markUnread" :disabled="noneSelected || hasRead">Mark Unread</button>
        <button @click="markArchive" :disabled="noneSelected">Archive</button>
      </div>
    </div>

    <table class="mail-table">
      <tbody>
        <tr v-for="email in items" :key="email.id" :class="[email.read ? 'read' : '']">
          <td>
            <input
              tabindex="0"
              type="checkbox"
              :selected="emailSelection.emails.has(email)"
              @click="emailSelection.toggle(email)"
              :class="[emailSelection.emails.has(email) ? 'selected' : '']"
            />

            <span>read: {{ emailSelection.wasRead }}</span>
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

    <div>has read: {{ hasRead }}</div>
    <div>has unread: {{ isUnread }}</div>

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
    ModalView,
    BulkActionBar
  },
  setup(props) {
    /**
     * Single Email Actions
     * */

    const isNewest = ref(false);
    const isOldest = ref(false);

    const openedEmail = ref(null);
    const openedEmailIndex = computed(() =>
      props.items.findIndex(item => item.id === openedEmail.value?.id)
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

    /**
     * Multiselect logic
     **/
    const noneSelected = computed(() => !emailSelection.emails.size);
    const emailSelection = useEmailSelection();
    const allEmailsSelected = ref(false);
    const someEmailsSelected = ref([...emailSelection.emails]);
    // TODO:
    // DISABLE THE BUTTONS DEPENDING ON SELECTED EMAIL - READ / UNREAD
    const isUnread = computed(() => someEmailsSelected.value.some(email => !email.read));
    const hasRead = computed(() => someEmailsSelected.value.some(email => email.read));
    // END TODO
    const markRead = () => {
      return emailSelection.emails.forEach(email => {
        email.read = true;
        return email;
      });
    };

    const isMarkReadDisabled = ref(false);

    const markUnread = () => {
      return emailSelection.emails.forEach(email => {
        email.read = false;
        return email;
      });
    };

    const markArchive = () => {
      return emailSelection.emails.forEach(email => {
        email.archived = true;
        return email;
      });
    };

    // select all
    watch(
      () => allEmailsSelected.value,
      value => {
        if (value) {
          props.items.forEach(email => {
            emailSelection.emails.add(email);
            return email;
          });
        } else {
          emailSelection.emails.clear();
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
      allEmailsSelected,
      noneSelected,
      emailSelection,
      markRead,
      markUnread,
      markArchive,
      someEmailsSelected,
      hasRead,
      isUnread
    };
  }
};
</script>

<template>
  <div v-if="loading">Loading ...</div>
  <div v-else>
    <table class="mail-table">
      <tbody>
        <tr
          v-for="email in items"
          :key="email.id"
          :class="['clickable', email.read ? 'read' : '']"
          @click="openEmail(email)"
        >
          <td>
            <input type="checkbox" v-model="email.read" @click="email.read = !email.read" />
          </td>

          <td>
            {{ email.from }}
          </td>

          <td>
            <strong>{{ email.subject }}</strong>
          </td>

          <td class="date">
            {{ format(new Date(email.sentAt), "MMM dd yyyy") }}
          </td>

          <td>
            <button @click="email.archived = true">Archive</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalView v-if="openedEmail" @closeModal="closeModal">
      <MailView :item="openedEmail" />
    </ModalView>
  </div>
</template>

<script>
import { format } from "date-fns";
import { ref } from "vue";
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
    const openedEmail = ref(null);

    function openEmail(email) {
      openedEmail.value = email;
    }

    function closeModal() {
      openedEmail.value = null;
    }

    return {
      format,
      openedEmail,
      openEmail,
      closeModal
    };
  }
};
</script>

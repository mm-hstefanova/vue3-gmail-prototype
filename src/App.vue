<template>
  <div id="app">
    <div class="container">
      <h1>VMail Inbox</h1>

      <MailTableView :emails="sortedEmails" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MailTableView from "./components/MailTableView/index.vue";
import axios from "axios";
import useEmailSelection from "./composables/use-email-selection";
import type { Email } from "@/types";

type DataShape = {
  emails: Email[];
  loading: boolean;
};
export default defineComponent({
  name: "App",
  components: {
    MailTableView,
  },
  // TODO: typescript - composable
  setup() {
    return { emailSelection: useEmailSelection() };
  },
  data(): DataShape {
    return {
      emails: [],
      loading: false,
    };
  },
  computed: {
    sortedEmails(): Email[] {
      return this.emails.sort((a, b) => {
        return a.sentAt < b.sentAt ? 1 : -1;
      });
    },
  },
  methods: {
    async getData() {
      this.loading = true;

      let response = axios
        .get(
          "https://mockend.com/mm-hstefanova/vue3-gmail-prototype/tree/updates-with-typescript-support/emails"
        )
        .then((res) => (this.emails = res.data));

      this.loading = false;
    },
  },
  mounted() {
    this.getData();
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* Global Styles */

button {
  font-size: 16px;
  padding: 8px;
  border-radius: 3px;
  margin: 5px 10px 5px 0px;
  cursor: pointer;
}

button:disabled {
  cursor: auto;
  opacity: 0.7;
}

button.selected {
  cursor: auto;
  color: black;
  border-color: black;
  border-width: 2px;
}

.clickable {
  cursor: pointer;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 2px;
  border: 1px solid #555;
  position: relative;
  vertical-align: middle;
  padding: 10px;
}

input[type="checkbox"].partial-check {
  background: #abc;
}

input[type="checkbox"]:checked {
  background: #679;
}

.mb-0 {
  margin-bottom: 0;
}

/* Modal */

.modal,
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
.overlay {
  opacity: 0.5;
  background-color: black;
}
.modal-card {
  position: relative;
  max-width: 80%;
  margin: auto;
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  min-height: 500px;
  z-index: 10;
  opacity: 1;
}

/* Email Modal */

.email-display {
  text-align: left;
}

/* Mail Table */
.container {
  max-width: 1000px;
  margin: auto;
}
.mail-table {
  width: 100%;
  border-collapse: collapse;
}
.mail-table tr.read {
  background-color: #eee;
}
.mail-table tr {
  height: 40px;
}
.mail-table td {
  border-bottom: 1px solid black;
  padding: 5px;
  text-align: left;
}
.mail-table tr:first-of-type td {
  border-top: 1px solid black;
}
.mail-table td p {
  max-height: 1.2em;
  overflow-y: hidden;
  margin: 0;
}

.mail-table td.date {
  width: 120px;
}

/* Bulk Action Bar */

.bulk-action-bar {
  width: 100%;
  max-width: 1000px;
  margin: auto;
  text-align: left;
  padding-bottom: 8px;
}

.bulk-action-bar input {
  margin: 5px;
}

.bulk-action-bar .checkbox {
  margin-right: 6px;
  margin-left: 3px;
}

.d-flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>

import { reactive, ref, computed } from "vue";
import type { Email } from "@/types";

// emails should be outside, otherwise,
// everytime we use useEmailSelection, a new instance is created
const emails = reactive(new Set<Email>());

const allEmailsAreRead = computed(() => [...emails].every((email: Email) => email.read));
const allEmailsAreUnread = computed(() => [...emails].every((email: Email) => !email.read));

const updateEmail = (fn: Function) => {
  emails.forEach((email) => {
    fn(email);
    // axios.put(`${PORT}/emails/${email.id}`, email)
  });
};

export const useEmailSelection = function () {
  const toggle = function (email: Email) {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  const clear = () => {
    emails.clear();
  };

  const addMultiple = (newEmails: Email[]) => {
    newEmails.forEach((email) => emails.add(email));
  };

  const markRead = () => {
    updateEmail((email: Email) => (email.read = true));
  };

  const markUnread = () => {
    updateEmail((email: Email) => (email.read = false));
  };

  const markArchive = () => {
    updateEmail((email: Email) => (email.archived = true));
    clear();
  };

  const undoArchive = () => {
    updateEmail((email: Email) => (email.archived = false));
    clear();
  };
  return {
    emails,
    toggle,
    allEmailsAreRead,
    allEmailsAreUnread,
    addMultiple,
    clear,
    markArchive,
    markRead,
    markUnread,
    undoArchive,
  };
};

export default useEmailSelection;

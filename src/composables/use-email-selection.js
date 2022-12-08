import { reactive, ref, computed } from "vue";
import { axios } from "axios";

// emails should be outside, otherwise,
// everytime we use useEmailSelection, a new instance is created
const emails = reactive(new Set());

const allEmailsAreRead = computed(() => [...emails].every(email => email.read));
const allEmailsAreUnread = computed(() => [...emails].every(email => !email.read));

const updateEmail = fn => {
  emails.forEach(email => {
    fn(email);
    // axios.put(`${PORT}/emails/${email.id}`, email)
  });
};

export const useEmailSelection = function() {
  const toggle = function(email) {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  const clear = () => {
    emails.clear();
  };

  const addMultiple = newEmails => {
    newEmails.forEach(email => emails.add(email));
  };

  const markRead = () => {
    updateEmail(email => (email.read = true));
  };

  const markUnread = () => {
    updateEmail(email => (email.read = false));
  };

  const markArchive = () => {
    updateEmail(email => (email.archived = true));
    clear();
  };

  const undoArchive = () => {
    updateEmail(email => (email.archived = false));
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
    undoArchive
  };
};

export default useEmailSelection;

import { reactive } from "vue";

// emails should be outside, otherwise,
// everytime we use useEmailSelection, a new instance is created
const emails = reactive(new Set());

export const useEmailSelection = function() {
  const toggle = function(email) {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  return {
    emails,
    toggle
  };
};

export default useEmailSelection;

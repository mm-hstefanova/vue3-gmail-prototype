import { onBeforeUnmount } from "vue";

export const useKeyDown = keyCombos => {
  const onKeyDown = event => {
    let keyCombo = keyCombos.find(kc => kc.key == event.key);

    if (!!keyCombo) {
      keyCombo.fn();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeyDown));
};

export default useKeyDown;

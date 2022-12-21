import { onBeforeUnmount } from "vue";
import type { KeyCombination } from "@/types";

export const useKeyDown = (keyCombos: KeyCombination[]) => {
  const onKeyDown = (event: KeyboardEvent) => {
    let keyCombo = keyCombos.find((kc: KeyCombination) => kc.key == event.key);

    if (!!keyCombo) {
      keyCombo.fn();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeyDown));
};

export default useKeyDown;

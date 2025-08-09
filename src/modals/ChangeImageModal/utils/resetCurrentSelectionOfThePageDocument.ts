export function resetCurrentSelectionOfThePageDocument() {
  const selection = document?.getSelection();
  if (selection) {
    selection.empty();
  }
}

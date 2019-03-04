export function dropTextFileOnTextArea(textAreaElement) {
  textAreaElement.addEventListener("drop", e => {
    let file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      textAreaElement.value = event.target.result;
    };
    reader.readAsText(file);
    e.preventDefault();
  });
}

export const executeScript = (scripts) => {
  window.electron.invoke("execute-script", scripts)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
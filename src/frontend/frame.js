
const closeBtn = document.getElementById('close')
const minimizeBtn = document.getElementById('minimize')
const maximizeBtn = document.getElementById('maximize')

closeBtn.addEventListener('click', () => {
    window.electron.close();
})

minimizeBtn.addEventListener('click', () => {
  window.electron.minimize();
})

maximizeBtn.addEventListener('click', () => {
    window.electron.maximize();
})
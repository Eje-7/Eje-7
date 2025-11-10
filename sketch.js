// Seleccionar elementos
const miVideo = document.getElementById('miVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');

// Evento para reproducir/pausar video
playPauseBtn.addEventListener('click', () => {
  if (miVideo.paused) {
    miVideo.play();
    playPauseBtn.textContent = 'Pausar Video';
  } else {
    miVideo.pause();
    playPauseBtn.textContent = 'Reproducir Video';
  }
});

 // Esperar a que el DOM cargue
    document.addEventListener("DOMContentLoaded", () => {
      // Seleccionamos todos los contenedores que tengan video y controles
      const containers = document.querySelectorAll(".video-container");

      containers.forEach((container) => {
        // buscamos el video y los controles DENTRO del mismo contenedor
        const video = container.querySelector(".video");
        const playBtn = container.querySelector(".play-btn");
        const muteBtn = container.querySelector(".mute-btn");
        const volumeSlider = container.querySelector(".volume-slider");

        // Inicializar el slider con el volumen actual del video
        // (y si el video está muted, lo reflejamos)
        const initialVolume = (video.volume !== undefined) ? Math.round(video.volume * 100) : 50;
        if (volumeSlider) volumeSlider.value = initialVolume;

        // Play / Pause
        if (playBtn && video) {
          const updatePlayIcon = () => {
            playBtn.textContent = video.paused ? "▶️" : "⏸️";
          };

          playBtn.addEventListener("click", () => {
            if (video.paused) video.play();
            else video.pause();
            updatePlayIcon();
          });

          // Actualizar icono si el usuario usa controles nativos o APIs externas
          video.addEventListener("play", updatePlayIcon);
          video.addEventListener("pause", updatePlayIcon);
          updatePlayIcon();
        }

        // Mute / Unmute
        if (muteBtn && video) {
          const updateMuteIcon = () => {
            muteBtn.textContent = video.muted ? "🔈" : "🔇";
          };

          muteBtn.addEventListener("click", () => {
            video.muted = !video.muted;
            updateMuteIcon();
          });

          video.addEventListener("volumechange", updateMuteIcon);
          updateMuteIcon();
        }

        // Control de volumen (slider)
        if (volumeSlider && video) {
          volumeSlider.addEventListener("input", (e) => {
            const val = Number(e.target.value);
            video.volume = val / 100;
            // si el usuario sube volumen, desmuteamos automáticamente
            if (video.muted && val > 0) {
              video.muted = false;
            }
          });

          // sincronizar slider si volumen cambia desde otra parte
          video.addEventListener("volumechange", () => {
            if (!volumeSlider.matches(":active")) {
              volumeSlider.value = Math.round(video.volume * 100);
            }
          });
        }
      });
    });
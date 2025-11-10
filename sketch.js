const video = document.getElementById("myVideo");

      function togglePlay() {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }

      function muteToggle() {
        video.muted = !video.muted;
      }

      function changeVolume(value) {
        video.volume = value / 100;
      }
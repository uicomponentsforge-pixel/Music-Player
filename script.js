    // ── Playlist data (sample tracks from sample-files.com) ──
    const tracks = [
        {
          title: "Music Sample (320 kbps)",
          artist: "Sample Files",
          src: "https://sample-files.com/downloads/audio/mp3/music-sample-320kbps.mp3",
          duration: "1:00"
        },
        {
          title: "Music Sample (128 kbps)",
          artist: "Sample Files",
          src: "https://sample-files.com/downloads/audio/mp3/music-sample-128kbps.mp3",
          duration: "1:00"
        },
        {
          title: "Tone Test",
          artist: "Sample Files",
          src: "https://sample-files.com/downloads/audio/mp3/tone-test.mp3",
          duration: "0:40"
        },
        {
          title: "Sound Effects Compilation",
          artist: "Sample Files",
          src: "https://sample-files.com/downloads/audio/mp3/sfx-compilation.mp3",
          duration: "0:45"
        },
        {
          title: "Voice Recording",
          artist: "Sample Files",
          src: "https://sample-files.com/downloads/audio/mp3/voice-sample.mp3",
          duration: "0:26"
        },
        {
          title: "Long Audio (5 min)",
          artist: "Sample Files",
          src: "https://sample-files.com/downloads/audio/mp3/long-audio-5min.mp3",
          duration: "5:00"
        }
      ];
  
      // ── Elements ──
      const audio = document.getElementById("audio");
      const playBtn = document.getElementById("playBtn");
      const playIcon = document.getElementById("playIcon");
      const pauseIcon = document.getElementById("pauseIcon");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const trackTitle = document.getElementById("trackTitle");
      const trackArtist = document.getElementById("trackArtist");
      const progressWrap = document.getElementById("progressWrap");
      const progressFill = document.getElementById("progressFill");
      const currentTimeEl = document.getElementById("currentTime");
      const durationEl = document.getElementById("duration");
      const volumeWrap = document.getElementById("volumeWrap");
      const volumeFill = document.getElementById("volumeFill");
      const vinyl = document.getElementById("vinyl");
      const vinylLabel = document.getElementById("vinylLabel");
      const playlistEl = document.getElementById("playlist");
      const playlistCount = document.getElementById("playlistCount");
  
      let currentIndex = 0;
      let isSeeking = false;
      let isVolumeDragging = false;
  
      // ── Helpers ──
      function formatTime(sec) {
        if (!isFinite(sec) || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
      }
  
      function loadTrack(index) {
        if (index < 0 || index >= tracks.length) return;
        currentIndex = index;
        const track = tracks[index];
        audio.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        durationEl.textContent = track.duration;
        vinylLabel.textContent = track.title.charAt(0).toUpperCase();
        progressFill.style.width = "0%";
        currentTimeEl.textContent = "0:00";
        updatePlaylistUI();
      }
  
      function play() {
        audio.play().catch(() => {});
      }
  
      function pause() {
        audio.pause();
      }
  
      function togglePlay() {
        if (audio.paused) play();
        else pause();
      }
  
      function updatePlayUI() {
        const playing = !audio.paused;
        playIcon.style.display = playing ? "none" : "block";
        pauseIcon.style.display = playing ? "block" : "none";
        vinyl.classList.toggle("spinning", playing);
        document.querySelectorAll(".playlist-item").forEach((el) => {
          el.classList.toggle("paused", !playing);
        });
      }
  
      function updateProgress() {
        if (isSeeking || !audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${pct}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
  
      function seek(e) {
        const rect = progressWrap.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let pct = (clientX - rect.left) / rect.width;
        pct = Math.max(0, Math.min(1, pct));
        progressFill.style.width = `${pct * 100}%`;
        if (audio.duration) {
          audio.currentTime = pct * audio.duration;
          currentTimeEl.textContent = formatTime(audio.currentTime);
        }
      }
  
      function setVolume(e) {
        const rect = volumeWrap.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let pct = (clientX - rect.left) / rect.width;
        pct = Math.max(0, Math.min(1, pct));
        audio.volume = pct;
        volumeFill.style.width = `${pct * 100}%`;
      }
  
      function updatePlaylistUI() {
        document.querySelectorAll(".playlist-item").forEach((el, i) => {
          el.classList.toggle("active", i === currentIndex);
        });
      }
  
      function renderPlaylist() {
        playlistCount.textContent = `${tracks.length} tracks`;
        playlistEl.innerHTML = tracks
          .map(
            (t, i) => `
          <div class="playlist-item ${i === currentIndex ? "active" : ""}" data-index="${i}">
            <span class="pl-num">${i + 1}</span>
            <div class="pl-info">
              <div class="pl-title">${t.title}</div>
              <div class="pl-artist">${t.artist}</div>
            </div>
            <div class="eq-bars"><span></span><span></span><span></span></div>
            <span class="pl-duration">${t.duration}</span>
          </div>`
          )
          .join("");
  
        playlistEl.querySelectorAll(".playlist-item").forEach((el) => {
          el.addEventListener("click", () => {
            const idx = parseInt(el.dataset.index, 10);
            if (idx === currentIndex) {
              togglePlay();
            } else {
              loadTrack(idx);
              play();
            }
          });
        });
      }
  
      // ── Event listeners ──
      playBtn.addEventListener("click", togglePlay);
      prevBtn.addEventListener("click", () => {
        const next = (currentIndex - 1 + tracks.length) % tracks.length;
        loadTrack(next);
        play();
      });
      nextBtn.addEventListener("click", () => {
        const next = (currentIndex + 1) % tracks.length;
        loadTrack(next);
        play();
      });
  
      audio.addEventListener("play", updatePlayUI);
      audio.addEventListener("pause", updatePlayUI);
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(audio.duration);
      });
      audio.addEventListener("ended", () => {
        const next = (currentIndex + 1) % tracks.length;
        loadTrack(next);
        play();
      });
  
      // Progress bar seeking
      progressWrap.addEventListener("mousedown", (e) => {
        isSeeking = true;
        seek(e);
      });
      progressWrap.addEventListener("touchstart", (e) => {
        isSeeking = true;
        seek(e);
      }, { passive: true });
  
      window.addEventListener("mousemove", (e) => {
        if (isSeeking) seek(e);
      });
      window.addEventListener("touchmove", (e) => {
        if (isSeeking) seek(e);
      }, { passive: true });
  
      window.addEventListener("mouseup", () => { isSeeking = false; });
      window.addEventListener("touchend", () => { isSeeking = false; });
  
      // Volume
      volumeWrap.addEventListener("mousedown", (e) => {
        isVolumeDragging = true;
        setVolume(e);
      });
      volumeWrap.addEventListener("touchstart", (e) => {
        isVolumeDragging = true;
        setVolume(e);
      }, { passive: true });
  
      window.addEventListener("mousemove", (e) => {
        if (isVolumeDragging) setVolume(e);
      });
      window.addEventListener("touchmove", (e) => {
        if (isVolumeDragging) setVolume(e);
      }, { passive: true });
  
      window.addEventListener("mouseup", () => { isVolumeDragging = false; });
      window.addEventListener("touchend", () => { isVolumeDragging = false; });
  
      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT") return;
        switch (e.code) {
          case "Space":
            e.preventDefault();
            togglePlay();
            break;
          case "ArrowLeft":
            e.preventDefault();
            prevBtn.click();
            break;
          case "ArrowRight":
            e.preventDefault();
            nextBtn.click();
            break;
          case "ArrowUp":
            e.preventDefault();
            audio.volume = Math.min(1, audio.volume + 0.05);
            volumeFill.style.width = `${audio.volume * 100}%`;
            break;
          case "ArrowDown":
            e.preventDefault();
            audio.volume = Math.max(0, audio.volume - 0.05);
            volumeFill.style.width = `${audio.volume * 100}%`;
            break;
        }
      });
  
      // ── Init ──
      audio.volume = 0.8;
      volumeFill.style.width = "80%";
      renderPlaylist();
      loadTrack(0);
const introScreen = document.getElementById("introScreen");
const openSurpriseButton = document.getElementById("openSurprise");
const mainContent = document.getElementById("mainContent");

const music = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");

const reasonCards = document.querySelectorAll(".reason-card");
const envelope = document.getElementById("envelope");
const letterContent = document.getElementById("letterContent");

const wishButton = document.getElementById("wishButton");
const finalMessage = document.getElementById("finalMessage");

const canvas = document.getElementById("confettiCanvas");
const context = canvas.getContext("2d");

let musicIsPlaying = false;
let confettiPieces = [];
let confettiAnimationId = null;

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

openSurpriseButton.addEventListener("click", () => {
  introScreen.classList.add("leave");

  setTimeout(() => {
    introScreen.style.display = "none";
    mainContent.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    launchConfetti(130);
  }, 650);
});

musicButton.addEventListener("click", async () => {
  try {
    if (musicIsPlaying) {
      music.pause();
      musicButton.classList.remove("playing");
      musicLabel.textContent = "Play Music";
      musicIsPlaying = false;
      return;
    }

    await music.play();
    musicButton.classList.add("playing");
    musicLabel.textContent = "Pause Music";
    musicIsPlaying = true;
  } catch (error) {
    musicLabel.textContent = "Add song.mp3";
    console.warn(
      "Music could not play. Add assets/song.mp3, then try again.",
      error
    );
  }
});

reasonCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");

    const title = card.querySelector(".reason-title");
    title.textContent = card.classList.contains("active")
      ? "Never forget this"
      : "Tap to reveal";
  });
});

envelope.addEventListener("click", () => {
  envelope.classList.add("opened");

  setTimeout(() => {
    letterContent.classList.add("show");
    launchConfetti(80);
  }, 450);
});

wishButton.addEventListener("click", () => {
  finalMessage.classList.add("show");
  wishButton.textContent = "Your Wish Is on Its Way 💗";
  wishButton.disabled = true;
  launchConfetti(260, true);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

function launchConfetti(amount = 160, wideBurst = false) {
  const colors = ["#ff4fa3", "#ff8fc5", "#ffd5e9", "#ffffff", "#1f1019"];

  for (let index = 0; index < amount; index += 1) {
    confettiPieces.push({
      x: wideBurst
        ? Math.random() * window.innerWidth
        : window.innerWidth / 2 + (Math.random() - 0.5) * 220,
      y: wideBurst
        ? -20 - Math.random() * 160
        : window.innerHeight * 0.32 + (Math.random() - 0.5) * 100,
      width: 6 + Math.random() * 8,
      height: 8 + Math.random() * 13,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: (Math.random() - 0.5) * (wideBurst ? 5 : 12),
      velocityY: 2 + Math.random() * 5,
      gravity: 0.075 + Math.random() * 0.045,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
    });
  }

  if (!confettiAnimationId) {
    animateConfetti();
  }
}

function animateConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces = confettiPieces.filter((piece) => {
    piece.velocityY += piece.gravity;
    piece.x += piece.velocityX;
    piece.y += piece.velocityY;
    piece.rotation += piece.rotationSpeed;

    if (piece.y > window.innerHeight + 40) {
      return false;
    }

    context.save();
    context.globalAlpha = piece.opacity;
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(
      -piece.width / 2,
      -piece.height / 2,
      piece.width,
      piece.height
    );
    context.restore();

    return true;
  });

  if (confettiPieces.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

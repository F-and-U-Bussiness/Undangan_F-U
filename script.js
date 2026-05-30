import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAg2jMuZWHZRNMZvbdxL9I_WGL76wMU4L0",
  authDomain: "undangandigital-fu.firebaseapp.com",
  projectId: "undangandigital-fu",
  storageBucket: "undangandigital-fu.firebasestorage.app",
  messagingSenderId: "129129659389",
  appId: "1:129129659389:web:e6b6715e662de7c4d5b794"
};



function flowerConfetti() {

    const container = document.getElementById("flower-container");

    for(let i = 0; i < 3; i++) {

        const flower = document.createElement("div");

        flower.classList.add("flower");
        flower.innerHTML = "🌸";

        flower.style.left = Math.random() * 100 + "vw";
        flower.style.fontSize = (18 + Math.random() * 10) + "px";

        flower.style.animationDuration =
            (8 + Math.random() * 5) + "s";

        flower.style.animationDelay =
            (Math.random() * 2) + "s";

        container.appendChild(flower);

        setTimeout(() => {
            flower.remove();
        }, 15000);
    }
}

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const guestName = document.getElementById('guestName');
const openBtn = document.getElementById('openBtn');
const mainContent = document.getElementById('mainContent');
const bgAudio = document.getElementById('bgAudio');
const commentList = document.getElementById('commentList');
const rsvpForm = document.getElementById('rsvpForm');
const musicToggle = document.getElementById('musicToggle');
const giftBtn = document.getElementById('giftBtn');
const saveDateBtn = document.getElementById('saveDateBtn');

let isMusicPlaying = false;

function decodeGuestName(value) {
  if (!value) return 'Tamu Undangan';
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get('to');
guestName.textContent = decodeGuestName(guest);

openBtn.addEventListener('click', () => {

  const bunga = setInterval(() => {
      flowerConfetti();
  }, 1000);

  setTimeout(() => {
      clearInterval(bunga);
  }, 30000);

  const cover = document.querySelector('.cover');
  cover.style.display = 'none'

  mainContent.classList.remove('hidden');
  mainContent.scrollIntoView({ behavior: 'smooth' });

  if (bgAudio && !isMusicPlaying)  {
    bgAudio.play().then(() => {
      isMusicPlaying = true;
      musicToggle.textContent = 'Musik Off';
    }).catch(() => {
      // Autoplay mungkin diblokir
    });
  }
});

musicToggle.addEventListener('click', () => {
  if (bgAudio) {
    if (isMusicPlaying) {
      bgAudio.pause();
      musicToggle.textContent = 'Musik On';
    } else {
      bgAudio.play();
      musicToggle.textContent = 'Musik Off';
    }
    isMusicPlaying = !isMusicPlaying;
  }
});

function updateCountdown() {
  const eventDate = new Date('2026-04-30T09:00:00');
  const now = new Date();
  const diff = eventDate - now;

  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  if (diff <= 0) {
    countdown.innerHTML = '<div><span>0</span><small>Hari</small></div><div><span>0</span><small>Jam</small></div><div><span>0</span><small>Menit</small></div><div><span>0</span><small>Detik</small></div>';
    return;
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function createCommentItem(name, attendance, message) {
  const item = document.createElement('div');
  item.className = 'comment-item';
  item.innerHTML = `<strong>${name}</strong> - <em>${attendance}</em><p>${message}</p>`;
  return item;
}


rsvpForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const nameInput =
  document.getElementById('nameInput');

  const messageInput =
  document.getElementById('messageInput');

  const attendance =
  document.querySelector(
    'input[name="attendance"]:checked'
  ).value;

  const name = nameInput.value.trim();

  const message = messageInput.value.trim();

  if (!name || !message) {

    alert('Mohon isi nama dan doa/ucapan terlebih dahulu.');

    return;

  }

  await addDoc(collection(db, "wishes"), {

    name,
    attendance,
    message,
    createdAt: Date.now()

  });

  nameInput.value = '';

  messageInput.value = '';

});

 

giftBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const rekeningInfo = document.getElementById('rekeningInfo');
  rekeningInfo.style.display = rekeningInfo.style.display === 'none' ? 'block' : 'none';
});

saveDateBtn.addEventListener('click', () => {
  const countdownSection = document.querySelector('.intro');
  countdownSection.scrollIntoView({ behavior: 'smooth' });
});

updateCountdown();
setInterval(updateCountdown, 1000);


// Animasi scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe semua elemen yang mau dianimasi
document.querySelectorAll('.section h2, .section p, .event-card, .photo-card, .gallery-item, .comment-item').forEach(el => {
  el.classList.add('animate');
  observer.observe(el);
});




const q = query(
  collection(db, "wishes"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {

  commentList.innerHTML = '';

  snapshot.forEach((doc) => {

    const data = doc.data();

    commentList.appendChild(
      createCommentItem(
        data.name,
        data.attendance,
        data.message
      )
    );

  });

});

// Ambil parameter dari URL
const params = new URLSearchParams(window.location.search);

const namaTamu = params.get("tamu");

if (namaTamu) {
    document.getElementById("guestName").textContent =
        decodeURIComponent(namaTamu);
}

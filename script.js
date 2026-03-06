const loader = document.getElementById("loader");
const main = document.getElementById("main");
const flame = document.getElementById("flame");
const message = document.getElementById("message");
const music = document.getElementById("bgMusic");
const cake = document.querySelector(".cake");
const player = document.querySelector(".vinyl-player");
let candleBlown = false;


/* ================= PLAYLIST SYSTEM ================= */

const playlist = [
    { name: "Ajeeb Dastan", file: "bgmusic/AjeebDastan.mp3" },
    { name: "Chiyako Botaima", file: "bgmusic/Chiyako Botaima.mp3" },
    { name: "Easy on me", file: "bgmusic/Easy on me.mp3" },
    { name: "Heather", file: "bgmusic/Heather.mp3" },
    { name: "I Thought I Saw Your Face Today", file: "bgmusic/IThoughtISawYourFaceToday.mp3" },
    { name: "Jadai chu tada", file: "bgmusic/Jadai chu tada.mp3" },
    { name: "Line Without a Hook", file: "bgmusic/Line Without a Hook .mp3" },
    { name: "Ma-[Na] - Samjhana (Ma) ", file: "bgmusic/Ma-[Na] - Samjhana (Ma) .mp3" },
    { name: "Maan Lai Pugne Maya", file: "bgmusic/Maan Lai Pugne Maya.mp3" },
    { name: "Maaya", file: "bgmusic/Maaya.mp3" },
    { name: "Maili", file: "bgmusic/Maili .mp3" },
    { name: "Mann Bharya", file: "bgmusic/Mann Bharya.mp3" },
    { name: "Marijau", file: "bgmusic/Marijau.mp3" },
    { name: "Maya ta yestai ho", file: "bgmusic/Maya ta yestai ho.mp3" },
    { name: "Pretty Little Baby", file: "bgmusic/Pretty Little Baby.mp3" },
    { name: "Putali Aau", file: "bgmusic/Putali Aau.mp3" },
    { name: "Sadhana", file: "bgmusic/Sadhana.mp3" },
    { name: "Taral - Nidari (Ko Nimti)", file: "bgmusic/Taral - Nidari (Ko Nimti) .mp3" },
    { name: "Timi Ra, Ma", file: "bgmusic/Timi Ra, Ma.mp3" },
    { name: "Too Sweet", file: "bgmusic/Too Sweet.mp3" },
    { name: "Tum Se Hi", file: "bgmusic/Tum Se Hi.mp3" }
];

let currentTrack = 0;
const songTitle = document.getElementById("songTitle");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const record = document.querySelector(".record") || {};

function loadTrack(index) {
    music.src = playlist[index].file;
songTitle.style.opacity= 0;

setTimeout(()=>{
    songTitle.textContent = playlist[index].name;
    songTitle.style.opacity= 1;
},200);
}

function playMusic() {

    music.play().then(() => {

        record.style.animationPlayState = "running";
        player.classList.add("playing");
        playPauseBtn.textContent = "⏸";

    }).catch((err) => {
        console.log("Play blocked:", err);
        playPauseBtn.textContent = "▶";
    });

}

function pauseMusic() {
    music.pause();
    record.style.animationPlayState="paused";
    playPauseBtn.textContent = "▶";
    player.classList.remove("playing");
}

playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

nextBtn.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    playMusic();
showNowPlaying(playlist[currentTrack].name);
    startMicBlowDetection();
});

prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    playMusic();
showNowPlaying(playlist[currentTrack].name);
});

music.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    playMusic();
showNowPlaying(playlist[currentTrack].name);
});

function showNowPlaying(song){

const el = document.getElementById("nowPlaying");

el.textContent = "🎵 Now Playing: " + song;

el.style.opacity = 1;
el.style.transform = "translateY(0)";

setTimeout(()=>{
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
},3000);

}

const micGate = document.getElementById("micGate");
const allowMic = document.getElementById("allowMic");
const skipMic = document.getElementById("skipMic");

let micAllowed = false;
let micStream = null;

allowMic.onclick = async () => {

    try{
        micStream = await navigator.mediaDevices.getUserMedia({audio:true});
        micAllowed = true;
    }catch(e){
        micAllowed = false;
    }

    micGate.style.display="none";
};

skipMic.onclick = () => {

    micAllowed = false;
    micGate.style.display="none";

};


window.addEventListener("resize", ()=>{
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});

function startSite(){

    blowCandle();
    loader.style.transition="opacity 1s ease";
    loader.style.opacity="0";

    setTimeout(()=>{
        main.style.display="block";
        loader.style.display="none";

        setTimeout(()=>{
        message.style.opacity="1";
    },200);

},1000);

    shufflePlaylist();
    loadTrack(currentTrack);
    playMusic();
    showNowPlaying(playlist[currentTrack].name);
    startConfetti();
player.classList.add("show");
}

typeMessage(
"Finally, I want to wish you a very happy birthday and thank you for being a great friend. ",
message
);

function startMusic(){

    shufflePlaylist();

    loadTrack(currentTrack);


}

function typeMessage(text, element, speed=20){    
    let i=0;
    function type(){
    if(i<text.length){

    element.innerHTML+=text.charAt(i);
    i++;
    setTimeout(type,speed);
}
}

type();
}



function shufflePlaylist(){

    for(let i = playlist.length -1; i>0; i--){

        const j = Math.floor(Math.random()*(i+1));

        [playlist[i],playlist[j]] = [playlist[j],playlist[i]];
    }

}/* ================= ENHANCED FIREFLIES ================= */

const fireCanvas = document.getElementById("fireflies");
const fireCtx = fireCanvas.getContext("2d");

fireCanvas.width = window.innerWidth;
fireCanvas.height = window.innerHeight;

let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener("mousemove", (e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

let fireflies = [];

for(let i=0;i<55;i++){
    fireflies.push({
        x: Math.random()*fireCanvas.width,
        y: Math.random()*fireCanvas.height,
        radius: Math.random()*2+1.5,
        speedX: (Math.random()-0.5)*0.4,
        speedY: (Math.random()-0.5)*0.4,
        opacity: Math.random(),
        flickerSpeed: Math.random()*0.02+0.01
    });
}

function animateFireflies(){

    fireCtx.clearRect(0,0,fireCanvas.width,fireCanvas.height);

    fireflies.forEach(f=>{

        // --- Gentle attraction toward cursor ---
        const dx = mouse.x - f.x;
        const dy = mouse.y - f.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < 250){
            f.x += dx * 0.003;  // very soft pull
            f.y += dy * 0.003;
        }

        // --- Flicker ---
        f.opacity += f.flickerSpeed;
        if(f.opacity > 1 || f.opacity < 0.2){
            f.flickerSpeed *= -1;
        }

        // --- Glow ---
        const gradient = fireCtx.createRadialGradient(
            f.x, f.y, 0,
            f.x, f.y, f.radius*10
        );

        gradient.addColorStop(0, `rgba(255,230,150,${f.opacity})`);
        gradient.addColorStop(0.3, `rgba(255,200,100,${f.opacity*0.6})`);
        gradient.addColorStop(1, "rgba(255,200,100,0)");

        fireCtx.beginPath();
        fireCtx.fillStyle = gradient;
        fireCtx.arc(f.x,f.y,f.radius*14,0,Math.PI*2);
        fireCtx.fill();

        // --- Natural drifting ---
        f.x += f.speedX;
        f.y += f.speedY;

        // Wrap around edges
        if(f.x < 0) f.x = fireCanvas.width;
        if(f.x > fireCanvas.width) f.x = 0;
        if(f.y < 0) f.y = fireCanvas.height;
        if(f.y > fireCanvas.height) f.y = 0;
    });

    requestAnimationFrame(animateFireflies);
}

animateFireflies();

window.addEventListener("resize", ()=>{
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
});
/* ================= GOLDEN PARTICLES ================= */

const goldCanvas = document.getElementById("goldenParticles");
const goldCtx = goldCanvas.getContext("2d");

goldCanvas.width = window.innerWidth;
goldCanvas.height = window.innerHeight;

let goldParticles = [];

for(let i=0;i<80;i++){
    goldParticles.push({
        x: Math.random()*goldCanvas.width,
        y: Math.random()*goldCanvas.height,
        size: Math.random()*2+1,
        speedY: Math.random()*0.5+0.2,
        speedX: (Math.random()-0.5)*0.3,
        opacity: Math.random()*0.5+0.2
    });
}

function animateGoldParticles(){

    goldCtx.clearRect(0,0,goldCanvas.width,goldCanvas.height);

    goldParticles.forEach(p=>{
        goldCtx.beginPath();
        goldCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
        goldCtx.fillStyle = `rgba(212,175,55,${p.opacity})`;
        goldCtx.fill();

        p.y -= p.speedY;
        p.x += p.speedX;

        if(p.y < 0){
            p.y = goldCanvas.height;
            p.x = Math.random()*goldCanvas.width;
        }
    });

    requestAnimationFrame(animateGoldParticles);
}

animateGoldParticles();

window.addEventListener("resize", ()=>{
    goldCanvas.width = window.innerWidth;
    goldCanvas.height = window.innerHeight;
});

/* Confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pieces = [];

let confettiRunning=false;

function startConfetti(){
    pieces = [];
    confettiRunning=true;

    for (let i = 0; i < 150; i++) {

        pieces.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            size: Math.random()*8+4,
            speed: Math.random()*3+2,
            color:["#f4a261","#8b1e3f","#fffaf0","#d4af37"][Math.floor(Math.random()*4)]
        });
    }

    animateConfetti();

    setTimeout(()=>{
        confettiRunning=false;
    },8000);

}

let analyser;
let dataArray;

async function startMic(){

    const stream = await navigator.mediaDevices.getUserMedia({audio:true});

    const audioCtx = new AudioContext();

    const source = audioCtx.createMediaStreamSource(stream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    dataArray = new Uint8Array(analyser.frequencyBinCount);

    detectBlow();
}

function detectBlow(){

    if(!analyser || candleBlown) return;

    analyser.getByteFrequencyData(dataArray);
let sum = 0;

for(let i=0;i<dataArray.length;i++){
sum += dataArray[i] * dataArray[i];
}

let volume = Math.sqrt(sum/dataArray.length);

    let percent = Math.min(volume * 1,100);

    document.getElementById("blowMeter").style.width = percent + "%";

let bend = Math.min(volume/10,20);
flame.style.transform = "scale("+(1-volume/250)+") rotateX("+bend+"deg)";
    if(volume > 80 && !candleBlown){

        candleBlown = true;

        blowCandle();

setTimeout(()=>{

    cakeArea.style.display = "none";

    startSite();

},600);
        return;
    }

    requestAnimationFrame(detectBlow);
}



const gift = document.getElementById("giftBox");
const cakeArea = document.getElementById("cakeArea");

let tapsRequired = Math.floor(Math.random()*5)+3; // 3-7 taps
let tapCount = 0;
gift.addEventListener("click", () => {

    // stop if gift already opened
    if(gift.classList.contains("open")) return;

    gift.classList.add("shake");

    setTimeout(()=>{
        gift.classList.remove("shake");
    },250);

    tapCount++;

  if(tapCount >= tapsRequired){

    setTimeout(()=>{

        gift.classList.add("open");
        burstFireflies();

        gift.style.pointerEvents = "none";

        // Hide gift
        setTimeout(()=>{
            gift.style.display = "none";

            // Show candle area
            cakeArea.style.display = "block";

            startMicBlowDetection();

        },700);

    },200);

}

});

document.querySelectorAll(".controls button").forEach(btn=>{
    btn.addEventListener("click",()=>{
        btn.style.transform = "scale(0.95) rotate(-2deg)";
        setTimeout(()=>{ btn.style.transform = ""; },120);
    });
});

function burstFireflies(){

fireflies.forEach(f=>{
    f.speedX = (Math.random()-0.5)*6;
    f.speedY = (Math.random()-0.5)*6;
});

setTimeout(()=>{

fireflies.forEach(f=>{
    f.speedX = (Math.random()-0.5)*0.4;
    f.speedY = (Math.random()-0.5)*0.4;
});

},1200);

}

function startMicBlowDetection(){

    if(!micAllowed || !micStream) return;

    const audioCtx = new AudioContext();

    audioCtx.resume();

    const source = audioCtx.createMediaStreamSource(micStream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    dataArray = new Uint8Array(analyser.frequencyBinCount);

    detectBlow();
}

const vinylPlayer = document.getElementById("vinyl");

document.querySelector(".vinyl-wrapper").addEventListener("click", () => {
    player.classList.toggle("open");
});

function blowCandle(){

flame.style.transform="scale(0)";
flame.style.opacity="0";
flame.style.transition="0.5s";

if(analyser) analyser.disconnect();
}

function animateConfetti(){

    if(!confettiRunning){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        pieces=[];
        return;
    }

    ctx.clearRect(0,0,canvas.width,canvas.height);

    pieces.forEach(p=>{
        ctx.fillStyle=p.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);

        p.y+=p.speed;

        if(p.y>canvas.height) p.y=0;
    });

    requestAnimationFrame(animateConfetti);
}
function showPlayer(){
 
    player.classList.remove("collapsed");
    player.classList.add("show");


    setTimeout(()=>{
        player.classList.add("collapsed");
    },5000);

}

player.addEventListener("mouseenter",()=>{
    player.classList.remove("collapsed");
});

player.addEventListener("mouseleave",()=>{
    player.classList.add("collapsed");
});

window.addEventListener("load", () => {

    main.style.display = "none";
    cakeArea.style.display = "none";

    gift.style.display = "block";
});
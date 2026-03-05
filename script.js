const loader = document.getElementById("loader");
const main = document.getElementById("main");
const flame = document.getElementById("flame");
const message = document.getElementById("message");
const music = document.getElementById("bgMusic");
const cake = document.querySelector(".cake");
const player = document.querySelector(".vinyl-player");


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
const record = document.querySelector(".record");

function loadTrack(index) {
    music.src = playlist[index].file;

    songTitle.textContent = playlist[index].name;
    showPlayer();
}

function playMusic() {
    music.play();
    record.style.animation="spin 4s linear infinite, vinylGlow 3s infinite";
    playPauseBtn.textContent = "⏸";
}

function pauseMusic() {
    music.pause();
    record.style.animationPlayState="paused";
    playPauseBtn.textContent = "▶";
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
    startMicBlowDetection();
});

prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    playMusic();
});

music.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    playMusic();
});

player.addEventListener("click", () => {

    player.classList.toggle("open");

});

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

cake.addEventListener("click", async () => {
    if (micGate.style.display !== "none") return;

    blowCandle();

    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
        main.style.display = "block";
        message.style.opacity = "1";
    }, 500); // give smooth fade

    shufflePlaylist();
    loadTrack(currentTrack);

    try {
        await music.play();
        record.style.animationPlayState = "running";
        playPauseBtn.textContent = "⏸";
        player.classList.add("show"); // use the player const
    } catch (err) {
        console.log("Autoplay blocked", err);
    }

    startConfetti();
    startMicBlowDetection();
});

function startSite(){

    blowCandle();

    loader.style.opacity="0";

    setTimeout(()=>{
        loader.remove();
        main.style.display="block";
        message.style.opacity="1";
    },900);

    shufflePlaylist();
    loadTrack(currentTrack);

    music.play().catch(()=>{});

    startConfetti();

}

function startMusic(){

    shufflePlaylist();

    loadTrack(currentTrack);


}

function typeMessage(text, element, speed=40){    
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

typeMessage(
"Today the world became more beautiful because you were born...",
message
);

function createHeart(){

const heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="fixed";
heart.style.left=Math.random()*100+"vw";
heart.style.bottom="-20px";
heart.style.fontSize=Math.random()*20+10+"px";

heart.style.animation="float 6s linear";

document.body.appendChild(heart);

setTimeout(()=>heart.remove(),6000);

}

setInterval(createHeart,800);

function shufflePlaylist(){

    for(let i = playlist.length -1; i>0; i--){

        const j = Math.floor(Math.random()*(i+1));

        [playlist[i],playlist[j]] = [playlist[j],playlist[i]];
    }

}

/* Confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pieces = [];

let confettiRunning=false;

function startConfetti(){

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
async function startMicBlowDetection() {
    if(!micStream) return; // stop if no mic
    try {
        const ctx = new AudioContext();
        const mic = ctx.createMediaStreamSource(micStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        mic.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        function detect(){
            analyser.getByteTimeDomainData(data);
            let sum = 0;
            for(let i=0;i<data.length;i++){
                let val = (data[i]-128)/128;
                sum += val*val;
            }
            let volume = Math.sqrt(sum/data.length);
            if(volume > 0.05){ // slightly lower threshold
                blowCandle();
            }
            requestAnimationFrame(detect);
        }

        detect();
    } catch(e){
        console.log("mic blocked");
    }
}

const vinylPlayer = document.querySelector(".vinyl-player");

vinylPlayer.addEventListener("click",()=>{

    vinylPlayer.classList.toggle("open");
record.style.animation="spin 4s linear infinite, vinylGlow 3s infinite";
});

function blowCandle(){
    flame.style.animation="none";
    flame.style.opacity="0";

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

    player.style.display="flex";

    player.classList.remove("collapsed");

    setTimeout(()=>{
        player.classList.add("collapsed");
    },3000);

}

player.addEventListener("mouseenter",()=>{
    player.classList.remove("collapsed");
});

player.addEventListener("mouseleave",()=>{
    player.classList.add("collapsed");
});
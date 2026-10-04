const circle = document.querySelector(".cursor-circle");
const clean = (name) => name.replace(".html", "");
const currentPage = clean(location.pathname.split("/").pop() || "index");

let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;
const speed = 0.15;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    circle.classList.add("visible");
});

document.querySelectorAll("nav ul a").forEach((link) => {
    if (clean(link.getAttribute("href")) == currentPage) {
        link.parentElement.remove();
    }
});

function animate() {
    circleX += (mouseX - circleX) * speed;
    circleY += (mouseY - circleY) * speed;

    circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;

    requestAnimationFrame(animate);
}

animate();


// falling pixels script
const canvas = document.createElement("canvas");
canvas.id = "stars";
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");

const PIXEL = 2;                          // size of each "pixel" square
const TILT = 20 * Math.PI / 180;          // angle away from straight down
const dirX = Math.sin(TILT);
const dirY = Math.cos(TILT);

let stars = [];

function makeStar(randomY) {
    const length = 40 + Math.random() * 120;
    const drift = canvas.height * Math.tan(TILT);
    return {
        x: Math.random() * (canvas.width + drift) - drift,
        y: randomY ? Math.random() * canvas.height : -length,
        length,
        speed: 0.15 + Math.random() * 0.81,   // keep low for slow falling
        alpha: 0.15 + Math.random() * 0.2
    };
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    stars = Array.from({ length: count }, () => makeStar(true));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
        s.x += dirX * s.speed;
        s.y += dirY * s.speed;

        if (s.y - s.length > canvas.height) Object.assign(s, makeStar(false));

        // draw the trail as snapped squares, fading out behind the head
        for (let i = 0; i < s.length; i += PIXEL) {
            const fade = 1 - i / s.length;
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * fade})`;
            const px = Math.round((s.x - dirX * i) / PIXEL) * PIXEL;
            const py = Math.round((s.y - dirY * i) / PIXEL) * PIXEL;
            ctx.fillRect(px, py, PIXEL, PIXEL);
        }
    }

    requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();


// form completion replacement script
const form = document.querySelector("#contact-form form");
const formStatus = document.querySelector("#form-status");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const subject = encodeURIComponent(`Portfolio message from ${data.get("name")}`);
        const body = encodeURIComponent(
            `${data.get("message")}\n\nFrom: ${data.get("name")} (${data.get("email")})`
        );

        window.location.href = `mailto:mirohajas81@gmail.com?subject=${subject}&body=${body}`;

        formStatus.textContent =
            "Opening your email app. If nothing happens, you can email me directly at mirohajas81@gmail.com.";
    });
}
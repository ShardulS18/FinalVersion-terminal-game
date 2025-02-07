// from below we have the logic for the cursor effects

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.width = window.innerWidth; // Optional: Resize to fit window
canvas.height = window.innerHeight; // Optional

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 15 + 1;
  this.speedX = Math.random() * 2 - 1.5;
  this.speedY = Math.random() * 2 - 1.5;
}

Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  this.size *= 0.983;
};

Particle.prototype.draw = function () {
  ctx.fillStyle = "#E5A75E"; // Fixed color
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
};

var particles = [];

canvas.addEventListener("mousemove", function (e) {
  var xPos = e.x;
  var yPos = e.y;
  for (var i = 0; i < 5; i++) {
    particles.push(new Particle(xPos, yPos));
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].size < 0.3) {
      particles.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animateParticles);
}

animateParticles();

const bubblesContainer = document.querySelector('.bubbles');
const Xnum = 40

for (let i = 1; i <= Xnum; i++) {
    const span = document.createElement('span');
    span.style.setProperty('--i', Math.floor(Math.random() * Xnum) + 1);
    bubblesContainer.appendChild(span);
}
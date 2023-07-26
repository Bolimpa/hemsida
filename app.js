// Array of available themes
const themes = ['theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6',/* Add more theme IDs here as needed */];

// Function to apply a random theme
function applyRandomTheme() {
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  document.body.className = randomTheme;
}

// Call the function to apply the random theme when the DOM is ready

applyRandomTheme();

// Get all circle elements
const circles = document.querySelectorAll('.circle');

// Animation properties
const duration = 10000; // Duration in milliseconds for one cycle
const numPositions = 5; // Number of random positions for each circle
const boundingBox = { minX: -1.5, maxX: 1.5, minY: -1.5, maxY: 1.5 }; // Specified range for random positions

// Easing function (Cubic Bezier Easing)
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Function to generate a random position within a specified range
function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate random positions for each circle within the specified range
const positions = [];
for (let i = 0; i < circles.length; i++) {
  const circle = circles[i];
  const randomPositions = [];
  for (let j = 0; j < numPositions; j++) {
    const randomX = getRandomPosition(boundingBox.minX, boundingBox.maxX);
    const randomY = getRandomPosition(boundingBox.minY, boundingBox.maxY);
    randomPositions.push({ x: randomX, y: randomY });
  }
  positions.push(randomPositions);
}

// Predetermined initial delay times for each circle (in milliseconds)
const initialDelays = [1000, 2000, 1500, 0, 1000, 1500, 2500, 1000, 1500, 0, 1000, 1500, 2500];

// Function to smoothly move the circles with initial delay
function moveCircles(timestamp) {
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const delay = initialDelays[i];
    const elapsed = Math.max(0, timestamp - delay);

    // Calculate the number of completed cycles and the progress within the current cycle
    const numCompletedCycles = Math.floor(elapsed / duration);
    const progress = (elapsed % duration) / duration;

    const currentIdx = Math.floor(progress * numPositions) % numPositions;
    const nextIdx = (currentIdx + 1) % numPositions;

    const startX = positions[i][currentIdx].x;
    const startY = positions[i][currentIdx].y;
    const endX = positions[i][nextIdx].x;
    const endY = positions[i][nextIdx].y;

    const t = easeInOutCubic(progress * numPositions - currentIdx); // Apply easing function to the progress

    // Calculate the current position using linear interpolation with easing
    let currentX = startX + (endX - startX) * t;
    let currentY = startY + (endY - startY) * t;

    // Wrap the positions back to the bounding box
    if (currentX < boundingBox.minX) currentX = boundingBox.minX;
    if (currentX > boundingBox.maxX) currentX = boundingBox.maxX;
    if (currentY < boundingBox.minY) currentY = boundingBox.minY;
    if (currentY > boundingBox.maxY) currentY = boundingBox.maxY;

    // Apply the new position to each circle element using CSS variables (custom properties)
    const calculatedX = `calc(-50% + ${currentX}dvmin)`;
    const calculatedY = `calc(-50% + ${currentY}dvmin)`;

    circle.style.setProperty('--x', calculatedX);
    circle.style.setProperty('--y', calculatedY);
  }

  // Request the next animation frame
  requestAnimationFrame(moveCircles);
}

// Add hover event listeners to each circle
const wrapper = document.querySelector('.wrapper');
const about = document.querySelector('.about-page');
const portfolio = document.querySelector('.portfolio-page');
const closeContainer = document.querySelector('.close-container');

let clickedInnerCircle = null;

circles.forEach((circle) => {
  const innerCircle = circle.querySelector('.inner-circle');

  circle.addEventListener('mouseover', () => {
    circle.style.setProperty('--scale', '1.1');
  });

  circle.addEventListener('mouseout', () => {
    circle.style.setProperty('--scale', '1');
  });

  circle.addEventListener('mousedown', () => {
    circle.style.setProperty('--scale', '0.9');
  });

  circle.addEventListener('mouseup', () => {
    if (innerCircle) {
      innerCircle.style.setProperty('--scaleInner', '50');
    }

    circle.style.setProperty('z-index', '10');

    clickedCircle = circle;
    clickedInnerCircle = innerCircle;

    // Store the current circle's color
    const currentColor = getComputedStyle(circle).backgroundColor;

    wrapper.style.pointerEvents = 'none';
    // After 0.5 seconds (500 milliseconds), change the background color of the body
    setTimeout(() => {
      document.body.style.backgroundColor = currentColor;

      // Hide all the circles after changing the background color

      wrapper.style.visibility = 'hidden';

      closeContainer.classList.add('visible');
      closeContainer.classList.remove('hidden');

      if (circle.id === 'about') {
        about.classList.add('visible');
        about.classList.remove('hidden');
      }
      else if (circle.id === 'portfolio') {
        portfolio.classList.add('visible');
        portfolio.classList.remove('hidden');
        
      }
    }, 400);
  });
});

// Add click event listener to the document to remove click effect

// Start the animation with predetermined initial delays for each circle
requestAnimationFrame(moveCircles);

closeContainer.addEventListener('mouseover', () => {
  closeContainer.style.scale = '1.1';
});

closeContainer.addEventListener('mouseout', () => {
  closeContainer.style.scale = '1';
});

closeContainer.addEventListener('mousedown', () => {
  closeContainer.style.scale = '0.9';
});

closeContainer.addEventListener('mouseup', () => {


  // After 0.5 seconds (500 milliseconds), change the background color of the body
  document.body.style.setProperty('background-color', 'var(--background-color)');
  clickedInnerCircle.style.setProperty('--scaleInner', '0');
  wrapper.style.visibility = 'visible';
  wrapper.style.pointerEvents = 'auto';

  if (clickedCircle.id === 'about') {
    about.classList.remove('visible');
    about.classList.add('hidden');
  }
  else if (clickedCircle.id === 'portfolio') {
    
    portfolio.classList.remove('visible');
    portfolio.classList.add('hidden');
    
  }
  closeContainer.classList.remove('visible');
  closeContainer.classList.add('hidden');

  setTimeout(() => {
    clickedCircle.style.setProperty('z-index', '0');
  }, 600);

});
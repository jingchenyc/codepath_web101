// Elements
const toggleThemeBtn = document.querySelector('.header__theme-button');
const storiesContent = document.querySelector('.stories__content');
const storiesLeftButton = document.querySelector('.stories__left-button');
const storiesRightButton = document.querySelector('.stories__right-button');
const posts = document.querySelectorAll('.post');
const postsContent = document.querySelectorAll('.post__content');


// Adding scroll animation features
let animation = {
  revealDistance: 150,
  initialOpacity: 0,
  transitionDelay: 0,
  transitionDuration: '2s',
  transitionProperty: 'all',
  transitionTimingFunction: 'ease'
};

// Select all elements with the revealable class
const revealableContainers = document.querySelectorAll('.revealable');

// Function to reveal elements as they are scrolled into view
function reveal() {
  revealableContainers.forEach((container) => {
    let windowHeight = window.innerHeight;
    let topOfRevealableContainer = container.getBoundingClientRect().top;

    if (topOfRevealableContainer < windowHeight - animation.revealDistance) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
}

// Add an event listener to the window for scrolling
window.addEventListener('scroll', reveal);

// Adding Reduce Motion Feature
const reduceMotionButton = document.createElement('button');
reduceMotionButton.id = 'reduce-motion';
reduceMotionButton.innerText = 'Reduce Motion';
document.querySelector('header').appendChild(reduceMotionButton);

// Function to toggle reduce motion
function reduceMotion() {
  if (animation.transitionDuration !== '0s') {
    animation.transitionDuration = '0s';
    animation.revealDistance = 0;
  } else {
    animation.transitionDuration = '2s';
    animation.revealDistance = 150;
  }
  revealableContainers.forEach((container) => {
    container.style.transitionDuration = animation.transitionDuration;
  });
}

// Event listener for reduce motion button
reduceMotionButton.addEventListener('click', reduceMotion);


// ===================================
// DARK/LIGHT THEME
// Set initial theme from LocalStorage
document.onload = setInitialTheme(localStorage.getItem('theme'));
function setInitialTheme(themeKey) {
  if (themeKey === 'dark') {
    document.documentElement.classList.add('darkTheme');
  } else {
    document.documentElement.classList.remove('darkTheme');
  }
}

// Toggle theme button
toggleThemeBtn.addEventListener('click', () => {
  // Toggle root class
  document.documentElement.classList.toggle('darkTheme');

  // Saving current theme on LocalStorage
  if (document.documentElement.classList.contains('darkTheme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// ===================================
// STORIES SCROLL BUTTONS
// Scrolling stories content
storiesLeftButton.addEventListener('click', () => {
  storiesContent.scrollLeft -= 320;
});
storiesRightButton.addEventListener('click', () => {
  storiesContent.scrollLeft += 320;
});

// Checking if screen has minimun size of 1024px
if (window.matchMedia('(min-width: 1024px)').matches) {
  // Observer to hide buttons when necessary
  const storiesObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.target === document.querySelector('.story:first-child')) {
          storiesLeftButton.style.display = entry.isIntersecting
            ? 'none'
            : 'unset';
        } else if (
          entry.target === document.querySelector('.story:last-child')
        ) {
          storiesRightButton.style.display = entry.isIntersecting
            ? 'none'
            : 'unset';
        }
      });
    },
    { root: storiesContent, threshold: 1 }
  );

  // Calling the observer with the first and last stories
  storiesObserver.observe(document.querySelector('.story:first-child'));
  storiesObserver.observe(document.querySelector('.story:last-child'));
}

// ===================================
// POST MULTIPLE MEDIAS
// Creating scroll buttons and indicators when post has more than one media
posts.forEach((post) => {
  if (post.querySelectorAll('.post__media').length > 1) {
    const leftButtonElement = document.createElement('button');
    leftButtonElement.classList.add('post__left-button');
    leftButtonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#fff" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z"></path>
      </svg>
    `;

    const rightButtonElement = document.createElement('button');
    rightButtonElement.classList.add('post__right-button');
    rightButtonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#fff" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z"></path>
      </svg>
    `;

    post.querySelector('.post__content').appendChild(leftButtonElement);
    post.querySelector('.post__content').appendChild(rightButtonElement);

    post.querySelectorAll('.post__media').forEach(function () {
      const postMediaIndicatorElement = document.createElement('div');
      postMediaIndicatorElement.classList.add('post__indicator');

      post
        .querySelector('.post__indicators')
        .appendChild(postMediaIndicatorElement);
    });

    // Observer to change the actual media indicator
    const postMediasContainer = post.querySelector('.post__medias');
    const postMediaIndicators = post.querySelectorAll('.post__indicator');
    const postIndicatorObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Removing all the indicators
            postMediaIndicators.forEach((indicator) =>
              indicator.classList.remove('post__indicator--active')
            );
            // Adding the indicator that matches the current post media
            postMediaIndicators[
              Array.from(postMedias).indexOf(entry.target)
            ].classList.add('post__indicator--active');
          }
        });
      },
      { root: postMediasContainer, threshold: 0.5 }
    );

    // Calling the observer for every post media
    const postMedias = post.querySelectorAll('.post__media');
    postMedias.forEach((media) => {
      postIndicatorObserver.observe(media);
    });
  }
});

// Adding buttons features on every post with multiple medias
postsContent.forEach((post) => {
  if (post.querySelectorAll('.post__media').length > 1) {
    const leftButton = post.querySelector('.post__left-button');
    const rightButton = post.querySelector('.post__right-button');
    const postMediasContainer = post.querySelector('.post__medias');

    // Functions for left and right buttons
    leftButton.addEventListener('click', () => {
      postMediasContainer.scrollLeft -= 400;
    });
    rightButton.addEventListener('click', () => {
      postMediasContainer.scrollLeft += 400;
    });

    // Observer to hide button if necessary
    const postButtonObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.target === post.querySelector('.post__media:first-child')) {
            leftButton.style.display = entry.isIntersecting ? 'none' : 'unset';
          } else if (
            entry.target === post.querySelector('.post__media:last-child')
          ) {
            rightButton.style.display = entry.isIntersecting ? 'none' : 'unset';
          }
        });
      },
      { root: postMediasContainer, threshold: 0.5 }
    );

    if (window.matchMedia('(min-width: 1024px)').matches) {
      postButtonObserver.observe(
        post.querySelector('.post__media:first-child')
      );
      postButtonObserver.observe(post.querySelector('.post__media:last-child'));
    }
  }
});

// Initial count for signatures
let count = 3; // Adjust if needed

// Query the 'Sign Now' button
const signNowButton = document.getElementById("sign-now-button");

// Function to add a new signature
const addSignature = (person) => {
  const newSignature = document.createElement("p");
  newSignature.textContent = `🖊️ ${person.name} from ${person.hometown} supports this.`;

  document.querySelector(".signatures").appendChild(newSignature);

  // Update the counter
  count += 1;
  const counter = document.getElementById("counter");
  counter.textContent = `🖊️ ${count} people have signed this petition and support this cause.`;
};

// Function to validate form
const validateForm = () => {
  let containsErrors = false;
  const petitionInputs = document.getElementById("sign-petition").elements;

  // Create the person object with properties
  const person = {
      name: document.getElementById("name").value,
      hometown: document.getElementById("hometown").value,
      email: document.getElementById("email").value
  };

  // Validate each input
  for (let i = 0; i < petitionInputs.length; i++) {
      if (petitionInputs[i].value.length < 2) {
          petitionInputs[i].classList.add("error");
          containsErrors = true;
      } else {
          petitionInputs[i].classList.remove("error");
      }
  }

  // Check if email contains '.com'
  if (!person.email.includes(".com")) {
      document.getElementById("email").classList.add("error");
      containsErrors = true;
  } else {
      document.getElementById("email").classList.remove("error");
  }

  // If no errors, add the signature and reset the form
  if (!containsErrors) {
    addSignature(person);
    toggleModal(person);
    for (let i = 0; i < petitionInputs.length; i++) {
        petitionInputs[i].value = "";
    }
  }
};

// Add event listener to validate form on 'Sign Now' button click
signNowButton.addEventListener("click", validateForm);

let scaleFactor = 1;
const modalImage = document.querySelector('#thanks-modal img');

const scaleImage = () => {
  if (scaleFactor === 1) {
    scaleFactor = 0.8;
  } else {
    scaleFactor = 1;
  }
  modalImage.style.transform = `scale(${scaleFactor})`;
};

// Function to toggle the modal
const toggleModal = (person) => {
  const modal = document.getElementById("thanks-modal");
  const modalContent = document.getElementById("thanks-modal-content");

  if (!person) return;

  // Set the display to flex to make the modal visible
  modal.style.display = "flex";
  modalContent.textContent = `Thank you so much, ${person.name} from ${person.hometown}, for supporting our cause!`;

  const intervalId = setInterval(scaleImage, 500);
  // Set a timeout to hide the modal after 4 seconds
  setTimeout(() => {
      modal.style.display = "none";
      clearInterval(intervalId);
  }, 4000);
};

// Add event listener to the close button
document.getElementById("close-modal-button").addEventListener("click", () => {
  document.getElementById("thanks-modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("thanks-modal");
  if (modal) {
    modal.style.display = "none";
  }
});


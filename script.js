'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//button scroll
btnScrollTo.addEventListener('click', function (e) {
  const s1Coords = section1.getBoundingClientRect(); // relative to view port
  console.log(s1Coords);
  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x/y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'heiight/ width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //scrolling
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});
//  *******************************************
//page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// method 2 event deligation
//  1. add event Listner to common parent element
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matcing strategy
  if (e.target.classList.contains('nav__link')) {
    console.log('link');
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabs.forEach(t => t.addEventListener('click', () => console.log('tab')));

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // perfect example of closest

  console.log(clicked);
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

// const handleover = function (ev, op) {
//   if (ev.classList.contains('nav__link')) {
//     const link = ev;
//     const sib = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     sib.forEach(el => {
//       if (el !== link) {
//         el.style.opacity = op;
//       }
//     });
//     logo.style.opacity = op;
//   }
// };

// // Menu fade animation
// nav.addEventListener('mouseover', function (e) {
//   console.log(this);
//   handleover(e.target, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleover(e.target, 1);
// });

// another way to implement above handleover is

const handleover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sib = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sib.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

// Menu fade animation
nav.addEventListener('mouseover', handleover.bind(0.5));
nav.addEventListener('mouseout', handleover.bind(1));
//mouseenter doesnot bubble whereas mouse hover bubble

//*************************************************************** */

//Sticky navigation
// const intialcoor = section1.getBoundingClientRect();
// console.log(intialcoor);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > intialcoor.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

//sticky navigation: Insertion observer Api
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// }; // call back is call each time when our target element intersect root at threshold
// const obsOption = {
//   root: null,
//   threshold: 0.1, //10 pprecent
// };
// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1); //target is section

const header = document.querySelector('.header');
const stickyNav = function (enteries) {
  const [entry] = enteries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});
headerObserver.observe(header);

// *******************************************************

//reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target); // remove observer once class is remove
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

//lazy loading images
const imgtarget = document.querySelectorAll('img[data-src]');
console.log(imgtarget);
const loading = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  //replace src with data-src

  entry.target.src = entry.target.dataset.src;
  //javascript load image when we change the image src
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgtarget.forEach(imgs => imageObserver.observe(imgs));
//  **********************************************************

//slider
const slides = document.querySelectorAll('.slide');

const btnLeft = document.querySelector('.slider__btn--left');
const btnright = document.querySelector('.slider__btn--right');

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.2)';
// slider.style.overflow = 'visible';

let currentslide = 0;
const maxslide = slides.length;

const createDot = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide ="${i}"></button>`
    );
  });
};
createDot();

const changeIndicator = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  console.log(document.querySelector(`.dots__dot[data-slide="${slide}"]`));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
changeIndicator(0);
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};
goToSlide(0);

const nxtSlide = function () {
  if (currentslide === maxslide - 1) {
    currentslide = 0;
  } else {
    currentslide++;
  }
  goToSlide(currentslide);
  changeIndicator(currentslide);
};

const prevSlide = function () {
  if (currentslide === 0) {
    currentslide = maxslide - 1;
  } else {
    currentslide--;
  }
  goToSlide(currentslide);
  changeIndicator(currentslide);
};
//nextslide
btnright.addEventListener('click', nxtSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nxtSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    changeIndicator(slide);
  }
});

//************************************************************************************ */
// const randomColorNum = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomColorNum(0, 255)},${randomColorNum(0, 255)},${randomColorNum(
//     0,
//     255
//   )})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   e.stopPropagation();
//   console.log(this === e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(this === e.currentTarget);
// });

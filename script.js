'use strict'; 

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const initialCoords = section1.getBoundingClientRect();
const navHeight = nav.getBoundingClientRect().height;
const imgTargets = document.querySelectorAll('img[data-src]');
let curSlide = 0;
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const maxSlide = slides.length;
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const sliderFunc = function() {
  const createDots = function() {
    slides.forEach((s, i) => {
      dotContainer
      .insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    })
  }
  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    })
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }
  const goToSlide = function(slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }
  const nextSlide = function() {
    if(curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;  
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }
  const prevSlide = function() {
    if(curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }
  const init = function() {
    createDots();
    goToSlide(0);
    activateDot(0);
  }
  init();
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function(e) {
    if(e.key === 'ArrowRight') {
      nextSlide();
    } else if(e.key === 'ArrowLeft') {
      prevSlide();
    }
  })
  dotContainer.addEventListener('click', function(e) {
    const dot = e.target;
    if(dot.classList.contains('dots__dot')) {
      const slide = dot.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  })
  setInterval(nextSlide, 5000);
}
sliderFunc();
const loadImg = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})
imgTargets.forEach(img => {
  imgObserver.observe(img);
})
const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})
const allSections = document.querySelectorAll('.section');
allSections.forEach(sec => {
  sectionObserver.observe(sec)
  sec.classList.add('section--hidden');
});
const stickyNav = function(entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);
const handleHover = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if(el !== link) {
        el.style.opacity = this;      
      }    
    })
    logo.style.opacity = this; 
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.5))
nav.addEventListener('mouseout', handleHover.bind(1))
tabsContainer.addEventListener('click', function(e) {
  e.preventDefault();
  const el = e.target.closest('.operations__tab');
  if(!el) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  el.classList.add('operations__tab--active');
  tabsContent
  .forEach(tab => tab.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${el.dataset.tab}`)
  .classList.add('operations__content--active');
})
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  const el = e.target;
  if(el.classList.contains('nav__link')) {
    const id = el.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})
btnScrollTo.addEventListener('click', function(e) {
  section1.scrollIntoView({behavior: 'smooth'});
})
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.classList.add('cookie-message');
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
document.querySelector('.btn--close-cookie')
.addEventListener('click', function() {
  message.remove();
})
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
console.log(window.screen.width);
if (window.screen.width <= 768) {
  tabs.forEach((tab, i) => tab.innerHTML = `<span>0${i+1}</span>`);
} 

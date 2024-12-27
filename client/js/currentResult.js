// Function to animate the text when it comes into view
function animateTextOnScroll() {
    const ctaLines = document.querySelectorAll('.cta-line');
    ctaLines.forEach((line, index) => {
      if (isElementInViewport(line)) {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Function to check if an element is in the viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Add event listener for scrolling
  document.addEventListener('scroll', animateTextOnScroll);
  
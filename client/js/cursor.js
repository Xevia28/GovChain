

// Initialize GSAP animation
const cursor = document.querySelector('.custom-cursor');

// Function to increase cursor size
function increaseCursorSize() {
    gsap.to(cursor, {
        width: 70,
        height: 70,
        duration: 0.3,
        ease: 'power2.out'
    });
}

// Function to reset cursor size
function resetCursorSize() {
    gsap.to(cursor, {
        width: 50,
        height: 50,
        duration: 0.3,
        ease: 'power2.out'
    });
}

// Add event listener to track mouse movement
document.addEventListener('mousemove', e => {
    // Get mouse position
    const { clientX: x, clientY: y } = e;

    // Update cursor position using GSAP
    gsap.to(cursor, {
        x: x - 25, // Offset to center cursor
        y: y - 25, // Offset to center cursor
        duration: 0.3, // Animation duration
        ease: 'power2.out' // Easing function
    });
});

// Get all buttons and anchor tags
const clickableElements = document.querySelectorAll('button, a');

// Add event listeners to buttons and anchor tags
clickableElements.forEach(element => {
    // Increase cursor size on hover
    element.addEventListener('mouseenter', increaseCursorSize);
    // Reset cursor size on mouse leave
    element.addEventListener('mouseleave', resetCursorSize);
});

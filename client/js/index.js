document.addEventListener("DOMContentLoaded", function() {
    const target = document.querySelector('.middle-text-container');
    let hasScrolled = false;

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function onScroll() {
        if (!hasScrolled && isInViewport(target)) {
            target.classList.add('scrolled-down');
            hasScrolled = true;
            window.removeEventListener('scroll', onScroll);
        }
    }

    window.addEventListener('scroll', onScroll);
    onScroll();  // Trigger the function initially in case the element is already in view
});

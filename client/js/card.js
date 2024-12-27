// // Wrap the code in a window load event listener to ensure all elements are loaded before executing
// window.addEventListener('load', function() {
//     // Import GSAP and SplitText if not already done
//     // gsap.registerPlugin(Observer); // Observer is not defined, remove this line

//     // Select elements from the DOM
//     let containers = document.querySelectorAll(".service-detail-container"), // Changed from "section"
//         images = document.querySelectorAll(".bg"),
//         headings = document.querySelectorAll(".service-header"), // Changed from ".section-heading"
//         outerWrappers = document.querySelectorAll(".outer"), // Changed from gsap.utils.toArray
//         innerWrappers = document.querySelectorAll(".inner"), // Changed from gsap.utils.toArray
//         currentIndex = -1,
//         wrap = gsap.utils.wrap(0, containers.length),
//         animating;

//     // Set initial positions of outer and inner wrappers
//     gsap.set(outerWrappers, { yPercent: 100 });
//     gsap.set(innerWrappers, { yPercent: -100 });

//     // Function to animate to a specific section
//     function gotoSection(index, direction) {
//         index = wrap(index); // make sure it's valid
//         animating = true;
//         let fromTop = direction === -1,
//             dFactor = fromTop ? -1 : 1,
//             tl = gsap.timeline({
//                 defaults: { duration: 1.25, ease: "power1.inOut" },
//                 onComplete: () => animating = false
//             });
//         if (currentIndex >= 0) {
//             // The first time this function runs, current is -1
//             gsap.set(containers[currentIndex], { zIndex: 0 });
//             tl.to(images[currentIndex], { yPercent: -15 * dFactor })
//                 .set(containers[currentIndex], { autoAlpha: 0 });
//         }
//         gsap.set(containers[index], { autoAlpha: 1, zIndex: 1 });
//         tl.fromTo([outerWrappers[index], innerWrappers[index]], {
//                 yPercent: i => i ? -100 * dFactor : 100 * dFactor
//             }, {
//                 yPercent: 0
//             }, 0)
//             .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
//             .fromTo(headings[index].children, { // Changed from splitHeadings[index].chars
//                 autoAlpha: 0,
//                 yPercent: 150 * dFactor
//             }, {
//                 autoAlpha: 1,
//                 yPercent: 0,
//                 duration: 1,
//                 ease: "power2",
//                 stagger: {
//                     each: 0.02,
//                     from: "random"
//                 }
//             }, 0.2);

//         currentIndex = index;
//     }

//     // Event listener for wheel, touch, and pointer events
//     window.addEventListener('wheel', (event) => {
//         if (!animating) {
//             if (event.deltaY < 0) {
//                 gotoSection(currentIndex - 1, -1);
//             } else {
//                 gotoSection(currentIndex + 1, 1);
//             }
//         }
//     });

//     // Initialize by animating to the first section
//     gotoSection(0, 1);
// });

/**
 * Vue directive that calls the bound handler when the user clicks outside the element.
 * Shared by the main app and the off-screen style preview renderer.
 */
export const clickOutside = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = (event) => {
            // This should not fire when a driver.js tour is active
            if (document.body.classList.contains("driver.active")) return;

            if (!(el === event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: (el) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};

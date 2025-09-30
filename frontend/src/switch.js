/**
 * switch function
 * default is light mode, click to toggle to dark mode
 */
function toggleTheme() {
    const htmlEl = document.documentElement; // get the <html> element
    const currentTheme = htmlEl.getAttribute("data-theme");

    if (currentTheme === "dark") {
        // currently dark → switch back to light
        htmlEl.removeAttribute("data-theme");
    } else {
        // currently light → switch to dark
        htmlEl.setAttribute("data-theme", "dark");
    }
}

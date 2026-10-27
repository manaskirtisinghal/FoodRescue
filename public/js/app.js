(() => {
    const root = document.documentElement;
    const toggle = document.getElementById("theme-toggle");
    const storedTheme = localStorage.getItem("food-rescue-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

    function applyTheme(theme) {
        const isDark = theme === "dark";
        root.setAttribute("data-bs-theme", theme);
        if (toggle) {
            toggle.setAttribute("aria-pressed", String(isDark));
            toggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
            toggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
            toggle.querySelector(".theme-label").textContent = isDark ? "Light mode" : "Dark mode";
        }
    }

    applyTheme(initialTheme);
    toggle?.addEventListener("click", () => {
        const nextTheme = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        localStorage.setItem("food-rescue-theme", nextTheme);
        applyTheme(nextTheme);
    });

    document.querySelectorAll(".needs-validation").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        });
    });

    document.addEventListener("error", (event) => {
        const image = event.target;
        if (!(image instanceof HTMLImageElement)) return;

        if (image.hasAttribute("data-logo-image")) {
            image.hidden = true;
            return;
        }

        const fallback = image.dataset.imageFallback;
        if (fallback && image.src !== new URL(fallback, window.location.href).href) {
            image.dataset.imageFallback = "";
            image.src = fallback;
        }
    }, true);
})();

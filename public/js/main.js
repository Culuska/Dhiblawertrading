document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

document.querySelectorAll(".link-arrow[data-interest]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const interestField = document.getElementById("interest");
    if (interestField) interestField.value = btn.dataset.interest;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
});

const sections = ["top", "about", "products", "why-us", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navAnchors = document.querySelectorAll(".nav-links a");
if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
  const setActive = (id) => {
    navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending...";
    status.className = "form-status";

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        status.textContent = "Thank you! Your request has been sent — we'll be in touch shortly.";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent = result.error || "Something went wrong. Please try again.";
        status.className = "form-status error";
      }
    } catch (err) {
      status.textContent = "Network error. Please try again.";
      status.className = "form-status error";
    }
  });
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const revealItems = document.querySelectorAll("[data-reveal]");
const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const currentYear = document.querySelector("#current-year");
let headerStateQueued = false;

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  headerStateQueued = false;
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const requestHeaderState = () => {
  if (headerStateQueued) return;
  headerStateQueued = true;
  window.requestAnimationFrame(setHeaderState);
};

setHeaderState();
window.addEventListener("scroll", requestHeaderState, { passive: true });

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (revealItems.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top <= window.innerHeight * 0.9) {
      item.classList.add("is-visible");
      return;
    }

    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      feedback.textContent = "Merci de compléter tous les champs avant l’envoi.";
      feedback.className = "form-feedback is-error";
      return;
    }

    const formData = new FormData(contactForm);
    const recipient = contactForm.dataset.recipient || "contact@denis-cloarec.fr";
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent("Demande de devis - Denis Cloarec");
    const body = encodeURIComponent(
      [
        "Bonjour Denis Cloarec,",
        "",
        "Je souhaite recevoir un devis pour l'entretien de mes extérieurs.",
        "",
        `Nom : ${name}`,
        `Téléphone : ${phone}`,
        "",
        "Message :",
        message
      ].join("\n")
    );

    feedback.textContent = "Votre messagerie va s’ouvrir avec votre demande pré-remplie.";
    feedback.className = "form-feedback is-success";

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
}

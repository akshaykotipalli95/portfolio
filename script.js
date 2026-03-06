const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const toggleCertificatesBtn = document.getElementById("toggleCertificates");
const extraCertificates = document.querySelectorAll(".cert-item-extra");
let closeMobileMenu = () => {};

if (menuBtn && navLinks) {
  menuBtn.setAttribute("aria-expanded", "false");

  closeMobileMenu = () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });
}

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    closeMobileMenu();
  });
});

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = document.querySelectorAll("main section[id]");
if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting && link) {
          document.querySelectorAll(".nav-links a").forEach((item) => item.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (event.clientY - centerY) / 18;
    const rotateY = (centerX - event.clientX) / 18;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const recipient = "kotipalliakshay51@gmail.com";
    const submittedAt = new Date().toLocaleString();
    const sourcePage = window.location.href;
    const formattedMessage = [
      "New contact form submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Submitted: ${submittedAt}`,
      `Source: ${sourcePage}`,
      "",
      "Message:",
      message,
    ].join("\n");

    let statusEl = formStatus;
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.id = "formStatus";
      statusEl.className = "form-note";
      contactForm.appendChild(statusEl);
    }

    statusEl.textContent = "Sending message...";

    fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message: formattedMessage,
        _subject: `New Portfolio Enquiry | ${name}`,
        _replyto: email,
        _captcha: "false",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        return response.json();
      })
      .then(() => {
        statusEl.textContent = "Message sent successfully.";
        contactForm.reset();
      })
      .catch(() => {
        statusEl.textContent = "Unable to send right now. Please try again.";
      });
  });
}

if (toggleCertificatesBtn && extraCertificates.length) {
  toggleCertificatesBtn.addEventListener("click", () => {
    const isExpanded = toggleCertificatesBtn.dataset.expanded === "true";

    extraCertificates.forEach((item) => {
      item.classList.toggle("show", !isExpanded);
    });

    toggleCertificatesBtn.dataset.expanded = String(!isExpanded);
    toggleCertificatesBtn.textContent = isExpanded ? "View All Certificates" : "View Less";
  });
}


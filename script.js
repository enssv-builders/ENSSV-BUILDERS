// Mobile navigation toggle.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Fade elements into view while scrolling.
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Basic cost estimator UI calculation.
const estimateBtn = document.getElementById("estimateBtn");
const estimateType = document.getElementById("estimateType");
const areaInput = document.getElementById("areaInput");
const estimateResult = document.getElementById("estimateResult");

estimateBtn.addEventListener("click", () => {
  const rate = Number(estimateType.value);
  const area = Number(areaInput.value);

  if (!area || area <= 0) {
    estimateResult.textContent = "Please enter a valid area in sqft.";
    return;
  }

  const total = rate * area;
  estimateResult.textContent = `Estimated project cost: Rs. ${total.toLocaleString("en-IN")}`;
});

// Supabase settings. Replace these two values with your Supabase project details.
const SUPABASE_URL = "https://qvksllbqiwefmcdkxpym.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8umaCneb4MTR2_wgWnMv6Q_Ud-RxbAo";
const LEADS_TABLE = "leads";

const isSupabaseConfigured =
  SUPABASE_URL.includes("supabase.co") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY");

const supabaseClient =
  window.supabase && isSupabaseConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Lead form submission connected to Supabase.
const leadForm = document.getElementById("leadForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const submitButton = leadForm.querySelector(".form-submit");

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  successMessage.classList.remove("show");
  errorMessage.classList.remove("show");

  const formData = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    project_type: document.getElementById("projectType").value,
    message: document.getElementById("message").value.trim(),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    if (!supabaseClient) {
      throw new Error("Supabase is not configured yet.");
    }

    const { error } = await supabaseClient.from(LEADS_TABLE).insert([formData]);

    if (error) {
      throw error;
    }

    successMessage.textContent = "Thank you. Your request has been saved successfully.";
    successMessage.classList.add("show");
    leadForm.reset();
  } catch (error) {
    errorMessage.textContent = "Unable to save your request. Please check Supabase settings and try again.";
    errorMessage.classList.add("show");
    console.error("Supabase form error:", error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Request";
  }
});

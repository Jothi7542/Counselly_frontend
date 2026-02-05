
function hideAll() {
  document.querySelectorAll(".form-box")
    .forEach(el => el.classList.add("hidden"));
}
function showClientLogin() {
  hideAll();
  document.getElementById("mainTitle").innerText = "Login";
  document.getElementById("clientLogin").classList.remove("hidden");
}

function showCounsellorLogin() {
  hideAll();
  document.getElementById("mainTitle").innerText = "Login";
  document.getElementById("counsellorLogin").classList.remove("hidden");
}

function showClientSignup() {
  hideAll();
  document.getElementById("mainTitle").innerText = "Sign Up";
  document.getElementById("clientSignup").classList.remove("hidden");
}

function showCounsellorSignup() {
  hideAll();
  document.getElementById("mainTitle").innerText = "Sign Up";
  document.getElementById("counsellorSignup").classList.remove("hidden");
}

// Client Signup
document.getElementById("clientSignup").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("cls_name").value,
    email: document.getElementById("cls_email").value,
    password: document.getElementById("cls_password").value,
    age: parseInt(document.getElementById("cls_age").value),
    gender: document.getElementById("cls_gender").value,
    phone_number: document.getElementById("cls_phone").value,
    language: [document.getElementById("cls_language").value],
    address: document.getElementById("cls_address").value
  };

  try {
    const response = await API.auth.clientSignup(data);
    TokenManager.set(response.access_token);
    UserManager.set(response.user);
    alert("Signup successful!");
    window.location.href = "../Index.html"; // Redirect to home
  } catch (error) {
    alert(error.message || "Signup failed. Please try again.");
  }
});

// Client Login
document.getElementById("clientLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  try {
    const response = await API.auth.clientLogin(email, password);
    TokenManager.set(response.access_token);
    UserManager.set(response.user);
    window.location.href = "../Index.html";
  } catch (error) {
    alert(error.message || "Invalid email or password");
  }
});

// Counsellor Signup
document.getElementById("counsellorSignup").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("cs_name").value,
    email: document.getElementById("cs_email").value,
    password: document.getElementById("cs_password").value,
    age: parseInt(document.getElementById("cs_age").value),
    gender: document.getElementById("cs_gender").value,
    phone_number: document.getElementById("cs_phone").value,
    speaks: [document.getElementById("cs_language").value],
    experience: parseInt(document.getElementById("cs_exp").value) || 0,
    address: document.getElementById("cs_address").value,
    specialization: document.getElementById("cs_spec").value || "Counselling Psychologist",
    profile_image: document.getElementById("cs_image").value,
    about: document.getElementById("cs_about").value
  };

  // Ensure speaks is an array
  const speaksVal = document.getElementById("cs_language").value;
  data.speaks = speaksVal ? [speaksVal] : ["English"];

  try {
    const btn = this.querySelector('button');
    btn.disabled = true;
    btn.innerText = "Registering...";

    const res = await API.auth.counsellorSignup(data);
    TokenManager.set(res.access_token);
    UserManager.set(res.user);
    alert("Signup successful!");
    window.location.href = "./Counsellor_dashboard.html";
  } catch (error) {
    alert(error.message || "Registration failed. " + (error.detail || ""));
  } finally {
    const btn = this.querySelector('button');
    btn.disabled = false;
    btn.innerText = "Register Now";
  }
});

// Counsellor Login
document.getElementById("counsellorLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("c_email").value;
  const password = document.getElementById("c_password").value;

  try {
    const response = await API.auth.counsellorLogin(email, password);
    TokenManager.set(response.access_token);
    UserManager.set(response.user);
    window.location.href = "./Counsellor_dashboard.html";
  } catch (error) {
    alert(error.message || "Invalid email or password");
  }
});

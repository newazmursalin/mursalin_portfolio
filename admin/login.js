const form = document.getElementById("login-form");
const message = document.getElementById("message");
form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "Signing in…";
  try {
    const result = await auth.signInWithEmailAndPassword(
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );
    if (result.user.uid !== "X7fuenW6cPUolOJ5fBvfYCsE9Sn2") {
      await auth.signOut();
      message.textContent = "This account is not authorized as the portfolio admin.";
      return;
    }
    window.location.href = "dashboard.html";
  } catch (error) {
    message.textContent = error.message || "Could not sign in.";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

function safeText(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function renderProjects(snapshot) {
  const grid = document.getElementById("portfolio-grid");
  if (snapshot.empty) {
    grid.innerHTML = '<p class="muted">No projects published yet. Add your first project from the admin panel.</p>';
    return;
  }
  grid.innerHTML = "";
  snapshot.forEach(doc => {
    const p = doc.data();
    const card = document.createElement("article");
    card.className = "project-card";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = safeText(p.title, "Portfolio project");
    img.src = safeText(p.imageUrl, "");
    const info = document.createElement("div");
    info.className = "project-info";
    const title = document.createElement("h3");
    title.textContent = safeText(p.title, "Untitled project");
    const desc = document.createElement("p");
    desc.textContent = [safeText(p.category), safeText(p.description)].filter(Boolean).join(" · ");
    info.append(title, desc);
    card.append(img, info);
    grid.append(card);
  });
}
db.collection("portfolio").orderBy("createdAt", "desc").onSnapshot(renderProjects, err => {
  document.getElementById("portfolio-grid").textContent = "Portfolio is not available right now.";
  console.error(err);
});
db.collection("profile").doc("main").onSnapshot(doc => {
  if (!doc.exists) return;
  const p = doc.data();
  if (p.bio) document.getElementById("hero-bio").textContent = p.bio;
  if (p.about) document.getElementById("about-text").textContent = p.about;
  if (p.email) {
    document.getElementById("contact-email").textContent = p.email;
    document.getElementById("email-button").href = "mailto:" + p.email;
  }
  if (p.name) document.title = p.name + " | Graphic Designer";
}, err => console.error(err));
db.collection("socialLinks").doc("main").onSnapshot(doc => {
  const el = document.getElementById("social-links");
  if (!doc.exists) return;
  el.innerHTML = "";
  const links = doc.data();
  Object.entries(links).forEach(([name, url]) => {
    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return;
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = name;
    el.appendChild(a);
  });
}, err => console.error(err));

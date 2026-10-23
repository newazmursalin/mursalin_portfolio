const ADMIN_UID = "X7fuenW6cPUolOJ5fBvfYCsE9Sn2";
const $ = id => document.getElementById(id);
let currentUser = null;

auth.onAuthStateChanged(async user => {
  if (!user || user.uid !== ADMIN_UID) {
    if (user) await auth.signOut();
    window.location.replace("index.html");
    return;
  }
  currentUser = user;
  loadProfile(); loadSocial(); loadProjects();
});
$("logout").addEventListener("click", () => auth.signOut().then(() => window.location.replace("index.html")));

async function loadProfile() {
  try {
    const snap = await db.collection("profile").doc("main").get();
    if (!snap.exists) return;
    const p = snap.data();
    $("name").value = p.name || "Newaz Mursalin";
    $("bio").value = p.bio || "";
    $("about").value = p.about || "";
    $("contactEmail").value = p.email || "";
  } catch (e) { $("profile-status").textContent = e.message; }
}
$("profile-form").addEventListener("submit", async e => {
  e.preventDefault(); $("profile-status").textContent = "Saving…";
  try {
    await db.collection("profile").doc("main").set({
      name: $("name").value.trim(), bio: $("bio").value.trim(),
      about: $("about").value.trim(), email: $("contactEmail").value.trim(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});
    $("profile-status").textContent = "Profile saved.";
  } catch (err) { $("profile-status").textContent = err.message; }
});
$("project-form").addEventListener("submit", async e => {
  e.preventDefault(); $("project-status").textContent = "Publishing…";
  try {
    await db.collection("portfolio").add({
      title: $("title").value.trim(), category: $("category").value.trim(),
      imageUrl: $("imageUrl").value.trim(), description: $("description").value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    e.target.reset(); $("project-status").textContent = "Project published.";
  } catch (err) { $("project-status").textContent = err.message; }
});
function loadProjects() {
  db.collection("portfolio").orderBy("createdAt","desc").onSnapshot(snap => {
    const list = $("projects-list"); list.innerHTML = "";
    if (snap.empty) { list.textContent = "No projects yet."; return; }
    snap.forEach(doc => {
      const p = doc.data();
      const row = document.createElement("div"); row.className = "project-row";
      const img = document.createElement("img"); img.src = p.imageUrl || ""; img.alt = "";
      const title = document.createElement("div"); title.innerHTML = "";
      const h = document.createElement("strong"); h.textContent = p.title || "Untitled";
      const small = document.createElement("div"); small.className = "muted"; small.textContent = p.category || "";
      title.append(h, small);
      const del = document.createElement("button"); del.className = "delete"; del.textContent = "Delete";
      del.addEventListener("click", async () => {
        if (confirm(`Delete "${p.title || "this project"}"?`)) {
          try { await db.collection("portfolio").doc(doc.id).delete(); }
          catch (err) { alert(err.message); }
        }
      });
      row.append(img, title, del); list.append(row);
    });
  }, err => { $("projects-list").textContent = err.message; });
}
async function loadSocial() {
  try {
    const snap = await db.collection("socialLinks").doc("main").get();
    if (!snap.exists) return;
    const s = snap.data();
    ["facebook","instagram","linkedin","youtube"].forEach(k => $(k).value = s[k] || "");
  } catch (e) { $("social-status").textContent = e.message; }
}
$("social-form").addEventListener("submit", async e => {
  e.preventDefault(); $("social-status").textContent = "Saving…";
  try {
    await db.collection("socialLinks").doc("main").set({
      facebook: $("facebook").value.trim(), instagram: $("instagram").value.trim(),
      linkedin: $("linkedin").value.trim(), youtube: $("youtube").value.trim()
    }, {merge:true});
    $("social-status").textContent = "Social links saved.";
  } catch (err) { $("social-status").textContent = err.message; }
});

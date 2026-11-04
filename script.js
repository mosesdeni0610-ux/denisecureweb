
/* ==================================
   KONFIGURASI SUPABASE
================================== */

const SUPABASE_URL =
    "https://arhtbxegckbolkttmpde.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_dZH0EO0i79rNkNUMqbn5Fg_4msK0Es8";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* ==================================
   ELEMENT WEBSITE
================================== */

const loginPage = document.getElementById("loginPage");
const portfolioPage = document.getElementById("portfolioPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const authMessage = document.getElementById("authMessage");

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");


/* ==================================
   TAMPILKAN PESAN
================================== */

function tampilkanPesan(teks, warna = "red") {
    authMessage.textContent = teks;
    authMessage.style.color = warna;
}


/* ==================================
   PINDAH FORM
================================== */

document.getElementById("showRegister").addEventListener("click", function(e) {
    e.preventDefault();

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    tampilkanPesan("");
});

document.getElementById("showLogin").addEventListener("click", function(e) {
    e.preventDefault();

    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

    tampilkanPesan("");
});


/* ==================================
   TAMPILKAN HALAMAN BERDASARKAN SESI
================================== */

function tampilkanPortfolio(user) {
    loginPage.classList.add("hidden");
    portfolioPage.classList.remove("hidden");

    const nama =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Pengguna";

    userName.textContent = nama;
    userEmail.textContent = user.email || "";
}

function tampilkanLogin() {
    portfolioPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
}


/* ==================================
   REGISTER AKUN
================================== */

registerForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nama = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (password.length < 8) {
        tampilkanPesan("Password minimal 8 karakter.");
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Memproses...";

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: window.location.href,
                data: {
                    full_name: nama
                }
            }
        });

        if (error) throw error;

        registerForm.reset();

        if (data.session) {
            tampilkanPortfolio(data.user);
        } else {
            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");

            tampilkanPesan(
                "Pendaftaran berhasil. Silakan periksa email untuk verifikasi.",
                "green"
            );
        }

    } catch (error) {
        tampilkanPesan(error.message);

    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Buat Akun";
    }
});


/* ==================================
   LOGIN
================================== */

loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    loginButton.disabled = true;
    loginButton.textContent = "Memeriksa akun...";

    try {
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) throw error;

        loginForm.reset();

        tampilkanPortfolio(data.user);

    } catch (error) {
        tampilkanPesan(error.message);

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});


/* ==================================
   LOGOUT
================================== */

document.getElementById("logoutButton").addEventListener("click", async function() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert("Gagal logout: " + error.message);
        return;
    }

    tampilkanLogin();
});


/* ==================================
   CEK SESI LOGIN SAAT WEBSITE DIBUKA
================================== */

async function periksaSesi() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        tampilkanLogin();
        tampilkanPesan(error.message);
        return;
    }

    if (data.session) {
        tampilkanPortfolio(data.session.user);
    } else {
        tampilkanLogin();
    }
}

periksaSesi();

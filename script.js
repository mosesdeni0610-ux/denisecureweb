
const SUPABASE_URL = "https://arhtbxegckbolkttmpde.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dZH0EO0i79rNkNUMqbn5Fg_4msK0Es8";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const judul = document.getElementById("judul");
const deskripsi = document.getElementById("deskripsi");
const pesan = document.getElementById("pesan");

function tampilkanPesan(teks, warna = "blue") {
    pesan.textContent = teks;
    pesan.style.color = warna;
}

function tampilkanForm(daftar) {
    loginForm.classList.toggle("hidden", daftar);
    registerForm.classList.toggle("hidden", !daftar);

    judul.textContent = daftar
        ? "Buat Akun"
        : "Selamat Datang!";

    deskripsi.textContent = daftar
        ? "Daftar untuk memulai"
        : "Silakan login ke akun Anda";

    tampilkanPesan("");
}

// Berpindah ke Register
document.getElementById("keRegister").onclick = (e) => {
    e.preventDefault();
    tampilkanForm(true);
};

// Berpindah ke Login
document.getElementById("keLogin").onclick = (e) => {
    e.preventDefault();
    tampilkanForm(false);
};

// PROSES REGISTER
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const konfirmasi = document.getElementById("konfirmasiPassword").value;

    if (password.length < 8) {
        return tampilkanPesan("Password minimal 8 karakter.", "red");
    }

    if (password !== konfirmasi) {
        return tampilkanPesan("Konfirmasi password tidak cocok.", "red");
    }

    const tombol = registerForm.querySelector("button[type=submit]");
    tombol.disabled = true;
    tombol.textContent = "Memproses...";

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.href,
                data: {
                    full_name: nama
                }
            }
        });

        if (error) throw error;

        if (data.session) {
            registerForm.reset();
            tampilkanForm(false);
            tampilkanPesan("Pendaftaran berhasil!", "green");
        } else {
            registerForm.reset();
            tampilkanForm(false);
            tampilkanPesan(
                "Pendaftaran berhasil. Periksa email untuk verifikasi.",
                "green"
            );
        }

    } catch (error) {
        tampilkanPesan(error.message, "red");
    } finally {
        tombol.disabled = false;
        tombol.textContent = "Buat Akun";
    }
});

// PROSES LOGIN
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const tombol = loginForm.querySelector("button[type=submit]");
    tombol.disabled = true;
    tombol.textContent = "Memproses...";

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        tampilkanPesan(
            "Login berhasil! Selamat datang, " + data.user.email,
            "green"
        );

        judul.textContent = "Berhasil Login";
        deskripsi.textContent = "Anda berhasil masuk ke SecureWeb.";

    } catch (error) {
        tampilkanPesan(error.message, "red");
    } finally {
        tombol.disabled = false;
        tombol.textContent = "Login";
    }
});

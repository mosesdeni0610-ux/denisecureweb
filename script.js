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
  judul.textContent = daftar ? "Buat Akun" : "Selamat Datang!";
  deskripsi.textContent = daftar
    ? "Daftar untuk memulai"
    : "Silakan login ke akun Anda";
  tampilkanPesan("");
}

document.getElementById("keRegister").onclick = (e) => {
  e.preventDefault();
  tampilkanForm(true);
};

document.getElementById("keLogin").onclick = (e) => {
  e.preventDefault();
  tampilkanForm(false);
};

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const konfirmasi =
    document.getElementById("konfirmasiPassword").value;

  if (password.length < 8) {
    return tampilkanPesan(
      "Password minimal 8 karakter.",
      "red"
    );
  }

  if (password !== konfirmasi) {
    return tampilkanPesan(
      "Konfirmasi password tidak cocok.",
      "red"
    );
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
      tampilkanPesan(
        "Pendaftaran berhasil! Kamu sudah login.",
        "green"
      );
    } else {
      registerForm.reset();
      tampilkanForm(false);
      tampilkanPesan(
        "Akun berhasil didaftarkan. Periksa email untuk verifikasi.",
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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password =
    document.getElementById("loginPassword").value;

  const tombol = loginForm.querySelector("button[type=submit]");
  tombol.disabled = true;
  tombol.textContent = "Memproses...";

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) throw error;

    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    judul.textContent = "Berhasil Login";
    deskripsi.textContent = "Selamat datang di SecureWeb!";
    tampilkanPesan(
      "Login berhasil: " + data.user.email,
      "green"
    );

    let tombolLogout = document.getElementById("logoutButton");

    if (!tombolLogout) {
      tombolLogout = document.createElement("button");
      tombolLogout.id = "logoutButton";
      tombolLogout.textContent = "Logout";
      tombolLogout.type = "button";
      tombolLogout.style.marginTop = "15px";
      document.querySelector(".container").appendChild(tombolLogout);

      tombolLogout.addEventListener("click", async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
          tampilkanPesan(error.message, "red");
          return;
        }

        tombolLogout.remove();
        tampilkanForm(false);
        tampilkanPesan("Berhasil logout.", "green");
      });
    }
  } catch (error) {
    tampilkanPesan(error.message, "red");
  } finally {
    tombol.disabled = false;
    tombol.textContent = "Login";
  }
});

// Pulihkan sesi login yang masih aktif saat halaman dibuka.
supabaseClient.auth.getSession().then(({ data, error }) => {
  if (error) {
    tampilkanPesan(error.message, "red");
    return;
  }

  if (data.session?.user) {
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    judul.textContent = "Selamat Datang Kembali!";
    deskripsi.textContent = data.session.user.email;
    tampilkanPesan("Kamu sudah login.", "green");
  }
});


const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const judul = document.getElementById("judul");
const deskripsi = document.getElementById("deskripsi");
const pesan = document.getElementById("pesan");

document.getElementById("keRegister").onclick = function (e) {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    judul.textContent = "Buat Akun";
    deskripsi.textContent = "Daftar untuk memulai";
    pesan.textContent = "";
};

document.getElementById("keLogin").onclick = function (e) {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    judul.textContent = "Selamat Datang!";
    deskripsi.textContent = "Silakan login ke akun Anda";
    pesan.textContent = "";
};

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const password =
        document.getElementById("registerPassword").value;
    const konfirmasi =
        document.getElementById("konfirmasiPassword").value;

    if (password !== konfirmasi) {
        pesan.style.color = "red";
        pesan.textContent = "Konfirmasi password tidak cocok!";
        return;
    }

    pesan.style.color = "green";
    pesan.textContent =
        "Validasi berhasil! Form siap dihubungkan ke server.";
});

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    pesan.style.color = "#1769aa";
    pesan.textContent =
        "Form login berhasil diperiksa. Sistem autentikasi belum terhubung.";
});

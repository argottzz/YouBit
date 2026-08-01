import FormLogin from "@/components/FormLogin";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/02/37/e4/0237e4607d91388cf2b65befab7b7c3f.jpg')",
      }}
    >
      <FormLogin
        logo={
          <>
            You<span className="text-red-600">Bit</span>
          </>
        }
        subtitle="Masuk ke akun YouBit"
        buttonText="Login"
        registerText="Belum punya akun?"
        registerLink="Daftar sekarang"
        backText="Kembali ke Beranda"
      />
    </div>
  );
}
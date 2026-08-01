import FormRegister from "@/components/FormRegister";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/02/37/e4/0237e4607d91388cf2b65befab7b7c3f.jpg')",
      }}
    >
      <FormRegister
        logo={
          <>
            You<span className="text-red-600">Bit</span>
          </>
        }
        subtitle="Daftar untuk masuk"
        buttonText="Daftar"
        registerText="Sudah punya akun?"
        registerLink="Login"
        backText="Kembali ke Beranda"
      />
    </div>
  );
}
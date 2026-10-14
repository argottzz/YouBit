export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/02/37/e4/0237e4607d91388cf2b65befab7b7c3f.jpg')",
      }}
    >
      {children}
    </div>
  );
}

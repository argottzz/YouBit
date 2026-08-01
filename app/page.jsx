import Navbar from "@/components/Navbar";
import Card from "@/components/Card";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-5">
          <Card
            thumbnail="https://i.pinimg.com/736x/5c/1a/9a/5c1a9afa92475bc86ca15cd3a696112b.jpg"
            profile="https://i.pinimg.com/1200x/ed/62/c4/ed62c4744bb9e06628e30c16546a8cd5.jpg"
            title="Belajar Next.js Dari Nol Sampai Mahir"
            duration="1.10.50 "
            channel="Argoding"
            views="120 rb x ditonton"
            time="2 hari yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/1200x/1c/bf/56/1cbf56b236e9c84d25ed047d62d49886.jpg"
            profile="https://i.pinimg.com/1200x/ed/62/c4/ed62c4744bb9e06628e30c16546a8cd5.jpg"
            title="Tutorial React untuk Pemula"
            duration="1.15.15"
            channel="Argoding"
            views="350 rb x ditonton"
            time="1 minggu yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/736x/4a/c2/55/4ac2554d22e85da014d5d69d2fcf7ea5.jpg"
            profile="https://i.pinimg.com/1200x/d4/44/68/d444686d536cb012496a85e6e02f3534.jpg"
            title="Avengers: Doomsday Trailer"
            duration="4.10"
            channel="Marvel Studios"
            views="120 jt x ditonton"
            time="1 minggu yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/736x/e8/5b/d9/e85bd9f06a0d0041b8b3ab66b97def2f.jpg"
            profile="https://i.pinimg.com/736x/92/f4/3e/92f43ede4f3c9b4bce9401ce47b32664.jpg"
            title="Horor cerita rakyat gundul peringis di "
            duration="2.13.52"
            channel="Windah Basudara"
            views="350 rb x ditonton"
            time="1 minggu yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/1200x/20/b4/9f/20b49fee462b20049fcdd50aa064fa36.jpg"
            profile="https://i.pinimg.com/1200x/d4/44/68/d444686d536cb012496a85e6e02f3534.jpg"
            title="Shang-Chi and the Legend of the Ten Rings Trailer"
            duration="4.10"
            channel="Marvel Studios"
            views="120 jt x ditonton"
            time="1 minggu yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/736x/69/e3/f6/69e3f69d937c4f6b233463821a44f5c5.jpg"
            profile="https://i.pinimg.com/736x/92/f4/3e/92f43ede4f3c9b4bce9401ce47b32664.jpg"
            title="Ayah dan Ibu mengajakku ke hutan!!"
            duration="1.10.50"
            channel="Windah Basudara"
            views="120 rb x ditonton"
            time="2 hari yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/1200x/e8/a6/50/e8a6509b825a8bd08d53819ac676e05c.jpg"
            profile="https://i.pinimg.com/1200x/d4/44/68/d444686d536cb012496a85e6e02f3534.jpg"
            title="Spider-Man: Brand New Day Trailer"
            duration="4.10"
            channel="Marvel Studios"
            views="120 jt x ditonton"
            time="1 minggu yang lalu"
          />

          <Card
            thumbnail="https://i.pinimg.com/1200x/35/fd/5a/35fd5aaed255284a35e6e3edcc72692f.jpg"
            profile="https://i.pinimg.com/1200x/ed/62/c4/ed62c4744bb9e06628e30c16546a8cd5.jpg"
            title="Belajar Next.js Dari Nol Sampai Mahir Part 2"
            duration="10.50"
            channel="Argoding"
            views="120 rb x ditonton"
            time="2 hari yang lalu"
          />

           <Card
            thumbnail="https://i.pinimg.com/736x/6f/99/83/6f9983500bcc6963b8968bf9b053d5d5.jpg"
            profile="https://i.pinimg.com/736x/69/16/e2/6916e2b11f37661b5ba69a422c49460c.jpg"
            title="Belajar variabel JavaScript"
            duration="50.15"
            channel="Jam Makan Siang"
            views="350 rb x ditonton"
            time="1 minggu yang lalu"
          />

        </div>
      </div>
    </>
  );
}

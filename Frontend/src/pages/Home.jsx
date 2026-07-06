import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";

const products = [
  {
    title: "Tomato",
    price: "₹35",
    img: "https://images.unsplash.com/photo-1561136594-7f68413baa99?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Broccoli",
    price: "₹50",
    img: "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Carrot",
    price: "₹40",
    img: "https://images.unsplash.com/photo-1639086495429-d60e72c53c81?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Potato",
    price: "₹20",
    img: "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?q=80&w=1484&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const categories = [
  {
    name: "Grains",
    img: "https://plus.unsplash.com/premium_photo-1726750862897-4b75116bca34?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Vegetables",
    img: "https://images.unsplash.com/photo-1489450278009-822e9be04dff?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Fruits",
    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Nuts",
    img: "https://images.unsplash.com/photo-1542990253-a781e04c0082?q=80&w=1394&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];


const Home = () => {

    const navigate = useNavigate();



  return (
     <div>
      {/* Hero */}
      <section
        className="h-125 flex items-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="max-w-3xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-bold mb-1 ">
           A Smarter Way to Trade 
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
          Fresh Produce
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Connecting Farmers Directly With Shopkeepers
          </p>
          <button 
          onClick={() => navigate("/login")}
          className="cursor-pointer bg-green-500 hover:bg-green-600 px-6 py-3 text-black rounded-full font-semibold">
            Shop Now
          </button>
        </div>
      </section>

      
      <section className="max-w-360 mx-auto px-5 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Products
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:-translate-y-2 transition overflow-hidden"
            >
              <div className="h-70  overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5">
                <h3 className=" text-lg font-semibold mb-2">{p.title}</h3>
                
                <button 
                 onClick={() => navigate("/login")}
                className="cursor-pointer w-full bg-gray-800 hover:bg-red-400 text-white py-2 rounded">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-360 mx-auto px-5 pb-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop by Category
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <div key={i} className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-bold">
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </section>

     <Footer />
    </div>
  )
}

export default Home
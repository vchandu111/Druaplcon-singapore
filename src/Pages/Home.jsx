import Banner from "../Components/HomePage/Banner";
import Brands from "../Components/HomePage/Brands";
import SaleSection from "../Components/HomePage/Sale";
import ShopByCategory from "../Components/HomePage/ShopByCategory";

function Home() {
  return (
    <>
      <Banner />
      <ShopByCategory />
      <Brands />
      <SaleSection />
    </>
  );
}

export default Home;

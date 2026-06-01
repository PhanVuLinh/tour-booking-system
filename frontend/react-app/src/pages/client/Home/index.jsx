import Hero from "../../../components/client/Hero";
import FlashSale from "../../../components/client/FlashSale";
import Promotions from "../../../components/client/Promotions";
import DomesticTours from "../../../components/client/DomesticTours";
import BannerAd from "../../../components/client/BannerAd";
import ForeignTours from "../../../components/client/ForeignTours";
import BannerForeign from "../../../components/client/BannerForeign";
import News from "../../../components/client/News";

function Home() {
  return (
    <>
      <Hero />

      <FlashSale />

      <Promotions />

      <DomesticTours />

      <BannerAd />

      <ForeignTours />

      <BannerForeign />

      <News />
    </>
  );
}

export default Home;

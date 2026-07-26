import {
  Hero,
  FlashSale,
  Promotions,
  News,
  BannerAd,
  BannerForeign,
  DomesticTours,
  ForeignTours,
} from "../components";

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

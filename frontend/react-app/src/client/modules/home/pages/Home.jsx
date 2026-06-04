import {
  Hero,
  FlashSale,
  Promotions,
  News,
  BannerAd,
  BannerForeign,
} from "../components";

import { DomesticTours, ForeignTours } from "../../tours/components";

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

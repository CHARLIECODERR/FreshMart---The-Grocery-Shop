import React from 'react';
import Hero from '../../components/home/Hero';
import BannerSlider from '../../components/home/BannerSlider';
import CategorySection from '../../components/home/CategorySection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import BenefitsSection from '../../components/home/BenefitsSection';
import FeaturedRecipes from '../../components/recipe/FeaturedRecipes';

const Home = () => {
  return (
    <div className="space-y-4 pb-12 bg-gray-50/50">
      <Hero />
      <BannerSlider />
      <CategorySection />
      <FeaturedProducts />
      <FeaturedRecipes />
      <BenefitsSection />
    </div>
  );
};

export default Home;


import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { getAllRecipes } from '../../services/recipeService';

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        setRecipes(data.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading || recipes.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12 text-center">
            <span className="px-5 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-100 flex items-center gap-2 mb-4">
                Cook Like a Pro
            </span>
            <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                Featured Recipes
            </h2>
            <div className="w-24 h-2 bg-primary-500 rounded-full mt-6" />
        </div>
        
        <div className="flex overflow-x-auto gap-8 pb-10 pt-4 scrollbar-hide px-0.5 -mx-0.5 mask-fade-right">
          {recipes.map(recipe => (
            <div key={recipe.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;

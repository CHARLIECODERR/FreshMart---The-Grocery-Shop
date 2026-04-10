
import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { getRecipesByProduct } from '../../services/recipeService';

const RecipeSection = ({ productName }) => {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    const fetch = async () => {
      if (productName) {
        const data = await getRecipesByProduct(productName);
        setRecipes(data);
      }
    };
    fetch();
  }, [productName]);

  if (recipes.length === 0) return null;

  return (
    <div className="py-12 border-t border-gray-100">
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl font-black text-gray-900 leading-tight">
          {productName} recipes for you
        </h2>
        <div className="w-16 h-1.5 bg-primary-500 rounded-full mt-3" />
      </div>
      
      <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-hide px-0.5 -mx-0.5">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeSection;


import React, { useState, useEffect } from 'react';
import RecipeCard from '../../components/recipe/RecipeCard';
import { getAllRecipes } from '../../services/recipeService';
import { Search, Loader2 } from 'lucide-react';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-primary-600 rounded-[3rem] p-8 md:p-16 mb-16 text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full -ml-24 -mb-24 blur-2xl" />
        
        <div className="relative z-10">
            <span className="px-5 py-2 bg-white/20 backdrop-blur text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 inline-block mb-6">
                Culinary Inspiration
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                FreshMart <br className="hidden md:block" /> Recipe Book
            </h1>
            <p className="text-primary-100 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                Discover delicious ways to use our farm-fresh produce with curated recipes from local chefs and our community.
            </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto -mt-24 mb-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Search recipes, ingredients, or tags..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-gray-800 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500 mb-4" size={40} />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Curating recipes...</p>
        </div>
      ) : (
        <>
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="flex justify-center">
                    <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500 font-medium">Try searching for something else like "milk" or "dessert".</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-8 text-primary-600 font-bold underline hover:text-primary-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Recipes;

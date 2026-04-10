
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById } from '../../services/recipeService';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Heart, 
  Share2, 
  ChevronRight, 
  Home, 
  Utensils, 
  Flame, 
  Dna,
  Scale
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        if (data) {
          setRecipe(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-2xl font-bold text-gray-900">Recipe not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8 overflow-hidden">
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link to="/" className="flex items-center hover:text-primary-600 transition-colors">
            <Home size={16} className="mr-1.5" />
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <Link to="/shop" className="hover:text-primary-600 transition-colors">
            Shop
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <span className="text-primary-600 truncate max-w-[150px] sm:max-w-xs">{recipe.title}</span>
        </div>
      </nav>

      {/* Main Recipe Header */}
      <div className="bg-white rounded-[2.5rem] p-6 lg:p-12 shadow-sm border border-gray-100 mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Content side */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-5 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-100 flex items-center gap-2">
                <Utensils size={14} />
                Recipe
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight uppercase">
              {recipe.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
              {recipe.description}
            </p>

            <div className="mb-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-lg uppercase tracking-wider">
                    <Utensils size={20} className="text-primary-500" />
                    Ingredients:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      <span className="font-bold text-slate-700 text-sm">{ing}</span>
                    </div>
                  ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-2">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                    <Clock size={24} className="text-primary-500" />
                </div>
                <span className="text-lg font-black text-gray-900">{recipe.cookTime}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cook Time</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                    <Users size={24} className="text-primary-500" />
                </div>
                <span className="text-lg font-black text-gray-900">{recipe.servings} Pers.</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Servings</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                    <Scale size={24} className="text-primary-500" />
                </div>
                <span className="text-lg font-black text-gray-900">Health</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Choice</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl shadow-sm border border-primary-100 flex items-center justify-center mb-3">
                    <Flame size={24} className="text-primary-500" />
                </div>
                <span className="text-lg font-black text-primary-600">{recipe.calories}</span>
                <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Calories</span>
              </div>
            </div>
          </div>

          {/* Image side */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="relative aspect-square lg:aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl ring-[12px] ring-white group">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                <div className="flex flex-col gap-1">
                   <span className="text-white font-black uppercase text-[10px] tracking-widest bg-primary-500 w-fit px-3 py-1 rounded-full">Pro Chef Choice</span>
                   <h3 className="text-2xl font-black text-white italic">{recipe.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-white/20 backdrop-blur-md shadow-lg rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 transition-all border-none">
                    <Heart size={20} />
                  </button>
                  <button className="w-12 h-12 bg-white/20 backdrop-blur-md shadow-lg rounded-2xl flex items-center justify-center text-white hover:bg-primary-500 transition-all border-none">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Step by Step */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-sm">
            <div className="flex flex-col mb-12">
                <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight italic">Cooking Steps</h2>
                <div className="w-24 h-2.5 bg-primary-500 rounded-full mt-4" />
            </div>
            
            <div className="relative space-y-12">
              {/* Vertical connecting line */}
              <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-slate-100 hidden md:block" />

              {recipe.steps.map((step, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index} 
                  className="relative flex flex-col md:flex-row gap-6 md:gap-12 group"
                >
                  <div className="z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-xl font-black text-slate-300 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all duration-500 shadow-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 group-hover:bg-white group-hover:border-primary-100 group-hover:shadow-md transition-all duration-500">
                    <p className="text-lg text-slate-700 leading-relaxed font-bold italic">
                      {step}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-sm sticky top-24">
          <div className="flex flex-col mb-10">
            <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">Nutrition</h2>
            <div className="w-20 h-2 bg-primary-500 rounded-full mt-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Flame size={24} />
              </div>
              <p className="text-2xl font-black text-slate-900">{recipe.nutrition.calories.split(' ')[0]}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">kCal</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Dna size={24} />
              </div>
              <p className="text-2xl font-black text-slate-900">{recipe.nutrition.protein.split(' ')[0]}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">g Protein</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Scale size={24} />
              </div>
              <p className="text-2xl font-black text-slate-900">{recipe.nutrition.fat.split(' ')[0]}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">g Fat</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              <p className="text-2xl font-black text-slate-900">{recipe.nutrition.carbs.split(' ')[0]}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">g Carbs</p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-white/50 backdrop-blur border border-white/50 rounded-3xl">
              <p className="text-sm text-slate-500 font-bold italic leading-relaxed text-center">
                * Nutritional values are approximate and may vary depending on ingredients used.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

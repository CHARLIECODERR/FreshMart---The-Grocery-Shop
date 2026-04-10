
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Link 
      to={`/recipe/${recipe.id}`}
      className="flex-shrink-0 group block overflow-hidden transition-all duration-300 w-44 sm:w-52"
    >
      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-3 border border-gray-100 shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-sm font-bold text-gray-800 text-center line-clamp-1 group-hover:text-primary-600 transition-colors">
        {recipe.title}
      </h3>
    </Link>
  );
};

export default RecipeCard;

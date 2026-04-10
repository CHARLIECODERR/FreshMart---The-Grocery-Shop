import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllRecipes, deleteRecipe } from '../../services/recipeService';
import { 
  BookOpen, Plus, Search, Edit3, Trash2, X, Loader2, Image as ImageIcon, Clock, Utensils
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await deleteRecipe(id);
      toast.success('Recipe deleted successfully');
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  const filtered = recipes.filter(r => 
    r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recipe Book Management</h2>
          <p className="text-slate-500 font-medium mt-1">Create and manage delicious recipes for your customers</p>
        </div>
        <Link 
          to="/admin/recipes/add"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          Create New Recipe
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search recipes by title or tags..."
            className="w-full pl-12 pr-10 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500 font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
           <BookOpen className="text-emerald-600" size={20} />
           <span className="text-emerald-800 font-black text-sm">{filtered.length} Recipes</span>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-slate-400 bg-white rounded-[2.5rem] border border-slate-100">
          <Loader2 size={48} className="animate-spin text-emerald-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Recipe Book...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-32 text-center border border-slate-100 flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
             <BookOpen size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">No Recipes Found</h3>
            <p className="text-slate-500 font-medium mt-2">Try a different search or create your first culinary masterpiece!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(recipe => (
            <div key={recipe.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                {recipe.image ? (
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-slate-100">
                      <Clock size={12} className="text-emerald-500" />
                      {recipe.cookTime}
                   </div>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                   <Utensils size={14} className="text-emerald-500" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipe Post</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors uppercase italic tracking-tight">{recipe.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{recipe.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {recipe.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">#{tag}</span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Link 
                      to={`/admin/recipes/edit/${recipe.id}`}
                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(recipe.id)}
                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <Link 
                    to={`/recipe/${recipe.id}`} 
                    target="_blank"
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                  >
                    View Live
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;

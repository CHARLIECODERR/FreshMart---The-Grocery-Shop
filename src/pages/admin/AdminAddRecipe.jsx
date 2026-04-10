import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createRecipe, updateRecipe, getRecipeById } from '../../services/recipeService';
import { uploadToCloudinary } from '../../services/productService';
import { 
  ArrowLeft, ImageIcon, Loader2, Info, CheckCircle2, Trash2, Camera, Upload, Save, Plus, X, Utensils, Clock, Users, Flame, Scale, Dna
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAddRecipe = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookTime: '',
    servings: '',
    calories: '',
    image: '',
    ingredients: [],
    steps: [],
    tags: [],
    nutrition: {
      calories: '',
      protein: '',
      fat: '',
      carbs: ''
    }
  });

  const [currIngredient, setCurrIngredient] = useState('');
  const [currStep, setCurrStep] = useState('');
  const [currTag, setCurrTag] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetch = async () => {
        try {
          setFetching(true);
          const data = await getRecipeById(id);
          if (data) {
            setFormData({
              ...data,
              ingredients: data.ingredients || [],
              steps: data.steps || [],
              tags: data.tags || [],
              nutrition: data.nutrition || { calories: '', protein: '', fat: '', carbs: '' }
            });
          } else {
            toast.error('Recipe not found');
            navigate('/admin/recipes');
          }
        } catch (error) {
          toast.error('Failed to load recipe');
        } finally {
          setFetching(false);
        }
      };
      fetch();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddField = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
    setter('');
  };

  const handleRemoveField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error('Please add an image');
    if (formData.ingredients.length === 0) return toast.error('Please add ingredients');
    if (formData.steps.length === 0) return toast.error('Please add cooking steps');

    setLoading(true);
    try {
      if (isEdit) {
        await updateRecipe(id, formData);
        toast.success('Recipe updated!');
      } else {
        await createRecipe(formData);
        toast.success('Recipe created!');
      }
      navigate('/admin/recipes');
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-[500px] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={48} />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/recipes" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-1" /> Recipe Book
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-700">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-50 flex items-center gap-2 italic uppercase">
               <Utensils size={20} className="text-emerald-500" />
               Recipe Basics
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Recipe Title</label>
                <input 
                  type="text" required name="title"
                  placeholder="e.g. Grandma's special Mango Pulp"
                  className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Introduction / Description</label>
                <textarea 
                  required name="description"
                  rows="3"
                  className="resize-none w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Clock size={12} /> Cook Time (e.g. 25min)
                  </label>
                  <input 
                    type="text" required name="cookTime"
                    className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                    value={formData.cookTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Users size={12} /> Servings (num)
                  </label>
                  <input 
                    type="number" required name="servings"
                    className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                    value={formData.servings}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Flame size={12} /> Total Calories (e.g. 180 kCal)
                  </label>
                  <input 
                    type="text" required name="calories"
                    className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                    value={formData.calories}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Sections */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
             <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-50 flex items-center gap-2 italic uppercase">
                <Plus size={20} className="text-emerald-500" />
                Ingredients & Steps
             </h3>

             {/* Ingredients */}
             <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Ingredients List</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add ingredient..."
                    className="flex-1 rounded-2xl bg-slate-50 border-none px-4 font-medium text-sm"
                    value={currIngredient}
                    onChange={(e) => setCurrIngredient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddField('ingredients', currIngredient, setCurrIngredient))}
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddField('ingredients', currIngredient, setCurrIngredient)}
                    className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all font-black uppercase text-[10px]"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ing, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                      {ing}
                      <button type="button" onClick={() => handleRemoveField('ingredients', i)} className="text-slate-400 hover:text-rose-500 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
             </div>

             {/* Cooking Steps */}
             <div className="space-y-4 pt-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Cooking Steps</label>
                <div className="flex gap-2">
                   <textarea 
                    placeholder="Add step..."
                    className="flex-1 rounded-2xl bg-slate-50 border-none p-4 font-medium text-sm resize-none"
                    rows="2"
                    value={currStep}
                    onChange={(e) => setCurrStep(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddField('steps', currStep, setCurrStep)}
                    className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all self-end"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.steps.map((step, i) => (
                    <div key={i} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                       <span className="w-6 h-6 bg-emerald-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center shrink-0">{i+1}</span>
                       <p className="text-sm font-bold text-emerald-900 leading-relaxed italic">{step}</p>
                       <button type="button" onClick={() => handleRemoveField('steps', i)} className="ml-auto text-emerald-400 hover:text-rose-500">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Image Section */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-50 flex items-center gap-2 uppercase tracking-tighter">
                <Camera size={20} className="text-emerald-500" />
                Recipe Photo
              </h3>
              <div className={`relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed ${formData.image ? 'border-emerald-500' : 'border-slate-200'}`}>
                {formData.image ? (
                   <>
                    <img src={formData.image} alt="Recipe" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Trash2 size={32} />
                    </button>
                   </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                    {uploadingImage ? <Loader2 className="animate-spin text-emerald-500" /> : <Upload className="text-slate-300" size={32} />}
                    <span className="mt-2 text-xs font-black text-slate-400 uppercase tracking-widest text-center px-4">Browse Recipe Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                )}
              </div>
              <input 
                type="text" 
                placeholder="Or paste image URL/path"
                className="w-full text-xs font-bold bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-1 focus:ring-emerald-500"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
           </div>

           {/* Tags */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase italic tracking-widest">Tags (for search)</h3>
              <div className="flex gap-2">
                 <input 
                  type="text" 
                  className="flex-1 text-sm font-bold bg-slate-50 border-none rounded-xl px-4"
                  placeholder="e.g. dessert"
                  value={currTag}
                  onChange={(e) => setCurrTag(e.target.value)}
                />
                <button type="button" onClick={() => handleAddField('tags', currTag, setCurrTag)} className="p-2 bg-emerald-200 text-emerald-700 rounded-xl">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-[10px] font-bold rounded-lg flex items-center gap-2">
                    #{tag} <X size={10} onClick={() => handleRemoveField('tags', i)} className="cursor-pointer" />
                  </span>
                ))}
              </div>
           </div>

           {/* Nutrition */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 italic">
                <Scale size={18} className="text-emerald-400" /> Nutrition Facts
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Flame size={10} /> kCal</label>
                    <input name="nutrition.calories" className="bg-white/10 border-none rounded-xl py-2 px-3 text-sm font-bold" value={formData.nutrition.calories} onChange={handleChange} />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Dna size={10} /> Protein (g)</label>
                    <input name="nutrition.protein" className="bg-white/10 border-none rounded-xl py-2 px-3 text-sm font-bold" value={formData.nutrition.protein} onChange={handleChange} />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Scale size={10} /> Fat (g)</label>
                    <input name="nutrition.fat" className="bg-white/10 border-none rounded-xl py-2 px-3 text-sm font-bold" value={formData.nutrition.fat} onChange={handleChange} />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Plus size={10} /> Carbs (g)</label>
                    <input name="nutrition.carbs" className="bg-white/10 border-none rounded-xl py-2 px-3 text-sm font-bold" value={formData.nutrition.carbs} onChange={handleChange} />
                 </div>
              </div>
           </div>

           <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {isEdit ? 'Update Recipe' : 'Publish Recipe'}</>}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddRecipe;

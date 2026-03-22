import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getActiveProducts } from '../../services/productService';
import { getUserProfile } from '../../services/userService';
import { 
  Loader2, 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  User,
  Phone,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Leaf,
  Info,
  Calendar,
  MapPin
} from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import StarRating from '../../components/common/StarRating';
import ReviewList from '../../components/review/ReviewList';
import { getProductReviews } from '../../services/reviewService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top on new product
        
        const data = await getProductById(id);
        if (!data) {
          setError("Product not found or is no longer available.");
          setLoading(false);
          return;
        }
        
        setProduct(data);
        
        // Fetch farmer profile
        if (data.farmerId) {
          try {
            const profile = await getUserProfile(data.farmerId);
            setFarmer(profile);
          } catch (err) {
            console.error("Error fetching farmer profile:", err);
          }
        }
        
        // Fetch related products (same category)
        if (data.categorySlug || data.category) {
          console.log("Fetching related products with categorySlug:", data.categorySlug, "or category:", data.category);
          const related = await getActiveProducts({ 
            categorySlug: data.categorySlug, 
            category: data.category, 
            limitCount: 5 
          });
          // Filter out the current product and take only 4
          setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
        }

      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getProductReviews(id);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const catSlug = product?.categorySlug || product?.category?.toLowerCase();
    if (catSlug) {
      const fetchRelatedProducts = async () => {
        try {
          setRelatedLoading(true);
          console.log("Fetching related products for:", catSlug);
          const products = await getActiveProducts({ 
            categorySlug: product?.categorySlug ? catSlug : undefined,
            category: !product?.categorySlug ? product?.category : undefined,
            limitCount: 5 
          });
          console.log("Found related products:", products.length);
          setRelatedProducts(products.filter(p => p.id !== id));
        } catch (err) {
          console.error("Error fetching related products:", err);
        } finally {
          setRelatedLoading(false);
        }
      };
      fetchRelatedProducts();
    }
  }, [product?.id, product?.categorySlug, product?.category, id]);

// ... previous helper functions ...

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Analyzing Harvest Quality...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
          <AlertCircle size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Harvest Not Found</h2>
          <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">This product might have been unlisted or moved to another category.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  
  // Calculate discount percentage
  let discountBadge = product.discount;
  if (!discountBadge && product.mrp > product.price) {
    const percent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    discountBadge = `${percent}% OFF`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
            </div>
          </li>
          {product.categorySlug && (
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link to={`/category/${product.categorySlug}`} className="hover:text-primary-600 capitalize transition-colors">
                  {product.categorySlug.replace('-', ' ')}
                </Link>
              </div>
            </li>
          )}
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Main Section */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100 mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group">
              {(product.imageUrl || product.image || product.prodImage) ? (
                <img 
                  src={product.imageUrl || product.image || product.prodImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Out of Stock</span>
                </div>
              )}
              {discountBadge && (
                <div className="absolute top-6 left-6">
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200">
                    {discountBadge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
                {product.category || product.categorySlug || 'Fresh'}
              </span>
              {/* Simple rating placeholder */}
              {/* Real rating from product document */}
              <div className="flex items-center gap-2">
                <StarRating rating={product.averageRating || 0} size={16} />
                <span className="text-gray-900 font-extrabold text-sm">
                  {product.averageRating ? product.averageRating.toFixed(1) : "No ratings"}
                </span>
                <span className="text-gray-400 text-xs font-medium">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Seller Quick Info */}
            {farmer && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User size={14} className="text-primary-600" />
                  <span className="font-semibold text-gray-700">Sold by {farmer.displayName}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
                <span className="text-emerald-600 font-bold">Verified Farmer</span>
              </div>
            )}
            
            <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-emerald-600 tracking-tight">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-xl text-gray-300 line-through font-medium">₹{product.mrp}</span>
                )}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">per {product.unit || 'piece'}</p>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description || "Experience the authentic taste of farm-fresh produce..."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="flex items-center h-16 bg-gray-50 rounded-2xl border border-gray-100 p-2 shrink-0">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl text-gray-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <div className="w-16 text-center text-xl font-black text-gray-900">{quantity}</div>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-12 h-12 rounded-xl text-gray-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button 
                onClick={() => addItem(product, quantity)}
                disabled={isOutOfStock}
                className="flex-grow h-16 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? "Out of Stock" : "Add to Harvest Bag"}
              </button>

              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${isInWishlist ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
              >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>
            
            {/* Value Propositions */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Safety First</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase">Pesticide Free</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                     <Truck size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cold Chain</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase">Farm to Door</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-12">
        <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
          {['details', 'farmer', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${
                activeTab === tab ? 'text-primary-600' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab === 'details' ? 'Harvest Details' : tab === 'farmer' ? 'About Farmer' : `Reviews (${reviews.length})`}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 border-l-4 border-emerald-500 pl-4 mb-6">Produce Info</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {product.description || "Our harvest is nurtured with organic care, ensuring every bite is packed with nature's pure essence. We prioritize soil health and ecological balance to bring you produce that is not just food, but a testament to sustainable farming."}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</span>
                      <span className="text-sm font-bold text-gray-900">{product.category || 'Organic'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Weight</span>
                      <span className="text-sm font-bold text-gray-900">{product.unit || '1 Unit'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shelf Life</span>
                      <span className="text-sm font-bold text-gray-900">{product.shelfLife || '3-5 Days'}</span>
                    </div>
                    {product.origin && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Origin</span>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-emerald-500" />
                          <span className="text-sm font-bold text-gray-900">{product.origin}</span>
                        </div>
                      </div>
                    )}
                    {product.season && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Best Season</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-amber-500" />
                          <span className="text-sm font-bold text-gray-900">{product.season}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8 flex flex-col justify-center">
                  {product.nutritionalInfo && (
                    <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                      <h4 className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-widest mb-4">
                        <Info size={16} /> Nutritional Facts
                      </h4>
                      <p className="text-sm font-medium text-emerald-800/80 leading-relaxed whitespace-pre-line">
                        {product.nutritionalInfo}
                      </p>
                    </div>
                  )}

                  {product.benefits && (
                    <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                      <h4 className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase tracking-widest mb-4">
                        <Leaf size={16} /> Health Benefits
                      </h4>
                      <p className="text-sm font-medium text-blue-800/80 leading-relaxed whitespace-pre-line">
                        {product.benefits}
                      </p>
                    </div>
                  )}

                  {product.storageTips && (
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                      <h4 className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-widest mb-4">
                        <RefreshCw size={16} /> Storage Tips
                      </h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                        {product.storageTips}
                      </p>
                    </div>
                  )}

                  {!product.nutritionalInfo && !product.benefits && !product.storageTips && (
                    <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 flex flex-col justify-center gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                            <RefreshCw className="text-emerald-500" size={24} />
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-xs uppercase tracking-widest mb-1">Sustainable Growth</p>
                            <p className="text-[10px] text-gray-500 font-medium">100% Organic methods focused on long-term soil health.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-xs uppercase tracking-widest mb-1">Quality Guaranteed</p>
                            <p className="text-[10px] text-gray-500 font-medium">Rigorous quality checks before every dispatch.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
          )}

          {activeTab === 'farmer' && farmer && (
            <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-48 h-48 rounded-[3rem] bg-gray-50 overflow-hidden shrink-0 border-4 border-white shadow-xl relative group">
                {farmer.photoURL ? (
                  <img src={farmer.photoURL} alt={farmer.displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                    <User size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                  <h3 className="text-3xl font-black text-gray-900 leading-none">{farmer.displayName}</h3>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <StarRating rating={farmer.averageRating || 0} size={14} />
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                       {farmer.averageRating ? farmer.averageRating.toFixed(1) : '5.0'} ★ Merchant
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed mb-8 max-w-2xl">
                  {farmer.description || "Dedicated to preserving traditional agricultural methods while embracing modern sustainable practices. Our farm ensures that every harvest delivered is of the highest nutritional value and taste."}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {farmer.phoneNumber && (
                    <a href={`tel:${farmer.phoneNumber}`} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                      <Phone size={16} /> Contact Farmer
                    </a>
                  )}
                  <button className="px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center gap-3">
                    <MessageCircle size={16} /> Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto">
              {reviewsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-emerald-500" size={40} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cataloging Harvest Feedback...</p>
                </div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-20 border-t border-gray-100 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-3">Harvest Recommendations</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Wait, Check These Too!</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors">
              Explore Full Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

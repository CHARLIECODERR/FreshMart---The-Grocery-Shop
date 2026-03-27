import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getActiveProducts } from '../../services/productService';
import { getUserProfile } from '../../services/userService';
import { 
  ArrowLeft,
  AlertCircle,
  Home,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { getProductReviews } from '../../services/reviewService';

// New Sub-components
import { ProductDetailSkeleton } from '../../components/common/Skeleton';
import ProductGallery from '../../components/product/details/ProductGallery';
import ProductInfo from '../../components/product/details/ProductInfo';
import ProductTabs from '../../components/product/details/ProductTabs';
import RelatedProductsGrid from '../../components/product/details/RelatedProductsGrid';

const ProductDetails = () => {
  const { t: translate } = useTranslation();
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
        window.scrollTo(0, 0); 
        
        const data = await getProductById(id);
        if (!data) {
          setError("Product not found");
          return;
        }
        
        setProduct(data);
        if (data.farmerId) {
          try {
            const profile = await getUserProfile(data.farmerId);
            setFarmer(profile);
          } catch (err) {
            console.error("Error fetching farmer profile:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product");
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
          const products = await getActiveProducts({ 
            categorySlug: product?.categorySlug ? catSlug : undefined,
            category: !product?.categorySlug ? product?.category : undefined,
            limitCount: 5 
          });
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

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{translate('product_details.not_found_title')}</h2>
        <p className="text-gray-500 mb-8">{translate('product_details.not_found_desc')}</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          {translate('product_details.back_to_shop')}
        </button>
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
            {translate('product_details.breadcrumb_home')}
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <Link to="/shop" className="hover:text-primary-600 transition-colors">
            {translate('product_details.breadcrumb_shop')}
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <span className="text-primary-600 truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
        </div>
      </nav>

      <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100 mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProductGallery product={product} />
          <ProductInfo 
            product={product}
            farmer={farmer}
            quantity={quantity}
            setQuantity={setQuantity}
            addItem={addItem}
            toggleWishlist={toggleWishlist}
            isInWishlist={isInWishlist}
          />
        </div>
      </div>

      <ProductTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        product={product}
        farmer={farmer}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
      />

      <RelatedProductsGrid products={relatedProducts} loading={relatedLoading} />
    </div>
  );
};

export default ProductDetails;

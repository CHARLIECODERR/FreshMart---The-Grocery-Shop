import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getActiveProducts } from '../../services/productService';
import { getUserProfile } from '../../services/userService';
import { 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
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
  const { id } = useParams();
  
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8 overflow-hidden">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 truncate">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
            </div>
          </li>
        </ol>
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

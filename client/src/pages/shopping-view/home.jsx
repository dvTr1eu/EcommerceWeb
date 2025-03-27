import banner1 from "../../assets/clothesBanner/banner1.jpg";
import banner2 from "../../assets/clothesBanner/banner2.jpg";
import banner3 from "../../assets/clothesBanner/banner3.jpg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  getProductHomeList,
} from "@/store/clientStore/product-slice";
import { useSearchParams } from "react-router-dom";
import ClientProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ChatSupport from "@/components/common/chat-support";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { productDetails, productHomeList } = useSelector(
    (state) => state.clientProduct
  );
  const featureImageList = [banner1, banner2, banner3];
  const [sort, setSort] = useState("default");
  const categoryId = searchParams.get("categoryId");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const bestList = productHomeList
    .filter((product) => product.bestSeller && product.discountPrice == 0)
    .slice(0, 4);
  const discountList = productHomeList
    .filter((product) => product.discountPrice > 0)
    .slice(0, 4);

  useEffect(() => {
    dispatch(getProductHomeList());
  }, [dispatch]);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(getProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // useEffect(() => {
  //   if (!featureImageList || featureImageList.length === 0) return;
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
  //   }, 15000);
  //   return () => clearInterval(timer);
  // }, [featureImageList]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Best Seller</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestList && bestList.length > 0
              ? bestList.map((productItem) => (
                  <ClientProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Discount Product
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {discountList && discountList.length > 0
              ? discountList.map((productItem) => (
                  <ClientProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      {user ? <ChatSupport nameUser={user.fullName} userId={user.id} /> : null}
    </div>
  );
}

export default ShoppingHome;

import { FormatPrice } from "@/helpers/utilities";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import bangsize from "../../assets/bangsize.png";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ChartNoAxesColumn, ChartNoAxesGantt, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCartItems } from "@/store/clientStore/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/clientStore/product-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { Fragment, useEffect, useState } from "react";
import { addReview, getReview } from "@/store/clientStore/review-slice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToastAction } from "../ui/toast";
import { useNavigate } from "react-router-dom";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  const checkQuantityInStock = () => {
    if (!selectedSize) return;

    const selectedSizeItem = productDetails?.sizes?.$values.find(
      (sizeItem) => sizeItem?.sizeName?.trim() === selectedSize
    );
    if (!selectedSizeItem) return;

    if (selectedQuantity > selectedSizeItem.quantity) {
      toast({
        title: `Chỉ còn ${selectedSizeItem.quantity} sản phẩm size ${selectedSize} trong kho`,
        variant: "destructive",
      });
      setSelectedQuantity(selectedSizeItem.quantity);
    }
  };

  function handleAddToCart() {
    if (user == null) {
      if (confirm("Bạn cần đăng nhập để tiếp tục")) {
        navigate("/auth/login");
      }
    } else {
      const selectedSizeItem = productDetails?.sizes?.$values.find(
        (sizeItem) => sizeItem?.sizeName?.trim() === selectedSize
      );
      if (selectedSizeItem == null) {
        alert("Hãy chọn 1 size");
      } else {
        checkQuantityInStock();
        const formData = {
          customerID: user?.id,
          productID: productDetails?.id,
          quantity: selectedQuantity,
          imageUrl: productDetails?.imageUrl1,
          sizeId: selectedSizeItem?.id,
          sizeName: selectedSize,
        };
        dispatch(addToCart(formData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(getCartItems(user?.id));
            toast({
              title: "Thêm vào giỏ hàng thành công",
            });
          }
        });
      }
    }
  }

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setSelectedQuantity(newQuantity);
  };

  const handleSizeChange = (value) => {
    setSelectedSize(value);
  };

  const getSelectedSizeQuantity = () => {
    if (!selectedSize) return null;

    const size = productDetails?.sizes?.$values.find(
      (sizeItem) => sizeItem?.sizeName?.trim() === selectedSize
    );
    return size ? size.quantity : null;
  };

  useEffect(() => {
    checkQuantityInStock();
  }, [selectedQuantity, selectedSize]);

  useEffect(() => {
    if (!open) {
      setSelectedSize(null);
    }
  }, [open]);

  const ProductImagesCarousel = ({ images }) => {
    if (!images || images.length === 0) {
      return <p>Không có hình ảnh nào.</p>;
    }

    return (
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {images.map((imageUrl, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                    <img
                      src={imageUrl}
                      alt={`Product Image ${index + 1}`}
                      className="aspect-square object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14" />
        <CarouselNext className="mr-14" />
      </Carousel>
    );
  };

  function handleDialogClose() {
    setOpen(false);
    setSelectedQuantity(1);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (user == null) {
      if (confirm("Bạn cần đăng nhập để tiếp tục")) {
        navigate("/auth/login");
      }
    }
    dispatch(
      addReview({
        productId: productDetails?.id,
        accountId: user?.id,
        fullName: user?.fullName,
        reviewMessage: reviewMsg,
        reviewNumber: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(getReview(productDetails?.id));
        toast({
          title: "Đánh giá sản phẩm thành công",
        });
        setRating(0);
        setReviewMsg("");
      } else {
        toast({
          title: data.payload.message,
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReview(productDetails?.id));
    }
  }, [productDetails]);

  const averageReview =
    reviews.$values && reviews.$values.length > 0
      ? reviews.$values.reduce(
          (sum, reviewItem) => sum + reviewItem.reviewNumber,
          0
        ) / reviews.$values.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-5 sm:p-12 max-w-[1000px] sm:max-w-[80vw] lg:max-w-5xl">
        <div className="relative overflow-hidden rounded-lg">
          <ProductImagesCarousel
            images={[productDetails?.imageUrl1, productDetails?.imageUrl2]}
          />
        </div>
        <div className="">
          <div>
            <h2 className="text-2xl font-extrabold">
              {productDetails?.productName}
            </h2>
            <p className="text-muted-foreground text-xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-2xl font-bold text-primary ${
                productDetails?.discountPrice > 0 ? "line-through" : ""
              }`}
            >
              {FormatPrice(productDetails?.price)}
            </p>
            {productDetails?.discountPrice > 0 ? (
              <p className="text-2xl font-bold text-primary">
                {FormatPrice(productDetails?.discountPrice)}
              </p>
            ) : null}
          </div>
          <div className="mt-8 flex items-end flex-col">
            <Select onValueChange={handleSizeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tùy chọn size" />
              </SelectTrigger>
              <SelectContent>
                {productDetails?.sizes?.$values.map((sizeItem) => (
                  <SelectItem
                    className="cursor-pointer hover:bg-muted-foreground"
                    key={sizeItem.id}
                    value={sizeItem.sizeName.trim()}
                  >
                    {sizeItem.sizeName.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
              <span className={selectedSize !== null ? `mt-4` : "hidden"}>
                {getSelectedSizeQuantity() !== null
                  ? `Số lượng còn: ${getSelectedSizeQuantity()}`
                  : null}
              </span>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Label className="flex flex-row items-center hover:cursor-pointer underline text-muted-foreground">
                <ChartNoAxesGantt />
                Bảng hướng dẫn chọn size
              </Label>
            </DialogTrigger>
            <DialogContent>
              <div>
                <img src={bangsize} />
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5 flex">
            {productDetails?.quantity === 0 ? (
              <Button className="opacity-60 cursor-not-allowed">
                Hết hàng
              </Button>
            ) : (
              <Fragment>
                <Button onClick={() => handleAddToCart()}>
                  Thêm vào giỏ hàng
                </Button>
                <Input
                  className="w-14 ml-2"
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                  type="number"
                  min="1"
                ></Input>
              </Fragment>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mt-4">Đánh giá</h2>
            <div className="grid gap-6">
              {reviews.$values && reviews.$values.length > 0 ? (
                reviews.$values.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.fullName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.fullName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent
                          rating={reviewItem?.reviewNumber}
                        />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h2>Chưa có bài viết đánh giá nào</h2>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2 ml-2 mr-2">
              <Label>Chọn đánh giá</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Viết đánh giá của bạn"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Đăng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;

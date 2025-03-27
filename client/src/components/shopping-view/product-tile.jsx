import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { FormatPrice } from "@/helpers/utilities";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function ClientProductTile({ product, handleGetProductDetails }) {
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
                      className="w-full h-full object-cover"
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
  return (
    <Card className="w-ful max-w-sm mx-auto cursor-pointer">
      <div>
        <div className="relative">
          <ProductImagesCarousel
            images={[product.imageUrl1, product.imageUrl2]}
          />
          {product?.quantity === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Hết hàng
            </Badge>
          ) : product?.quantity < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Chỉ còn ${product?.quantity} sản phẩm`}
            </Badge>
          ) : product?.discountPrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Giảm giá
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.productName}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.discountPrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              {FormatPrice(product?.price)}
            </span>
            {product?.discountPrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                {FormatPrice(product?.discountPrice)}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button
          onClick={() => handleGetProductDetails(product?.id)}
          className="w-full"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ClientProductTile;

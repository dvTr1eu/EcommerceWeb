import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FormatPrice } from "../../helpers/utilities";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProduct,
  setCurrentEditId,
  handleDelete,
}) {
  const { toast } = useToast();
  const sizes = Array.isArray(product.sizes?.$values)
    ? product.sizes.$values.map((size) => ({
        sizeName: size.sizeName.trim(),
        quantity: size.quantity,
      }))
    : [];

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
    <Card className="w-full max-w-sm mx-auto ml-6">
      <div>
        <div className="relative">
          <ProductImagesCarousel
            images={[product.imageUrl1, product.imageUrl2]}
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">{product?.productName}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Size</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product?.sizes.$values.map((sizeItem) => (
                <TableRow className="text-center" key={sizeItem.id}>
                  <TableCell>{sizeItem.sizeName}</TableCell>
                  <TableCell>{sizeItem.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mb-2 mt-2">
            <span
              className={`${
                product?.discountPrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              {FormatPrice(product?.price)}
            </span>
            {product?.discountPrice > 0 ? (
              <span className="text-lg font-bold">
                {FormatPrice(product?.discountPrice)}
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProduct(true);
              setCurrentEditId(product?.id);
              setFormData({ ...product, sizes });
            }}
            className="mr-2"
          >
            <Pencil />
            Chỉnh sửa
          </Button>
          <Button
            onClick={() =>
              toast({
                title: "Bạn có chắn muốn xóa sản phấm?",
                description:
                  "Sản phẩm của bạn sẽ bị xóa vĩnh viễn và không khôi phục lại được",
                action: (
                  <div className="flex flex-col gap-2 items-center">
                    <ToastAction
                      altText="confirm"
                      variant="destructive"
                      onClick={() => {
                        handleDelete(product?._id);
                      }}
                    >
                      Xác nhận
                    </ToastAction>
                    <ToastAction altText="cancel">Hủy</ToastAction>
                  </div>
                ),
                duration: 2000,
              })
            }
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 />
            Xóa
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;

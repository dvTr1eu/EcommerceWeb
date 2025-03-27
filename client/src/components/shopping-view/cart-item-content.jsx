import { MinusIcon, PlusIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { FormatPrice } from "@/helpers/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "@/store/clientStore/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { useLocation } from "react-router-dom";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { productList } = useSelector((state) => state.clientProduct);
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleCartItemDelete(cartItem) {
    dispatch(deleteCartItem(cartItem.id)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Xóa sản phẩm thành công",
        });
        dispatch(getCartItems(user?.id));
      }
    });
  }

  function handleUpdateQuantity(cartItem, typeOfAction) {
    let getCart = cartItems || [];
    if (typeOfAction === "plus") {
      if (getCart.length) {
        const cartItemIndex = getCart.findIndex(
          (item) => item.productID === cartItem?.productID
        );

        if (cartItemIndex > -1) {
          const getCurrentProductIndex = productList.findIndex(
            (product) => product.id === cartItem?.productID
          );

          if (getCurrentProductIndex > -1) {
            // Kiểm tra sản phẩm tồn tại
            const foundSize = productList[
              getCurrentProductIndex
            ]?.sizes?.$values?.find(
              (size) => size.sizeName.trim() === cartItem?.sizeName?.trim()
            );

            if (foundSize) {
              // Kiểm tra size tồn tại
              const getQuantityStock = foundSize.quantity;

              if (getCart[cartItemIndex]?.quantity + 1 > getQuantityStock) {
                toast({
                  title: `Chỉ thêm được ${getQuantityStock} sản phẩm cho sản phẩm này`,
                  variant: "destructive",
                });
                return;
              }
            }
          }
        }
      }
    }
    const updatedQuantity =
      typeOfAction === "plus" ? cartItem?.quantity + 1 : cartItem?.quantity - 1;
    const formUpdate = {
      customerID: user?.id,
      productID: cartItem?.productID,
      quantity: updatedQuantity,
      imageUrl: cartItem?.imageUrl,
      sizeId: cartItem?.sizeId,
      sizeName: cartItem?.sizeName,
    };

    dispatch(updateCartItem({ formUpdate, cartId: cartItem.id })).then(
      (data) => {
        if (data?.payload?.success) {
          toast({
            title: "Cập nhật số lượng thành công",
          });
          dispatch(getCartItems(user?.id));
        }
      }
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.imageUrl}
        alt={cartItem?.productName}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">
          {cartItem?.productName} - {cartItem?.sizeName}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <MinusIcon className="w-4 h-4" />
            <span className="sr-only">Giảm</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="sr-only">Tăng</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          {FormatPrice(
            (cartItem?.discountPrice > 0
              ? cartItem?.discountPrice
              : cartItem?.price) * cartItem?.quantity
          )}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className={`cursor-pointer mt-1 hover:bg-red-500 hover:rounded-lg ${
            location.pathname === "/shop/checkout" ? "hidden" : ""
          }`}
          size={15}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;

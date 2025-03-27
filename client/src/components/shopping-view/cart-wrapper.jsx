import { current } from "@reduxjs/toolkit";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-item-content";
import { FormatPrice } from "@/helpers/utilities";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.discountPrice > 0
              ? currentItem?.discountPrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent classNmae="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Giỏ hàng của bạn</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
        ) : (
          <div>
            <span>Chưa có sản phẩm trong giỏ hàng</span>
          </div>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Tổng tiền</span>
          <span className="font-bold">{FormatPrice(totalCartAmount)}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-5"
        disabled={cartItems.length > 0 ? false : true}
      >
        Tiến hành thanh toán
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;

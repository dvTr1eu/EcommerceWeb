import UserCartItemsContent from "@/components/shopping-view/cart-item-content";
import { Button } from "@/components/ui/button";
import { FormatPrice } from "@/helpers/utilities";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderInfo from "@/components/shopping-view/order-info";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createNewOrder } from "@/store/clientStore/order-slice";
import { useNavigate } from "react-router-dom";
import ChatSupport from "@/components/common/chat-support";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOrderDisabled, setIsOrderDisabled] = useState(true);
  const { isLoading } = useSelector((state) => state.shopOrder);
  const [orderInformation, setOrderInformation] = useState(null);
  const [isValidOrderInfo, setIsValidOrderInfo] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { toast } = useToast();

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

  const handleOrderInformationChange = (info, isValid) => {
    setOrderInformation(info);
    setIsValidOrderInfo(isValid);
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  useEffect(() => {
    if (totalCartAmount >= 1000000 && paymentMethod === "cod") {
      setIsOrderDisabled(true);
    } else {
      setIsOrderDisabled(!isValidOrderInfo);
    }
  }, [totalCartAmount, paymentMethod, isValidOrderInfo]);

  const handleCheckout = async () => {
    try {
      const orderData = {
        customerId: user?.id,
        totalMoney: totalCartAmount,
        paymentMethod,
        address: orderInformation?.address,
        fullName: user?.fullName,
        note: orderInformation?.note,
      };
      dispatch(createNewOrder(orderData)).then((data) => {
        if (data?.payload?.success) {
          if (paymentMethod === "cod") {
            navigate("/shop/payment-success");
          } else if (paymentMethod === "onl" && data?.payload?.urlPayment) {
            window.location.href = data.payload.urlPayment;
          }
        }
      });
    } catch (error) {}
  };

  const codNote = (
    <div>
      <p>
        Lưu ý đơn hàng trên 1.000.000 quý khách vui lòng chọn Phương thức chuyển
        khoản ngân hàng.
      </p>
    </div>
  );

  const onlNote = (
    <p>
      Khi ấn đặt hàng bạn sẽ được chuyển hướng đến trang thanh toán của VnPay
    </p>
  );

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <OrderInfo onOrderInformationChange={handleOrderInformationChange} />
        <Card>
          <CardContent className="space-y-4 p-6 bg-[#ebebeb]">
            <h2 className="text-xl font-bold text-center">ĐƠN HÀNG CỦA BẠN</h2>
            <div className="flex flex-col gap-4">
              {cartItems && cartItems.length > 0
                ? cartItems.map((item) => (
                    <UserCartItemsContent cartItem={item} />
                  ))
                : null}
            </div>
            <Separator className="bg-black" />
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">TỔNG</span>
              <span className="font-bold">{FormatPrice(totalCartAmount)}</span>
            </div>
            <Separator className="bg-white" />
            <RadioGroup
              value={paymentMethod}
              onValueChange={handlePaymentMethodChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" />
                <Label>Trả tiền mặt khi nhận hàng</Label>
              </div>
              {paymentMethod === "cod" && codNote}
              <Separator className="bg-white" />
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onl" />
                <Label>Chuyển khoản ngân hàng</Label>
              </div>
              {paymentMethod === "onl" && onlNote}
              <Separator className="bg-white" />
            </RadioGroup>
            <Button
              disabled={isOrderDisabled}
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleCheckout}
            >
              ĐẶT HÀNG
            </Button>

            <span className="text-center mt-4 text-sm">
              Cảm ơn quý khách đã tin tưởng và luôn ủng hộ DVTShop
            </span>
          </CardContent>
        </Card>
      </div>
      <ChatSupport />
    </div>
  );
}

export default ShoppingCheckout;

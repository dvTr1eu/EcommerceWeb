import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect } from "react";
import { getOrderDetails } from "@/store/clientStore/order-slice";
import { Button } from "../ui/button";
import { FormatPrice } from "@/helpers/utilities";
import { updateOrderStatus } from "@/store/admin/order-slice";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function OrderDetailView({ orderId, orderStatus, typePayment }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails } = useSelector((state) => state.shopOrder);

  function handleReceiveOrder({ orderId, isPaid }) {
    const statusId = 4;
    const isDeleted = false;
    const isHistory = true;
    dispatch(
      updateOrderStatus({ orderId, statusId, isPaid, isDeleted, isHistory })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetails(orderId));
        toast({
          title: data?.payload?.message,
        });
        navigate("/shop/account");
      }
    });
  }

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Số lượng</TableHead>
          <TableHead>Đơn giá</TableHead>
          <TableHead>Thành tiền</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetails.map((orderDetailItem, index) => (
          <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <img className="w-24 h-24" src={orderDetailItem.ImageUrl} />
            </TableCell>
            <TableCell>{orderDetailItem.Product.ProductName}</TableCell>
            <TableCell>{orderDetailItem.SizeName}</TableCell>
            <TableCell>{orderDetailItem.Quantity}</TableCell>
            <TableCell>
              {FormatPrice(
                orderDetailItem.Product.DiscountPrice > 0
                  ? orderDetailItem.Product.DiscountPrice
                  : orderDetailItem.Product.Price
              )}
            </TableCell>
            <TableCell>
              {FormatPrice(
                orderDetailItem.Quantity *
                  orderDetailItem.Product.DiscountPrice >
                  0
                  ? orderDetailItem.Product.DiscountPrice
                  : orderDetailItem.Product.Price
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {orderStatus === "Đang giao" ? (
          <div>
            <Button
              onClick={() =>
                handleReceiveOrder({
                  orderId,
                  isPaid: typePayment === 1,
                })
              }
              className="mt-3 bg-orange-500 hover:bg-orange-600"
            >
              Đã nhận được hàng
            </Button>
          </div>
        ) : null}
      </TableFooter>
    </Table>
  );
}

export default OrderDetailView;

import { getAllOrdersByCustomerId } from "@/store/clientStore/order-slice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AddDay, FormatDate, FormatPrice } from "@/helpers/utilities";
import { Button } from "../ui/button";
import OrderDetailView from "./order-detail-view";
import { Separator } from "../ui/separator";

function OrderView({ orderList }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [typePayment, setTypePayment] = useState(null);

  const handleViewOrder = (orderId, orderStatus, typePayment) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    setOrderStatus(orderStatus);
    setTypePayment(typePayment);
  };

  console.log(orderList, "orderList");

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Ngày mua</TableHead>
            <TableHead>Ngày nhận dự kiến</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hình thức thanh toán</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList?.IsHistory && orderList?.Deleted
            ? null
            : orderList?.map((orderItem) => {
                const isSelected = selectedOrderId === orderItem?.ID;
                return (
                  <TableRow key={orderItem?.ID}>
                    <TableCell>{orderItem?.ID}</TableCell>
                    <TableCell>{FormatDate(orderItem?.OrderDate)}</TableCell>
                    <TableCell>
                      {FormatDate(AddDay(orderItem?.OrderDate, 3))}
                    </TableCell>
                    <TableCell>
                      {orderItem?.TransactionStatus?.Status}
                    </TableCell>
                    <TableCell>{orderItem?.Payment?.PaymentName}</TableCell>
                    <TableCell>{FormatPrice(orderItem?.TotalMoney)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleViewOrder(
                            orderItem?.ID,
                            orderItem?.TransactionStatus?.Status,
                            orderItem?.PaymentID
                          )
                        }
                        className={isSelected ? "bg-blue-500 text-white" : ""}
                      >
                        {isSelected ? "Thu gọn" : "Xem đơn hàng"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <Separator />
      {selectedOrderId && (
        <OrderDetailView
          orderStatus={orderStatus}
          orderId={selectedOrderId}
          typePayment={typePayment}
        />
      )}
    </div>
  );
}

export default OrderView;

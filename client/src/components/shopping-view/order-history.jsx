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

function OrderHistory({ orderList }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  console.log(orderList, "orderHistory");

  return (
    <div>
      {orderList && orderList.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Ngày mua</TableHead>
              <TableHead>Ngày nhận</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hình thức thanh toán</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((orderItem) => {
              const isSelected = selectedOrderId === orderItem.ID;
              return (
                <TableRow key={orderItem.ID}>
                  <TableCell>{orderItem.ID}</TableCell>
                  <TableCell>{FormatDate(orderItem.OrderDate)}</TableCell>
                  <TableCell>{FormatDate(orderItem.ShipDate)}</TableCell>
                  <TableCell>{orderItem.TransactionStatus.Status}</TableCell>
                  <TableCell>{orderItem?.Payment?.PaymentName}</TableCell>

                  <TableCell>{FormatPrice(orderItem.TotalMoney)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewOrder(orderItem.ID)}
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
      ) : (
        <p>Bạn chưa có đơn hàng nào. Hãy đi đến trang mua sắm đi nào ^^ </p>
      )}
      <Separator />
      {selectedOrderId && <OrderDetailView orderId={selectedOrderId} />}
    </div>
  );
}

export default OrderHistory;

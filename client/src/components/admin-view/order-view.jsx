import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { getOrderById } from "@/store/admin/order-slice";
import { useEffect } from "react";
import OrderDetailView from "../shopping-view/order-detail-view";
import { FormatDate, FormatPrice } from "@/helpers/utilities";

function OrderView({
  isOpenDialog,
  setIsOpenDialog,
  orderId,
  customerView,
  orderStatus,
}) {
  function handleCloseDialog() {
    setIsOpenDialog(false);
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Thông tin đơn hàng</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-row justify-center">
            <div className="grid items-center pr-14">
              <Label>ID: </Label>
              <Label>Ngày mua:</Label>
              <Label>Khách hàng:</Label>
              <Label>Số điện thoại:</Label>
              <Label>Địa chỉ nhận hàng:</Label>
              <Label>Tổng tiền:</Label>
            </div>
            <div>
              <p>{customerView.id}</p>
              <p>{FormatDate(customerView.orderDate)}</p>
              <p>{customerView.customer.fullName}</p>
              <p>{customerView.customer.phone}</p>
              <p>{customerView.customer.address}</p>
              <p>{FormatPrice(customerView.totalMoney)}</p>
            </div>
          </div>
          <div>
            <OrderDetailView orderStatus={orderStatus} orderId={orderId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderView;

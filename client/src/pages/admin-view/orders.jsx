import ChangeStatusView from "@/components/admin-view/change-status";
import OrderView from "@/components/admin-view/order-view";
import OrderDetailView from "@/components/shopping-view/order-detail-view";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormatDate, FormatPrice } from "@/helpers/utilities";
import { getAllOrdersUser } from "@/store/admin/order-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [customerView, setCustomer] = useState({});
  const dispatch = useDispatch();
  const { adminOrderList } = useSelector((state) => state.adminOrder);
  const [changeOrderId, setChangeOrderId] = useState(null);
  const [isOpenDialogStatus, setIsOpenDialogStatus] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersUser());
  }, [dispatch]);

  const handleViewOrder = (orderId, customerView) => {
    setIsOpenDialog(true);
    setSelectedOrderId(orderId);
    setCustomer(customerView);
  };

  console.log(adminOrderList, "adminOrderList");

  const handleViewChangeStatus = (orderId, customerView) => {
    setIsOpenDialogStatus(true);
    setChangeOrderId(orderId);
    setCustomer(customerView);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Ngày mua</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hình thức thanh toán:</TableHead>
            <TableHead>Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrderList.map((orderItem) => {
            return (
              <TableRow key={orderItem.id}>
                <TableCell>{orderItem.id}</TableCell>
                <TableCell>{orderItem.customer.fullName}</TableCell>
                <TableCell>{FormatDate(orderItem.orderDate)}</TableCell>
                <TableCell>{orderItem.transactionStatus.status}</TableCell>
                <TableCell>{orderItem?.payment?.paymentName}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewOrder(orderItem.id, orderItem)}
                    className={`mr-2 `}
                  >
                    Xem
                  </Button>
                  <Button
                    onClick={() =>
                      handleViewChangeStatus(orderItem.id, orderItem)
                    }
                  >
                    Cập nhật đơn hàng
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Separator />
      {selectedOrderId && (
        <OrderView
          isOpenDialog={isOpenDialog}
          orderId={selectedOrderId}
          setIsOpenDialog={setIsOpenDialog}
          customerView={customerView}
        />
      )}

      {changeOrderId && (
        <ChangeStatusView
          isOpenDialogStatus={isOpenDialogStatus}
          orderId={changeOrderId}
          setIsOpenDialogStatus={setIsOpenDialogStatus}
        />
      )}
    </div>
  );
}

export default AdminOrders;

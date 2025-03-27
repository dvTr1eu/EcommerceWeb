import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Table } from "../ui/table";
import {
  getAllOrdersUser,
  getOrderById,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useEffect, useState } from "react";
import { FormatDate, FormatPrice } from "@/helpers/utilities";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { toast } from "@/hooks/use-toast";

const initData = {
  statusId: "",
  isPaid: false,
  orderId: "",
  isDeleted: false,
  isHistory: false,
};

function ChangeStatusView({
  isOpenDialogStatus,
  setIsOpenDialogStatus,
  orderId,
}) {
  const dispatch = useDispatch();
  const { adminOrderDetails } = useSelector((state) => state.adminOrder);
  const [statusData, setStatusData] = useState(initData);
  console.log(adminOrderDetails);
  const [selectedID, setSelectedID] = useState(
    statusData.statusId || adminOrderDetails?.order?.TransactionStatus?.ID
  );
  const isDisabled = adminOrderDetails?.order?.TransactionStatus?.ID === 4;

  function handleCloseDialogStatus() {
    setIsOpenDialogStatus(false);
  }

  useEffect(() => {
    if (adminOrderDetails?.order) {
      setStatusData((prevState) => ({
        ...prevState,
        orderId: adminOrderDetails.order.ID,
        isPaid: adminOrderDetails.order.Paid || false,
        isDeleted: adminOrderDetails.order.Deleted || false,
      }));
    }
  }, [adminOrderDetails]);

  function handleSubmitDialogStatus() {
    dispatch(
      updateOrderStatus({
        orderId: statusData.orderId,
        statusId: statusData.statusId,
        isPaid: statusData.isPaid,
        isDeleted: statusData.isDeleted,
        isHistory: false,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersUser());
        dispatch(getOrderById(orderId));
        setIsOpenDialogStatus(false);
        setStatusData(initData);
        toast({ title: data?.payload?.message });
      }
    });
  }

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [dispatch, orderId]);

  return (
    <Dialog open={isOpenDialogStatus} onOpenChange={handleCloseDialogStatus}>
      <DialogContent>
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
              {adminOrderDetails?.order ? (
                <>
                  <p>{adminOrderDetails?.order?.ID}</p>
                  <p>{FormatDate(adminOrderDetails?.order?.OrderDate)}</p>
                  <p>{adminOrderDetails?.order?.Customer?.FullName}</p>
                  <p>{adminOrderDetails?.order?.Customer?.Phone}</p>
                  <p>{adminOrderDetails?.order?.Customer?.Address}</p>
                  <p>{FormatPrice(adminOrderDetails?.order?.TotalMoney)}</p>
                </>
              ) : (
                <p>Đang tải dữ liệu...</p>
              )}
            </div>
          </div>
          <Separator />
          <div className="pt-4">
            <Select
              value={
                statusData.statusId ||
                adminOrderDetails?.order?.TransactionStatus?.ID
              }
              onValueChange={(value) =>
                setStatusData((prevState) => ({
                  ...prevState,
                  statusId: value,
                }))
              }
              disabled={isDisabled}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Chọn trạng thái đơn hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {adminOrderDetails?.transactStatus ? (
                    adminOrderDetails.transactStatus.map((item) => {
                      return (
                        <SelectItem
                          disabled={isDisabled}
                          className="cursor-pointer"
                          key={item.ID}
                          value={item.ID}
                          onClick={() => setSelectedID(item.ID)}
                        >
                          {item.Status}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <p>Đang tải dữ liệu</p>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="pt-4">
              <Checkbox
                disabled={statusData.isPaid}
                checked={statusData.isPaid}
                onCheckedChange={(value) =>
                  setStatusData((prevState) => ({
                    ...prevState,
                    isPaid: value,
                  }))
                }
              />
              <label className="pl-2">Đã thanh toán</label>
            </div>
            <div>
              <Checkbox
                checked={statusData.isDeleted}
                onCheckedChange={(value) =>
                  setStatusData((prevState) => ({
                    ...prevState,
                    isDeleted: value,
                  }))
                }
              />
              <label className="pl-2">Đã hủy</label>
            </div>
          </div>
        </div>
        <DialogFooter className="justify-center items-center">
          <Button onClick={handleSubmitDialogStatus}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeStatusView;

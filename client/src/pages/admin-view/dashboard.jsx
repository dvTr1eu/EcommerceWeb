import ChooseDate from "@/components/admin-view/choose-date";
import TableHomeView from "@/components/admin-view/table-home-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderStatus, getProductSold } from "@/store/admin/home-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { BadgeX, ClipboardCheck, SquareX, Wallet } from "lucide-react";

function AdminDashboard() {
  const { orderListStatus, listInfoProduct } = useSelector(
    (state) => state.adminHome
  );
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);

  console.log(orderListStatus, "success");
  console.log(listInfoProduct, "info");

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      dispatch(getOrderStatus(formattedDate));
      dispatch(getProductSold(formattedDate));
    }
  }, [selectedDate, dispatch]);

  return (
    <div className="p-6 space-y-4">
      {/* Chọn ngày */}
      <div className="flex justify-center">
        <ChooseDate onDateSelect={setSelectedDate} />
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Đơn hàng đợi xác nhận</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {orderListStatus?.orderProcess?.$values?.length > 0
              ? orderListStatus?.orderProcess.$values.length
              : "0"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              Đơn hàng đã thanh toán
              <ClipboardCheck />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {orderListStatus?.orderSuccess?.$values?.length > 0
              ? orderListStatus?.orderSuccess.$values.length
              : "0"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              Đơn hàng hủy
              <BadgeX />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {orderListStatus?.orderDelete?.$values?.length > 0
              ? orderListStatus?.orderDelete.$values.length
              : "0"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Số sản phẩm đã bán</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {listInfoProduct?.totalProductSold > 0
              ? listInfoProduct?.totalProductSold
              : "0"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Số lượng tài khoản đăng ký
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">80</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              Số tiền trong ngày
              <Wallet />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {listInfoProduct?.doanhThu > 0
              ? listInfoProduct?.doanhThu.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              : "0"}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <TableHomeView
        listOrderPaid={orderListStatus?.orderSuccess?.$values}
        infoProduct={listInfoProduct?.listProduct?.$values}
      />
    </div>
  );
}

export default AdminDashboard;

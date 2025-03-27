import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function TableHomeView({ infoProduct, listOrderPaid }) {
  console.log(infoProduct);
  console.log(listOrderPaid);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng đã thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOrderPaid
                ? listOrderPaid.map((item) => {
                    return (
                      <TableRow>
                        <TableCell>{item.customer.fullName}</TableCell>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.customer.phone}</TableCell>
                        <TableCell>{item.customer.address}</TableCell>
                        <TableCell>
                          {item.totalMoney.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                        <TableCell>{item.paid ? "Hoàn thành" : null}</TableCell>
                      </TableRow>
                    );
                  })
                : "Chưa có thông tin..."}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm đã bán</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Tên sản phẩm</TableHead>
                  <TableHead className="text-center">Size</TableHead>
                  <TableHead className="text-center">Giá</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {infoProduct
                  ? infoProduct.map((info) => {
                      return (
                        <TableRow className="text-center">
                          <TableCell>{info.productID}</TableCell>
                          <TableCell>{info.productName}</TableCell>
                          <TableCell>{info.sizeName}</TableCell>
                          <TableCell>
                            {info.price.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </TableCell>
                          <TableCell>{info.totalSold}</TableCell>
                        </TableRow>
                      );
                    })
                  : "Chưa có thông tin..."}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default TableHomeView;

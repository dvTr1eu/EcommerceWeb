import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAccountById, getAllAccount } from "@/store/admin/account-slice";
import { EyeIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminAccounts() {
  const dispatch = useDispatch();
  const { accountList, account } = useSelector((state) => state.account);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    setCurrentId(id);
  };

  useEffect(() => {
    dispatch(getAllAccount());
  }, [dispatch, accountList]);

  useEffect(() => {
    if (currentId) {
      dispatch(getAccountById(currentId));
    }
  }, [currentId, dispatch]);

  return (
    <Fragment>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
          </DialogHeader>
          {account ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="name" className="text-center">
                  Họ tên:
                </Label>
                <p>{account.fullName}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="username" className="text-center">
                  Email:
                </Label>
                <p>{account.email}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="name" className="text-center">
                  Số điện thoại:
                </Label>
                <p>{account.phone}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="name" className="text-center">
                  Quyền:
                </Label>
                <p>{account.role}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="name" className="text-center">
                  Ngày tạo:
                </Label>
                <p>{account.createdAt.slice(0, 10)}</p>
              </div>
            </div>
          ) : (
            <p>Đang tải thông tin tài khoản...</p>
          )}
        </DialogContent>
      </Dialog>

      <Table className="w-[1100px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Quyền</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountList.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell className="w-[200px]">{item.fullName}</TableCell>
              <TableCell className="w-[200px]">{item.email}</TableCell>
              <TableCell className="w-[200px]">{item.phone}</TableCell>
              <TableCell className="w-[200px]">{item.role}</TableCell>
              <TableCell className="w-[200px]">
                {item.createdAt.slice(0, 10)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => handleOpenDialog(item.id)}
                  className="mr-2"
                >
                  <EyeIcon />
                  Xem
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default AdminAccounts;

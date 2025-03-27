import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

function OrderInfo({ onOrderInformationChange }) {
  const { user } = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const validateFields = () => {
    let newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }

    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validateFields();
    const orderInfo = { fullName, phone, email, address, note };
    onOrderInformationChange(orderInfo, isValid);
    // if (isValid) {
    // }
  }, [fullName, phone, email, address, note]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold">THÔNG TIN THANH TOÁN</h2>
        <div>
          <Label className="flex pb-3">
            Họ và tên
            <p className="text-red-500">*</p>
          </Label>

          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm pt-2">{errors.fullName}</p>
          )}
        </div>

        <div>
          <div>
            <Label className="flex pb-3">
              Số điện thoại
              <p className="text-red-500">*</p>
            </Label>

            <Input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm pt-2">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="flex pb-3">
            Email
            <p className="text-red-500">*</p>
          </Label>

          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm pt-2">{errors.email}</p>
          )}
        </div>

        <div>
          <Label className="flex pb-3">
            Địa chỉ
            <p className="text-red-500">*</p>
          </Label>

          <Input
            placeholder="Nhập địa chỉ cụ thể"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-red-500 text-sm pt-2">{errors.address}</p>
          )}
        </div>

        <div>
          <Label>Ghi chú</Label>
          <Textarea
            placeholder="Nhập ghi chú của bạn (tùy chọn)"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderInfo;

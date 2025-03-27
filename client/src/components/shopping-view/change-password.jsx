import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import CommonForm from "../common/form";
import { changePasswordForm } from "@/config";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/store/clientStore/account-slice";

function ChangePassword({ id }) {
  console.log(id);

  const inititalState = {
    newPassword: "",
    oldPassword: "",
    id: id,
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(inititalState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [errors, setErrors] = useState({});

  function VerifyPassword(formData) {
    const newErrors = {};
    if (!formData.newPassword || formData.newPassword.length <= 6) {
      newErrors.newPassword = "Mật khẩu ít nhất 6 ký tự";
    }
    if (formData.newPassword != formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = VerifyPassword(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log(formData);
    dispatch(changePassword(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cập nhật thành công",
        });
        setFormData(inititalState);
      }
    });
  }

  return (
    <CommonForm
      formControls={changePasswordForm}
      buttonText={"Cập nhật"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      errors={errors}
    />
    // <div>
    //   <div className="mb-3">
    //     <Label>Mật khẩu cũ</Label>
    //     <Input
    //       onChange={() => setOldPassword(e.target.value)}
    //       className="mt-2"
    //     ></Input>
    //   </div>
    //   <div className="mb-3">
    //     <Label>Mật khẩu mới</Label>
    //     <Input
    //       onChange={() => setNewPassword(e.target.value)}
    //       className="mt-2"
    //     ></Input>
    //   </div>
    //   <div className="mb-3">
    //     <Label>Nhập lại mật khẩu</Label>
    //     <Input className="mt-2"></Input>
    //   </div>
    //   <Button>Lưu</Button>
    // </div>
  );
}

export default ChangePassword;

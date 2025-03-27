import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { registerForm } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const inititalState = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(inititalState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  function validateFormData(formData) {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Tên đầy đủ phải ít nhất 3 ký tự";
    }

    if (
      !formData.phone ||
      !/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = "Vui lòng nhập đúng số điện thoại";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.password || formData.password.length <= 6) {
      newErrors.password = "Mật khẩu ít nhất 6 ký tự";
    }

    return newErrors;
  }

  function onSubmit(e) {
    e.preventDefault();

    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log(formData);

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload.message,
        });
        navigate("/auth/login");
      }
    });
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tạo mới tài khoản
        </h1>
        <p className="mt-2">
          Bạn đã có tài khoản?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerForm}
        buttonText={"Đăng ký"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        errors={errors}
      />
      <Button
        className="w-full hover:bg-blue-500"
        onClick={() => navigate("/shop/product")}
      >
        Quay lại trang sản phẩm
      </Button>
    </div>
  );
}

export default AuthRegister;

import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { loginForm } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const inititalState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(inititalState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Đăng nhập tài khoản
        </h1>
        <p className="mt-2">
          Bạn chưa có tài khoản?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Đăng ký
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginForm}
        buttonText={"Đăng nhập"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
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

export default AuthLogin;

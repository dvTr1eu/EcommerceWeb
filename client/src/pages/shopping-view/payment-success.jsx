import ChatSupport from "@/components/common/chat-support";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <div>
      <Card className="p-10">
        <CardHeader className="p-0">
          <CardTitle className="text-4xl">Đặt hàng thành công</CardTitle>
        </CardHeader>
        <Button className="mt-5" onClick={() => navigate("/shop/account")}>
          Xem đơn hàng
        </Button>
      </Card>
      <ChatSupport />
    </div>
  );
}

export default PaymentSuccess;

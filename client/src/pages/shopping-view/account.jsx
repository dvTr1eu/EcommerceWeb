import OrderView from "@/components/shopping-view/order-view";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { menuAccount } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByCustomerId } from "@/store/clientStore/order-slice";
import ChangePassword from "@/components/shopping-view/change-password";
import OrderHistory from "@/components/shopping-view/order-history";
import ChatSupport from "@/components/common/chat-support";

function ShoppingAccount() {
  const [activeView, setActiveView] = useState("overview");
  const { user } = useSelector((state) => state.auth);
  const { orderList } = useSelector((state) => state.shopOrder);
  const orderListFiltered = orderList.filter((order) => !order.IsHistory);
  const orderHistoryFiltered = orderList.filter((order) => order.IsHistory);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersByCustomerId(user?.id));
  }, [dispatch, user]);
  const views = {
    overview: (
      <div>
        <div>
          <div className="mt-8">
            <p className="mb-2">Xin chào, {user?.fullName}</p>
            <p className="mb-2">E-mail: {user?.email}</p>
          </div>
        </div>
      </div>
    ),
    changePassword: <ChangePassword id={user?.id} />,
    orderList: <OrderView orderList={orderListFiltered} />,
    orderHistory: <OrderHistory orderList={orderHistoryFiltered} />,
  };

  return (
    <div className="flex w-[70%] mx-auto mt-[50px] mb-10">
      <div className="w-1/4 pr-4 flex flex-col">
        {" "}
        {/* Cột 1: Menu */}
        {menuAccount.map((menuItem) => (
          <Button
            key={menuItem.label}
            className={`mb-[6px] ${
              activeView === menuItem.label ? "border-black bg-gray-200" : ""
            }`}
            variant="outline"
            onClick={() => setActiveView(menuItem.label)}
          >
            <menuItem.icon />
            {menuItem.title}
          </Button>
        ))}
      </div>
      <div className="w-3/4 bg-white border border-black rounded-sm shadow-md p-6">
        {views[activeView]}
      </div>
      <ChatSupport nameUser={user.fullName} userId={user.id} />
    </div>
  );
}

export default ShoppingAccount;

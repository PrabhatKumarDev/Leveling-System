import React, { useEffect } from "react";
import AppRoutes from "./pages/AppRoutes";
import { useAuthStore } from "./store/authStore";
import { useInventoryStore } from "./store/inventoryStore";
import ActiveRewardTimer from "./components/ActiveRewardTimer";

const App = () => {
  const token = useAuthStore((state) => state.token);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const fetchInventory = useInventoryStore((state) => state.fetchInventory);

  useEffect(() => {
    if (token) {
      fetchMe();
      fetchInventory();
    }
  }, [token, fetchMe, fetchInventory]);

  return (
    <>
      <AppRoutes />
      <ActiveRewardTimer />
    </>
  );
};

export default App;
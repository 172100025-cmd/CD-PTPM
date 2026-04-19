import { createBrowserRouter } from "react-router";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { WelcomePage } from "./pages/customer/WelcomePage";
import { MenuPage } from "./pages/customer/MenuPage";
import { CartPage } from "./pages/customer/CartPage";
import { OrderConfirmationPage } from "./pages/customer/OrderConfirmationPage";
import { OrderStatusPage } from "./pages/customer/OrderStatusPage";
import { ErrorPage } from "./pages/customer/ErrorPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AddItemPage } from "./pages/admin/AddItemPage";
import { EditItemPage } from "./pages/admin/EditItemPage";
import { QRCodesPage } from "./pages/admin/QRCodesPage";

export const router = createBrowserRouter([
  // Customer Flow
  {
    path: "/",
    Component: CustomerLayout,
    children: [
      { index: true, Component: WelcomePage },
      { path: "menu", Component: MenuPage },
      { path: "cart", Component: CartPage },
      { path: "confirmation/:orderId", Component: OrderConfirmationPage },
      { path: "order-status/:orderId", Component: OrderStatusPage },
      { path: "error", Component: ErrorPage },
    ],
  },
  // Admin Flow
  {
    path: "/admin",
    children: [
      { index: true, Component: AdminLoginPage },
      {
        path: "dashboard",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "add-item", Component: AddItemPage },
          { path: "edit-item/:itemId", Component: EditItemPage },
          { path: "qr-codes", Component: QRCodesPage },
        ],
      },
    ],
  },
]);

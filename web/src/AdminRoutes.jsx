// src/AdminRoutes.js
import { Routes, Route } from "react-router-dom";
import Product from "./pages/View/Admin/ProductManager/index";
import DashboardContent from "./pages/View/Admin/DashBoard/index"; // Update import path
import ProductCreate from "./pages/View/Admin/ProductManager/Create";
import ProductEdit from "./pages/View/Admin/ProductManager/Edit";
import CategoryIndex from "./pages/View/Admin/CategoryManager/index";
import CategoryCreate from "./pages/View/Admin/CategoryManager/Create";
import CategoryEdit from "./pages/View/Admin/CategoryManager/Edit";
import OrderIndex from "./pages/View/Admin/OrderManager/index";
import CustomerIndex from "./pages/View/Admin/CustomerManager/index";
import InternalIndex from "./pages/View/Admin/InternalManager";
import InternalEdit from "./pages/View/Admin/InternalManager/Edit";
import InternalCreate from "./pages/View/Admin/InternalManager/Create";
import RoleIndex from "./pages/View/Admin/RoleManager/";
import RoleCreate from "./pages/View/Admin/RoleManager/Create";
import PrivateRoute from "./PrivateRoute";
import NewsManager from "./pages/View/Admin/NewManager";
import NewsEdit from "./pages/View/Admin/NewManager/Edit";
import NewsCreate from "./pages/View/Admin/NewManager/Create";
import VoucherManager from "./pages/View/Admin/VoucherManager";
import VoucherEdit from "./pages/View/Admin/VoucherManager/Edit";
import VoucherCreate from "./pages/View/Admin/VoucherManager/Create";
import SupplierIndex from "./pages/View/Admin/SupplierManager";
import SupplierEdit from "./pages/View/Admin/SupplierManager/Edit";
import SupplierCreate from "./pages/View/Admin/SupplierManager/Create";
const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute element={<DashboardContent />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/productmanager" element={<PrivateRoute element={<Product />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/productmanager/create" element={<PrivateRoute element={<ProductCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/productmanager/edit/:id" element={<PrivateRoute element={<ProductEdit />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/VoucherManager" element={<PrivateRoute element={<VoucherManager />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/VoucherManager/edit/:id" element={<PrivateRoute element={<VoucherEdit />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/VoucherManager/create" element={<PrivateRoute element={<VoucherCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/categorymanager" element={<PrivateRoute element={<CategoryIndex />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/categorymanager/create" element={<PrivateRoute element={<CategoryCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/categorymanager/edit/:id" element={<PrivateRoute element={<CategoryEdit />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/suppliermanager" element={<PrivateRoute element={<SupplierIndex />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/suppliermanager/create" element={<PrivateRoute element={<SupplierCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/suppliermanager/edit/:id" element={<PrivateRoute element={<SupplierEdit />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/ordermanager" element={<PrivateRoute element={<OrderIndex />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/rolemanager" element={<PrivateRoute element={<RoleIndex />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/rolemanager/create" element={<PrivateRoute element={<RoleCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/customermanager" element={<PrivateRoute element={<CustomerIndex />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/InternalManager" element={<PrivateRoute element={<InternalIndex />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/InternalManager/Edit" element={<PrivateRoute element={<InternalEdit />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/InternalManager/Create" element={<PrivateRoute element={<InternalCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />

    <Route path="/NewsManager" element={<PrivateRoute element={<NewsManager />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/NewsManager/Edit" element={<PrivateRoute element={<NewsEdit />} roles={['Quản Trị Viên', 'Quản Lý']} />} />
    <Route path="/NewsManager/Create" element={<PrivateRoute element={<NewsCreate />} roles={['Quản Trị Viên', 'Quản Lý']} />} />


    <Route path="/unauthorized" element={<div>Bạn không có quyền truy cập trang này.</div>} />
  </Routes>
);

export default AdminRoutes;

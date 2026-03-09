import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Portal from "./pages/Portal/Portal";
import Home from "./pages/Home";
import Feedback from "./pages/PromotionManagement/Feedback";
import AdminDashboard from "./pages/AdminDashboard";
import PromotionManagement from "./pages/PromotionManagement/PromotionManagement";
import PromotionCreateForm from "./pages/PromotionManagement/PromotionCreateForm";
import PromotionUpdateForm from "./pages/PromotionManagement/PromotionUpdateForm";
import PromotionPage from "./pages/PromotionManagement/PromotionPage";
import SupplyManagement from "./pages/SupplierManagement/SupplyManagement";
import SupplierCreateForm from "./pages/SupplierManagement/SupplierCreateForm";
import Orders from "./pages/SupplierManagement/Orders";
import SupplierUpdateForm from "./pages/SupplierManagement/SupplierUpdateForm";
import InventoryUserPage from "./pages/InventoryManagement/InventoryUserPageView";
import InventoryCreateForm from "./pages/InventoryManagement/InventoryItemCreateForm";
import InventoryUpdateForm from "./pages/InventoryManagement/InventoryUpdateForm";
import SupplyRequestForm from "./pages/InventoryManagement/SupplyRequestForm";
import InventoryManagement from "./pages/InventoryManagement/InventoryManagement";
import PrescriptionCreateForm from "./pages/PrescriptionManagement/PrescriptionCreateForm";
import PrescriptionAssign from "./pages/PrescriptionManagement/PrescriptionAssignPage";
import PrescriptionManagement from "./pages/PrescriptionManagement/PrescriptionManagement";
import PrescriptionAssignForm from "./pages/PrescriptionManagement/PrescriptionAssignForm";
import PrescriptionAssignTable from "./pages/PrescriptionManagement/PrescriptionAssignTable";
import PrescriptionViewDetails from "./pages/PrescriptionManagement/PrescriptionViewDetails";
import DriverCreateForm from "./pages/DeliveryManagement/DriverCreateForm";
import DriverUpdateForm from "./pages/DeliveryManagement/DriverUpdateForm";
import DeliveryTaskcreateForm from "./pages/DeliveryManagement/DeliveryTaskcreateForm";
import DeliveryTaskUpdateForm from "./pages/DeliveryManagement/DeliveryTaskUpdateForm";
import DeliveryTaskManagement from "./pages/DeliveryManagement/DeliveryTaskManagement";
import DeliveryManagement from "./pages/DeliveryManagement/DeliveryManagement";
import DriverManagement from "./pages/DeliveryManagement/DriverManagement";
import DriverTable from "./pages/DeliveryManagement/DriverTable";
import DriverSignIn from "./pages/DeliveryManagement/DriverSignIn";
import PrescriptionUpdateForm from "./pages/PrescriptionManagement/PrescriptionUpdateForm";
import SignIn from "./pages/UserManagement/SignIn";
import SignUp from "./pages/UserManagement/SignUp";
import Profile from "./pages/UserManagement/Profile";
import UserTable from "./pages/UserManagement/Usertable";
import UserManagement from "./pages/UserManagement/UserManagement";
import PrivateRoute from "./components/PrivateRoute";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement";
import EmployeeCreateForm from "./pages/EmployeeManagement/EmployeeCreateForm";
import EmployeeUpdateForm from "./pages/EmployeeManagement/EmployeeUpdateForm";
import EmploeeLoginForm from "./pages/EmployeeManagement/EmplyeeLoginForm";
import UserPaymentDetails from "./pages/UserManagement/UserPaymentDetails";
import FeedbackSubmitForm from "./pages/PromotionManagement/FeedbackSubmitForm";
import FeedbackManagement from "./pages/PromotionManagement/FeedbackManagement";
import OrderHistory from "./pages/UserManagement/OrderHistory";
import Prescriptionform from "./pages/PrescriptionManagement/PrescriptionForm";
import DriverProfile from "./pages/DeliveryManagement/DriverProfile";
import DriverTask from "./pages/DeliveryManagement/DriverTask";
import EmployeeLeaveManagement from "./pages/EmployeeManagement/EmployeeLeaveManagement";
import EmployeeLeaveCreateForm from "./pages/EmployeeManagement/EmployeeLeaveCreateForm";
import EmployeeLeaveUpdateForm from "./pages/EmployeeManagement/EmployeeLeaveUpdateForm";
import EmployeeSalaryManagement from "./pages/EmployeeManagement/EmployeeSalaryManagement";
import EmployeeSalaryCreateForm from "./pages/EmployeeManagement/EmployeeSalaryCreateForm";
import EmployeeSalaryUpdateForm from "./pages/EmployeeManagement/EmployeeSalaryUpdateForm";
import POSPage from "./pages/POS/POSPage";
import ExpiryAlertsPage from "./pages/ExpiryAlerts/ExpiryAlertsPage";
import SalesHistoryPage from "./pages/Sales/SalesHistoryPage";
import PharmacySettingsPage from "./pages/Settings/PharmacySettingsPage";

// Protected Route wrapper - redirects to portal login if not authenticated
function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Portal / Login Page - the main entry point */}
        <Route path="/" element={<Portal />} />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback-submit" element={<FeedbackSubmitForm />} />
        <Route path="/promotions" element={<PromotionPage />} />
        <Route path="/inventory-user" element={<InventoryUserPage />} />
        <Route path="/prescriptionform" element={<Prescriptionform />} />
        <Route path="/driver-signin" element={<DriverSignIn />} />
        <Route path="/employee-sign-in" element={<EmploeeLoginForm />} />

        {/* Protected Admin/Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PharmacySettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expiry-alerts"
          element={
            <ProtectedRoute>
              <ExpiryAlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-history"
          element={
            <ProtectedRoute>
              <SalesHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback-management"
          element={
            <ProtectedRoute>
              <FeedbackManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promotion-management"
          element={
            <ProtectedRoute>
              <PromotionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-promotion"
          element={
            <ProtectedRoute>
              <PromotionCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-promotion/:id"
          element={
            <ProtectedRoute>
              <PromotionUpdateForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier-management"
          element={
            <ProtectedRoute>
              <SupplyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-supplier"
          element={
            <ProtectedRoute>
              <SupplierCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-supplier/:id"
          element={
            <ProtectedRoute>
              <SupplierUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-prescription"
          element={
            <ProtectedRoute>
              <PrescriptionCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-management"
          element={
            <ProtectedRoute>
              <PrescriptionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-assign"
          element={
            <ProtectedRoute>
              <PrescriptionAssign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-assigntable/:id"
          element={
            <ProtectedRoute>
              <PrescriptionAssignTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-prescription/:id"
          element={
            <ProtectedRoute>
              <PrescriptionUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-assignform/:id"
          element={
            <ProtectedRoute>
              <PrescriptionAssignForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-view-details/:id"
          element={
            <ProtectedRoute>
              <PrescriptionViewDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory-management"
          element={
            <ProtectedRoute>
              <InventoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-inventory"
          element={
            <ProtectedRoute>
              <InventoryCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-inventory/:id"
          element={
            <ProtectedRoute>
              <InventoryUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supply-request"
          element={
            <ProtectedRoute>
              <SupplyRequestForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery-management"
          element={
            <ProtectedRoute>
              <DeliveryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taskpage"
          element={
            <ProtectedRoute>
              <DeliveryTaskManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <DeliveryTaskcreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-task/:id"
          element={
            <ProtectedRoute>
              <DeliveryTaskUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-management"
          element={
            <ProtectedRoute>
              <DriverManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-create"
          element={
            <ProtectedRoute>
              <DriverCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-update/:id"
          element={
            <ProtectedRoute>
              <DriverUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <DriverTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-profile"
          element={
            <ProtectedRoute>
              <DriverProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-task"
          element={
            <ProtectedRoute>
              <DriverTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-table"
          element={
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-payment"
          element={
            <ProtectedRoute>
              <UserPaymentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route
          path="/employee-management"
          element={
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-employee"
          element={
            <ProtectedRoute>
              <EmployeeCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-employee/:id"
          element={
            <ProtectedRoute>
              <EmployeeUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-leave-management"
          element={
            <ProtectedRoute>
              <EmployeeLeaveManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-leave-employee"
          element={
            <ProtectedRoute>
              <EmployeeLeaveCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-leave-employee/:id"
          element={
            <ProtectedRoute>
              <EmployeeLeaveUpdateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-salary-management"
          element={
            <ProtectedRoute>
              <EmployeeSalaryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-salary-employee"
          element={
            <ProtectedRoute>
              <EmployeeSalaryCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-salary-employee/:id"
          element={
            <ProtectedRoute>
              <EmployeeSalaryUpdateForm />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to portal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

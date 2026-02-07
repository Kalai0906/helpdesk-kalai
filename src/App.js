import { Routes, Route ,Navigate} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import Register from "./pages/Register";

import Login from "./pages/Login";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ManagerDashboard from "./pages/Dashboard/ManagerDashboard";
import AgentDashboard from "./pages/Dashboard/AgentDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/Users/UserList";
import UserCreate from "./pages/Users/UserCreate";
import TicketList from "./pages/Tickets/TicketList";
import TicketCreate from "./pages/Tickets/TicketCreate";
import TicketDetail from "./pages/Tickets/TicketDetail";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SlaSettings from "./pages/Sla/SlaSettings";

function App() {
  return (
   
      <div style={{ display: "flex" }}>
        

        <div style={{ marginLeft: 220, width: "100%", padding: 20 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />} />

              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              {/* Role Routes */}
              <Route path="/superadmin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/manager" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
              <Route path="/agent" element={<PrivateRoute><AgentDashboard /></PrivateRoute>} />
              <Route path="/customer" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/create" element={<UserCreate />} />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/tickets/create" element={<TicketCreate />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reports" element={<Reports />} />
              <Route
                path="/sla"
                element={
                  <PrivateRoute roles={["ADMIN"]}>
                    <SlaSettings />
                  </PrivateRoute>
                }
              />

            </Routes>
          
        </div>
      </div>
    
  );
}

export default App;

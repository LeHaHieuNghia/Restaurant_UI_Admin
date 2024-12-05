import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Menu from "./scenes/Menu";
import Addproduct from "./scenes/addproduct/AddProduct";
import Login from "./scenes/account/Login";
import TableMn from "./scenes/table";
import Topbar from "./scenes/global/Topbar";
import AddTable from "./components/AddTable";
import { useAuth, AuthProvider } from "./scenes/account/AuthContext"; // Import AuthContext

// ProtectedRoute component ensures the user is authenticated before accessing protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Now you can use useAuth properly
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null; // Only render children if authenticated
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = React.useState(true);

  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {/* Sidebar and Topbar will only be displayed if authenticated */}
            <ProtectedRoute>
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  {/* Protected routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/TableMn" element={<TableMn />} />
                  <Route path="/Menu" element={<Menu />} />
                  <Route path="/AddProduct" element={<Addproduct />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/addtable" element={<AddTable />} />
                </Routes>
              </main>
            </ProtectedRoute>

            {/* Public route */}
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;

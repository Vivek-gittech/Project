import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ManagerDashBoard from './pages/ManagerDashBoard';

function AppRoutes() {
    return (
        <Routes>
            {/* Note: 'element' is singular */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/dashboard" element={<ManagerDashBoard />} />
        </Routes>
    );
}

export default AppRoutes;
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from '@/components/Layout'
import ProtectedRoute, { PublicOnlyRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import ChangePassword from '@/pages/ChangePassword'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import PostDetails from '@/pages/PostDetails'
import Profile from '@/pages/Profile'
import Signup from '@/pages/Signup'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* صفحات مش محتاجة تسجيل دخول */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* صفحات محمية + Layout بالـ Navbar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/posts/:postId" element={<PostDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

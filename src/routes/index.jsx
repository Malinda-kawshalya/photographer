import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Photographers from '../pages/Photographers/Photographers.jsx';
import Login from '../pages/login/Login.jsx';
import Signin from '../pages/signin/Signin.jsx';
import Sellers from '../pages/sellers/Sellers.jsx';
import Renters from '../pages/Renters/Renters.jsx';
import Dashboard from '../pages/seller_side/dashboard/Dashboard.jsx';
import Order from '../pages/seller_side/order/Order.jsx';
import Notice from '../pages/seller_side/notice/Notice.jsx';
import Earning from '../pages/seller_side/earning/Earning.jsx';
import Message from '../pages/message/Message.jsx';
import Payment from '../pages/payment/Payment.jsx';
import BookingForm from '../pages/booking_form/BookingForm.jsx';
import PortfolioDetailsForm from '../Components/Portfoliodetailsform/PortfolioDetailsForm.jsx';
import RentDetailsForm from '../Components/rentdetailform/RentDetailsForm.jsx';
import ShopDashboard from '../pages/shop_side/Shop_Dashboard/ShopDashboard.jsx';
import ShopOrder from '../pages/shop_side/shop_order/ShopOrder.jsx';
import ShopEarning from '../pages/shop_side/shop_earning/ShopEarning.jsx';
import ShopNotice from '../pages/shop_side/Shop_Notice/ShopNotice.jsx';
import ShopCard from '../pages/shop_side/shop_card/ShopCard.jsx';
import RentDashboard from '../pages/rent_side/rent_dashboard/RentDashboard.jsx';
import RentOrder from '../pages/rent_side/rent_order/RentOrder.jsx';
import RentEarning from '../pages/rent_side/rent_earning/RentEarning.jsx';
import RentNotice from '../pages/rent_side/rent_notice/RentNotice.jsx';
import ShopCardDetailsForm from '../pages/shop_side/shop_card_details_form/ShopCardDetailsForm.jsx';
import RentCardDetailsForm from '../pages/rent_side/rent_card_details_form/RentCardDetailsForm.jsx';
import ShopAbout from '../pages/shop_side/shop_about/ShopAbout.jsx';
import AboutUs from '../pages/seller_side/aboutus/SellerAbout.jsx';
import Portfolio from '../Components/portfolio/Portfolio.jsx';
import RentAbout from '../pages/rent_side/rent_about/RentAbout.jsx';
import RentCard from '../pages/rent_side/rent_card/RentCard.jsx';
import Aboutus from '../pages/About/AboutUs.jsx';
import Profile from '../pages/seller_side/profile/Profile.jsx';
import ClientMessage from '../pages/Client_message/ClientMessage.jsx';
import ShopProduct from '../Components/shop_product/ShopProduct.jsx';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute.jsx';
import StartChat from '../Components/StartChat/StartChat.jsx';
import ChatPage from '../pages/ChatPage/ChatPage.jsx';
import PhotographerChatsPage from '../pages/PhotographerChatsPage/PhotographerChatsPage.jsx';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard.jsx';
import ChatRoom from '../pages/ChatRoom/ChatRoom.jsx';

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/photographer',
    element: <Photographers />,
  },
  {
    path: '/shop',
    element: <Sellers />,
  },
  {
    path: '/rent',
    element: <Renters />,
  },
  {
    path: '/portfolio',
    element: <Portfolio />,
  },
  {
    path: '/shopproduct',
    element: <ShopProduct />,
  },
  {
    path: '/Aboutus',
    element: <Aboutus />,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  // Client Routes
  {
    element: <ProtectedRoute allowedRoles={['client']} />,
    children: [
      { path: '/message', element: <Message /> },
      { path: '/rentdetailsform', element: <RentDetailsForm /> },
      { path: '/clientmessage', element: <ClientMessage /> },
      { path: '/payments', element: <Payment /> },
      { path: '/bookingform', element: <BookingForm /> },
      { path: '/chat/:chatId', element: <ChatPage /> },
      { path: '/photographer', element: <Photographers /> },
      { path: '/shop', element: <Sellers /> },
      { path: '/rent', element: <Renters /> },
    ],
  },

  // Photographer Routes
  {
    element: <ProtectedRoute allowedRoles={['photographer']} />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/chats', element: <PhotographerChatsPage /> },
      { path: '/chat-room/:chatId', element: <ChatRoom /> },
      { path: '/order', element: <Order /> },
      { path: '/notice', element: <Notice /> },
      { path: '/earning', element: <Earning /> },
      { path: '/sellerabout', element: <AboutUs /> },
      { path: '/Portfoliodetailsform', element: <PortfolioDetailsForm /> },
    ],
  },

  // Rental Routes
  {
    element: <ProtectedRoute allowedRoles={['rental']} />,
    children: [
      { path: '/rentdashboard', element: <RentDashboard /> },
      { path: '/rentorder', element: <RentOrder /> },
      { path: '/rentearning', element: <RentEarning /> },
      { path: '/rentnotice', element: <RentNotice /> },
      { path: '/rentdetailsform', element: <RentDetailsForm /> },
      { path: '/rentcarddetailsform', element: <RentCardDetailsForm /> },
      { path: '/rentabout', element: <RentAbout /> },
    ],
  },

  // Shop Routes
  {
    element: <ProtectedRoute allowedRoles={['shop']} />,
    children: [
      { path: '/shopdashboard', element: <ShopDashboard /> },
      { path: '/shoporder', element: <ShopOrder /> },
      { path: '/shopearning', element: <ShopEarning /> },
      { path: '/shopnotice', element: <ShopNotice /> },
      { path: '/shopcarddetailsform', element: <ShopCardDetailsForm /> },
      { path: '/shopcarddetailsform/:id', element: <ShopCardDetailsForm /> }, // Add this route
      // Update these routes for editing products
      { path: '/shop-card-details/:id', element: <ShopCardDetailsForm /> },
      { path: '/shop-card-details', element: <ShopCardDetailsForm /> },
      { path: '/shopabout', element: <ShopAbout /> },
      { path: '/shopcard', element: <ShopCard /> },
    ],
  },

// Admin Routes
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '/admin-dashboard',
        element: <AdminDashboard />,
      },
],
  },

  // Shared Profile Route for all roles
  {
    element: <ProtectedRoute allowedRoles={['client', 'photographer', 'rental', 'shop', 'admin']} />,
    children: [
      { path: '/profile', element: <Profile /> },
      { path: '/shopcard', element: <ShopCard /> },
      { path: '/rentcard', element: <RentCard /> },
      // Add a new route for provider-specific rental products
      { path: '/rentcard/:providerId', element: <RentCard /> },
      { path: '/portfolio/:companyName', element: <Portfolio /> },


    ],
  },
]);

export default router;

import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard.jsx";
import { useSelector } from "react-redux";
import Inventory from "./Inventory/Inventory.jsx";
import OutletOrder from "./Orders/OutletOrder.jsx";
import MainRevnue from "./revenue/MainRevnue.jsx";

import { QueryClient, QueryClientProvider } from "react-query";

function Wait(time) {
  return new Promise((resove) => {
    setTimeout(resove, time);
  });
}
const ProctedRoute = lazy(() => import("./ProctedRoute/ProctedRoute.jsx"));
const ProctedRoute2 = lazy(() => import("./ProctedRoute/ProctedRoute2.jsx"));
const Nav = lazy(() => import("./Navbar/Nav.jsx"));
const Home = lazy(() => import("./home/Home.jsx"));
const Login = lazy(() => import("./Login.jsx"));
const Forget = lazy(() => import("./Help&Support/Forget.jsx"));
const Personal = lazy(() => import("./Register/Personal.jsx"));
const ShopDetails = lazy(() => import("./Register/ShopDetails.jsx"));
const Bank = lazy(() => import("./Register/Bank.jsx"));
const Sucess = lazy(() => import("./Register/Sucess.jsx"));
const Graph = lazy(() =>
  Wait(100).then(() => import("./Dashboard/GraphReal.jsx"))
);

const Search = lazy(() => import("./Dashboard/Search.jsx"));
const Profile = lazy(() => import("./profile/Profile.jsx"));
const EditProfile = lazy(() => import("./profile/EditProfile.jsx"));
const SubInventory = lazy(() => import("./Inventory/SubInventory.jsx"));
const Lowstock = lazy(() => import("./Inventory/Lowstock.jsx"));
const Processing = lazy(() => import("./Inventory/Processing.jsx"));
const OutofStock = lazy(() => import("./Inventory/OutofStock.jsx"));
const AddProduct = lazy(() => import("./addProduct/ListProduct.jsx"));
const Order = lazy(() => import("./Orders/Order.jsx"));
const Neworder = lazy(() => import("./Orders/Neworder.jsx"));
const Shiping = lazy(() => import("./Orders/Shiping.jsx"));
const Delivered = lazy(() => import("./Orders/Deliver.jsx"));
const Cancelled = lazy(() => import("./Orders/Cancelled.jsx"));
const Help = lazy(() => import("./Help&Support/Help.jsx"));
const Setting = lazy(() => import("./setting/Setting.jsx"));
const TotalRevenue = lazy(() => import("./revenue/TotalRevenue.jsx"));
const PaybleAmount = lazy(() => import("./revenue/PaybleAmount.jsx"));
const Pending = lazy(() => import("./revenue/Pending.jsx"));
const Archive = lazy(() => import("./Inventory/Archive.jsx"));
const EditProduct = lazy(() => import("./Editproduct/EditProduct.jsx"));
const queryClient = new QueryClient();
const Terms = lazy(() => import("./setting/Terms.jsx"));
const Privacy = lazy(() => import("./setting/Privacy.jsx"));
const Aboutus = lazy(() => import("./setting/Aboutus.jsx"));
import { Toaster } from "react-hot-toast";
import PayoutDetails from "./revenue/PayoutDetails.jsx";
import Loader from "./utils/Loader.jsx";
import PayableAmount from "./revenue/PaybleAmount.jsx";
import ProtectedListing from "./ProctedRoute/ProtectedListing.jsx";
const App = () => {
  const { isAuthnticated, dashAuthnticate,listingAuthnticated } = useSelector(
    (state) => state.showHide
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster />
          <Nav />
          <Routes>
            {/* Normal route  */}
            <Route
              path="/"
              element={
                <Suspense
                  fallback={
                    <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                      <Loader />
                    </div>
                  }
                >
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense
                  fallback={
                    <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                      <Loader />
                    </div>
                  }
                >
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/terms-and-conditions"
              element={
                <Suspense
                  fallback={
                    <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                      <Loader />
                    </div>
                  }
                >
                  <Terms />
                </Suspense>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <Suspense
                  fallback={
                    <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                      <Loader />
                    </div>
                  }
                >
                  <Privacy />
                </Suspense>
              }
            />
            <Route
              path="/about-us"
              element={
                <Suspense
                  fallback={
                    <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                      <Loader />
                    </div>
                  }
                >
                  <Aboutus />
                </Suspense>
              }
            />

           
            <Route
              path="/signup/personaldetails"
              element={
                <Suspense
                  fallback={
                    <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                      <Loader />
                    </div>
                  }
                >
                  <Personal />
                </Suspense>
              }
            />
            {/* protected route  */}
            <Route element={<ProctedRoute isAuthnticated={isAuthnticated} />}>
              <Route
                path="/signup/shopdetails"
                element={
                  <Suspense
                    fallback={
                      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                        <Loader />
                      </div>
                    }
                  >
                    <ShopDetails />
                  </Suspense>
                }
              />

              <Route
                path="/signup/bank_details"
                element={
                  <Suspense
                    fallback={
                      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                        <Loader />
                      </div>
                    }
                  >
                    <Bank />
                  </Suspense>
                }
              />
              <Route
                path="/signup/sucess"
                element={
                  <Suspense
                    fallback={
                      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                        <Loader />
                      </div>
                    }
                  >
                    <Sucess />
                  </Suspense>
                }
              />
            </Route>
            {/* protected route  */}

            <Route
              element={<ProctedRoute2 dashAuthnticate={dashAuthnticate} />}
            >
              {/* Nested route  */}
              <Route path="/dashboard/" element={<Dashboard />}>
                <Route index element={<Graph />} />
                <Route path="/dashboard/neworders" element={<Neworder />} />
                <Route path="/dashboard/shipping" element={<Shiping />} />
                <Route path="/dashboard/cancelled" element={<Cancelled />} />
                <Route path="/dashboard/delivered" element={<Delivered />} />

                <Route path="inventory" element={<Inventory />}>
                  <Route index element={<SubInventory />} />
                  <Route path="lowstocks" element={<Lowstock />} />
                  <Route path="exchange" element={<OutofStock />} />
                  <Route path="processing" element={<Processing />} />
                  <Route path="archive" element={<Archive />} />
                </Route>
<Route element={<ProtectedListing listingAuthnticated={listingAuthnticated}/>}>   
                <Route
                  path="add_product"
                  element={
                    <Suspense
                      fallback={
                        <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                          <Loader />
                        </div>
                      }
                    >
                      <AddProduct />
                    </Suspense>
                  }
                />

                <Route
                  path="/dashboard/add_product/edit/:product_id"
                  element={
                    <Suspense
                      fallback={
                        <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                          <Loader />
                        </div>
                      }
                    >
                      <EditProduct />
                    </Suspense>
                  }
                />
</Route>
                <Route path="orders" element={<OutletOrder />}>
                  <Route index element={<Order />} />
                  <Route path="neworder" element={<Neworder />} />
                  <Route path="shipping" element={<Shiping />} />
                  <Route path="delivered" element={<Delivered />} />
                  <Route path="cancelled" element={<Cancelled />} />
                </Route>

                <Route path="help" element={<Help />} />
                <Route path="settings" element={<Setting />} />
                <Route path="revenue" element={<MainRevnue />}>
                  <Route index element={<TotalRevenue />} />
                  <Route path="payout_amount" element={<PayableAmount />} />
                  <Route path="payout_details" element={<PayoutDetails />} />
                  <Route path="pending" element={<Pending />} />
                </Route>
              </Route>

              <Route
                path="/dashboard/search"
                element={
                  <Suspense
                    fallback={
                      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                        <Loader />
                      </div>
                    }
                  >
                    <Search />
                  </Suspense>
                }
              />
              <Route
                path="/shop/profile"
                element={
                  <Suspense
                    fallback={
                      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                        <Loader />
                      </div>
                    }
                  >
                  
                    <Profile />
                  </Suspense>
                }
              />
              <Route
                path="/shop/editprofile"
                element={
                  <Suspense
                    fallback={
                      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                        <Loader />
                      </div>
                    }
                  >
                   
                    <EditProfile />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
};

export default App;

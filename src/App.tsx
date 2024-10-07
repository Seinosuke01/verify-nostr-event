import { useCallback, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexPage } from "./pages";
import { ProfilePage } from "./pages/profile";
import { CommonLayout } from "./layouts/common-layout";

function App() {
  const [isChecking, setIsChecking] = useState(true);
  const [canNos2x, setCanNos2x] = useState(false);

  // nos2xの確認
  const checkNos2x = useCallback(() => {
    // windowオブジェクトへのアクセスが可能になるまで待つ、上限を設定して
    let maxWait = 20;

    setIsChecking(true);

    const interval = setInterval(() => {
      // nos2xが使えない
      if (maxWait <= 0) {
        alert("nos2xを追加してください");
        clearInterval(interval);
        setIsChecking(false);
        setCanNos2x(false);
        return;
      }

      // nos2xが使える
      if (window.nostr) {
        clearInterval(interval);
        setIsChecking(false);
        setCanNos2x(true);
        return;
      }

      maxWait--;
    }, 200);

    return interval;
  }, []);

  useEffect(() => {
    checkNos2x();
  }, [checkNos2x]);

  if (isChecking) {
    return <p>nos2x利用確認中です…</p>;
  }

  if (!canNos2x) {
    return <p>nos2xが使えません</p>;
  }

  const router = createBrowserRouter([
    {
      element: <CommonLayout />,
      children: [
        {
          path: "/",
          element: <IndexPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

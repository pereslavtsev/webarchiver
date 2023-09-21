import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { FocusStyleManager } from "@blueprintjs/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import Root from "./Root";
import PageDetails from "./routes/PageDetails";
import PageList from "./routes/PageList";
import WatcherList from "./routes/WatcherList";
import WatcherDetails from "./routes/WatcherDetails";
import SourceListPage from "./routes/SourceListPage";

FocusStyleManager.onlyShowFocusOnTabs();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "pages",
        element: <PageList />,
      },
      {
        path: "pages/:pageId",
        element: <PageDetails />,
      },
      {
        path: "sources",
        element: <SourceListPage />,
      },
      {
        path: "watchers",
        element: <WatcherList />,
      },
      {
        path: "watchers/:watcherId",
        element: <WatcherDetails />,
      }
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SOSActiveScreen } from "./screens/SOSActiveScreen";
import { NavigationScreen } from "./screens/NavigationScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginScreen,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/sos-active",
    Component: SOSActiveScreen,
  },
  {
    path: "/navigation",
    Component: NavigationScreen,
  },
]);

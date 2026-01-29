
import Home from "../documentation/home";
import PingPongGame from "../widget/PingPongGame";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/ping-pong",
    element: <PingPongGame />,
  },
];

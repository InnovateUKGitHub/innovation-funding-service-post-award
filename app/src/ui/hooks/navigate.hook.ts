import { useNavigate } from "react-router-dom";
import { ILinkInfo } from "@framework/types/ILinkInfo";

export const useNavigateCompatibility = () => {
  const navigate = useNavigate();
  return (routeInfo: ILinkInfo) =>
    navigate(`${routeInfo.path}?${new URLSearchParams(routeInfo.routeParams).toString()}`);
};

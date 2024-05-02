import { createContext } from "react";

export interface CartUpdateContextType {
    updateCart: boolean;
    setUpdateCart: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export const CartUpdateContext = createContext<CartUpdateContextType>({
    updateCart: false,
    setUpdateCart: () => {}
  });
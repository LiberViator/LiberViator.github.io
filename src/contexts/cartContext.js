import { useEffect, useReducer, createContext } from "react";
import cartList from "../db/carts";

export const CartContext = createContext();

const initialState = { cart: [], doUpload: false };

function reducer(state, { type, value }) {
  switch (type) {
    case "GET":
      const getItem = JSON.parse(localStorage.getItem("cart"));

      if (!getItem) {
        localStorage.setItem("cart", []);
      } else {
        return { ...state, cart: getItem };
      }
      return;

    case "ADD":
      const sameObj = state.cart.find(
        (object) => object.productId === value.productId
      );
      const newAddState = state.cart.filter((object) =>
        object === sameObj
          ? { ...object, quantity: (object.quantity += value.quantity) }
          : object
      );

      if (sameObj) {
        return { ...state, cart: newAddState, doUpload: true };
      } else {
        return { ...state, cart: [...state.cart, value], doUpload: true };
      }

    case "REMOVE":
      const newRemoveState = state.cart.filter((object) =>
        object.productId !== value.productId
          ? object
          : object.quantity > 1
          ? {
              ...object,
              quantity: (object.quantity -= 1),
            }
          : null
      );
      return { ...state, cart: newRemoveState, doUpload: true };

    case "UPLOAD":
      if (state.doUpload) {
        localStorage.setItem("cart", JSON.stringify(state.cart));
        return { ...state, cart: state.cart, doUpload: false };
      }
      return;

    default:
      return state;
  }
}

export function cartGet(dispatch) {
  return dispatch({
    type: "GET",
  });
}

export function cartUpload(dispatch) {
  return dispatch({
    type: "UPLOAD",
  });
}

export function cartAdd(dispatch, productId, quantity) {
  return dispatch({
    type: "ADD",
    value: { productId: productId, quantity: quantity },
  });
}

export function cartRemove(dispatch, productId) {
  return dispatch({
    type: "REMOVE",
    value: { productId: productId },
  });
}

export function cartCheckout() {
  console.log("Checkout");
}

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  window.addEventListener("beforeunload", () => cartUpload(dispatch));

  useEffect(() => {
    cartGet(dispatch);
  }, []);

  return (
    <CartContext.Provider value={[state, dispatch]}>
      {children}
    </CartContext.Provider>
  );
}

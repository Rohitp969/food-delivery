import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD": {
      const exist = state.find(
        (item) =>
          item.id === action.id &&
          item.size === action.size
      );

      if (exist) {
        return state.map((item) =>
          item.id === action.id &&
          item.size === action.size
            ? {
                ...item,
                qty: item.qty + action.qty,
              }
            : item
        );
      }

      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img,
        },
      ];
    }

    case "UPDATE":
      return state.map((item) =>
        item.id === action.id &&
        item.size === action.size
          ? {
              ...item,
              qty: item.qty + action.qty,
              price: action.price,
            }
          : item
      );

    case "INCREASE":
      return state.map((item, index) =>
        index === action.index
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      );

    case "DECREASE":
      return state.map((item, index) =>
        index === action.index
          ? {
              ...item,
              qty: item.qty > 1 ? item.qty - 1 : 1,
            }
          : item
      );

    case "REMOVE":
      return state.filter(
        (_, index) => index !== action.index
      );

    case "DROP":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
    reducer,
    [],
    () => {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    }
  );

  // Save Cart
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(state)
    );
  }, [state]);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartStateContext);

export const useDispatchCart = () =>
  useContext(CartDispatchContext);
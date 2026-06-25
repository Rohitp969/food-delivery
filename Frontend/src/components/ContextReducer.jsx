import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const userEmail = localStorage.getItem("userEmail");

const initialState = userEmail
  ? JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || []
  : [];

const reducer = (state, action) => {
  switch (action.type) {

    case "ADD":
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

    case "REMOVE":
     let newArr = [...state];
     newArr.splice(action.index, 1);
     return newArr;

     case "UPDATE":
      return state.map((item) => {
      if (item.id === action.id && item.size === action.size) {
      return {
        ...item,
        qty: item.qty + action.qty,
      };
    }
    return item;
  });

  case "DROP":
  const email = localStorage.getItem("userEmail");

  if (email) {
    localStorage.removeItem(`cart_${email}`);
  }

  return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
  const email = localStorage.getItem("userEmail");

  if (email) {
    localStorage.setItem(`cart_${email}`, JSON.stringify(state));
  }
}, [state]);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);

export const useDispatchCart = () => useContext(CartDispatchContext);
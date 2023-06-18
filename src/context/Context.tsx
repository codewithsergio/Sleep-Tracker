import { createContext, useReducer, PropsWithChildren } from "react";

function reducer(state: any, action: any) {
  switch (action.type) {
    case "UPDATE_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };
    case "UPDATE_SLEEP_DATA":
      return {
        ...state,
        sleepData: action.payload,
      };
    case "ADD_SLEEP_TIME":
      return {
        ...state,
        sleepData: {
          ...state.sleepData,
          sleepTimeDict: action.payload,
        },
      };
    case "ADD_WAKE_TIME":
      return {
        ...state,
        sleepData: {
          ...state.sleepData,
          timeWokeUpList: [...state.sleepData.timeWokeUpList, action.payload],
        },
      };
    default:
      return state;
  }
}

const initialState = {
  userData: {
    name: "",
    email: "",
    uid: "",
  },
  sleepData: {
    sleepTimeDict: {},
    timeWokeUpList: [],
  },
};

export const Context = createContext<any | undefined>(undefined);

export const ContextProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider
      value={{
        userData: state.userData,
        sleepData: state.sleepData,
        dispatch,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

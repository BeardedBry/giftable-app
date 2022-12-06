
import React, { useContext } from 'react';

type ProfileInfo = {
    display_name: string,
    id: number,
}

type AppData = {
    profiles: Array<ProfileInfo>
}

export const AppContext = React.createContext({
    data: null,
    setData: null,
});

// const appReducer = (state, action) => {
//     switch (action.type) {
//       case 'increment': {
//         return {count: state.count + 1}
//       }
//       case 'decrement': {
//         return {count: state.count - 1}
//       }
//       default: {
//         throw new Error(`Unhandled action type: ${action.type}`)
//       }
//     }
//   }


function ContextWrapper({ children }) {    

    const [data, setData] = React.useState({});

    return (
        <AppContext.Provider value={{data, setData}}>
        { children }
        </AppContext.Provider>
        )
}

const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppcontext must be used within a Provider')
  }
  const {data, setData}: {data: AppData, setData: React.Dispatch<React.SetStateAction<{}>>} = context;

  return {data, setData};
}

export {ContextWrapper, useAppContext}
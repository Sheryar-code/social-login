const initialState = {
  user: null,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
   
    case 'SET_USER':
      console.log("userr",action)
    return {
      
        ...state,
        user: action.payload,
      };
    default: {
      return state;
    }
  }
};
export default accountReducer;

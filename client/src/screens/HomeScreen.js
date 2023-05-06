import { Link } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true };
    case 'FETCH_SUCCESS':
      return {...state, loading: false, products: action.payload};
    case 'FETCH_ERROR':
      return {...state, loading:false, error: action.payload };
    default:
      return state;
  }
}
function HomeScreen() {
  const [{ products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  })
  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
        try {
          const result = await axios.get('/api/products');
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data});
        } catch (err) {
          dispatch({ type: 'FETCH_ERROR', payload: err.message});
        }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <Link to={`/product/${product.slug}`}>
                <p>
                  <strong>{product.price}</strong>
                </p>
              </Link>
              <button>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomeScreen;

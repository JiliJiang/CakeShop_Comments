import React from 'react';
import { useState } from 'react';
import { useMutation } from "@apollo/client";
import { useStoreContext } from "../../utils/GlobalState";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY, UPDATE_CART_COMMENTS } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
//import { UPDATE_PRODUCT } from "../../utils/mutations";
import { ADD_COMMENT } from "../../utils/mutations";

import './style.css';

const CartItem = ({ item }) =>
{

  //eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  const [comments, setComments] = useState([{}]);

  
  //const [updateProduct, {error}] = useMutation(UPDATE_PRODUCT);

  const [addComment, { error }] = useMutation(ADD_COMMENT);

  const removeFromCart = item =>
  {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });
    idbPromise('cart', 'delete', { ...item });

  };

  const onChange = (e) =>
  {
    const value = e.target.value;
    if (value === '0')
    {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });
      idbPromise('cart', 'delete', { ...item });

    } else
    {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(value)
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });

    }
  }

  //add comments to state to the associated product
  const showComment = (e, _id) =>
  {
    if (e.target[0].value !== "")
    {
      
      //setComments([...comments, { productId: _id, text: e.target[0].value }]);

      //const targetComments = comments.filter((comment) => comment.id === _id);
      //console.log("************", targetComments)

      //const newComment = { productId: _id, text: e.target[0].value };

      
      addComment({
        variables: {
          productId: _id, 
          text: e.target[0].value,
        }
      }).then((newComment) => {

        console.log("&&&&&&&&&&&&comments", newComment);

        const id= newComment.data.addComment.productId;
        const text = newComment.data.addComment.text;
  
        setComments ([...comments, { id, text}]);
      }) ;
      e.target[0].value = '';

      
      /* dispatch(
        {
          type: UPDATE_CART_COMMENTS,
          _id: _id,
          comments: [...comments, newComment]
        });  */

        //idbPromise('cart', 'put', { ...item, comments: comments });
        //console.log("******",state);
        //get product idbPromise
        //find the product in the state
        //const targetProduct = state.products.filter((product) => product._id===_id)[0];
        //targetProduct.comments = [newComment]; 
        //update db entry
        //updateProduct (_id, targetProduct.quantity, targetProduct.comments);
        
       
    }
    };
  
return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            className="cart-input-quantity"
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>

        <div className="tag">
          <form className="tag-form" onSubmit={e=>{
            e.preventDefault();
            showComment(e, item._id)}}>

            <input className="tag-input"
              type="text"
              placeholder="Please add comments here"
            />
          </form>

          <ul className="tagGroup">
              {comments.filter((comment) => item._id === comment.id).map((comment, index) => (
                <li key={index}>
                  <span className="tagText">{comment.text}</span>
                </li>
              ))}
          </ul>
        
        </div>

      </div>
    </div>
  );
}

export default CartItem;
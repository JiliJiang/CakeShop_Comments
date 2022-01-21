import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_COMMENTS, QUERY_PRODUCTS } from "../utils/queries";

//import { QUERY_COMMENT } from '../utils/queries';

//showComment();

function OrderHistory() {
  const { data } = useQuery(QUERY_USER);

  const { loading, error, comments } = useQuery(QUERY_PRODUCTS);

  // if (loading) return "Loading...";
  // if (error) return `Error! ${error.message}`;

  let user;

  if (data) {
    user = data.user;
  }

  //const showComment = () => {};

  useEffect(() => {
    if (!error) {
      console.log("*******", error, loading, comments);
    }
  }, [comments]);

  return (
    <>
      <div className="container-prod my-1">
        <Link to="/">← Back to Products</Link>

        {user ? (
          <>
            <h2>
              Order History for {user.firstName} {user.lastName}
            </h2>
            <h3>Address: {user.address}</h3>
            <h3>Email: {user.email}</h3>

            {user.orders.map((order) => (
              <div key={order._id} className="my-2">
                <h3>
                  Purchase Date:{" "}
                  {new Date(parseInt(order.purchaseDate)).toLocaleDateString()}
                </h3>

                <div className="flex-row-history">
                  {console.log("$$$$$$$$$$", order.products)}
                  {order.products.map(
                    ({ _id, image, name, description, price }, index) => (
                      <div key={index} className="card-history px-1 py-1">
                        <Link to={`/products/${_id}`}>
                          <img alt={name} src={`/images/${image}`} />
                          <p>{name}</p>
                          <p className="text-history">{description}</p>
                        </Link>
                        <div>
                          <span>Price: ${price}</span>
                        </div>
                        <br />
                        <div>
                          {data.length > 0
                            ? data.map((comment) => {
                                return <p className="text-history"></p>;
                              })
                            : null}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* <div>
                    {Object.keys(order).includes("comments") ? order.comments.map((comment) => {
                      return (
                        <div>{comment}</div>
                      );
                    }) : null}
                </div> */}
              </div>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}

export default OrderHistory;

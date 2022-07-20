import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import {
  ProductContext,
  productGet,
  productSetColor,
  productSetSize,
  productSetQuantity,
} from "./../contexts/productContext";

import { CartContext, cartAdd } from "./../contexts/cartContext";

import Header from "./../layout/Header";
import Footer from "./../layout/Footer";

import Button from "./../components/Button";
import Divider from "./../components/Divider";
import Gallery from "./../components/Gallery";
import Rating from "./../components/Rating";
import ColorInp from "../components/ColorInp";
import SizeInp from "../components/SizeInp";
import QuantityInp from "../components/QuantityInp";

import "./Product.scss";

export default function Product() {
  const { productLink } = useParams();
  const [{ product, color, size, quantity }, productDispatch] =
    useContext(ProductContext);
  const [, cartDispatch] = useContext(CartContext);

  useEffect(() => {
    productGet(productDispatch, Number(productLink));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productLink]);

  return (
    <>
      <Header />
      <main className="product">
        <div className="product__content">
          <Gallery product={product} />
          <Checkout>
            <Name />
            <Ranking />
            <Price />
            <Description />
            <Divider />
            <Colors />
            <Sizes />
            <Divider />
            <Quantity />
            <nav className="product__checkout__nav">
              <Button
                variant="PRODUCT"
                onClick={(e) =>
                  cartAdd(cartDispatch, product.id, color, size, quantity)
                }
              />
              <Button variant="LIKE" />
            </nav>
          </Checkout>
          {/* <Overview></Overview>
          <Specs></Specs>
          <Reviews></Reviews> */}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Checkout({ children }) {
  return (
    <section className="product__checkout">
      <div className="product__checkout__content">{children}</div>
      <hr />
    </section>
  );
}

function Name() {
  const [{ product }] = useContext(ProductContext);

  return (
    <h2 className="product__checkout__name">{product ? product.title : ""}</h2>
  );
}

function Ranking() {
  return (
    <div className="product__checkout__ranking">
      <Rating rate={3.7} />
      <a href="#reviews">See 8 reviews</a>
    </div>
  );
}

function Price() {
  const [{ product }] = useContext(ProductContext);

  return (
    <div className="product__checkout__pricing">
      <h2 className="product__checkout__pricing__current">
        {product && `$${product.price},00`}
      </h2>
    </div>
  );
}

function Description() {
  const [{ product }] = useContext(ProductContext);

  return (
    <p className="product__checkout__desc">
      {product ? product.description : ""}
    </p>
  );
}

function Colors() {
  const [{ product, color }] = useContext(ProductContext);

  if (product && product.colors.length > 1) {
    return (
      <div className="product__checkout__colors">
        <h4 className="product__checkout__title">
          Color: <span>{color}</span>
        </h4>
        <ul>
          {product.colors.map((item, index) => (
            <Color
              item={item}
              hex={
                item === "Navy Green"
                  ? "#386641"
                  : item === "Blue"
                  ? "#2A4494"
                  : item === "Orange"
                  ? "#F18F01"
                  : ""
              }
              index={index}
              key={index}
            />
          ))}
        </ul>
      </div>
    );
  }
}

function Color({ index, hex }) {
  const [{ product, color }, dispatch] = useContext(ProductContext);
  const handleChange = (e) => {
    productSetColor(dispatch, product.colors[index]);
  };

  return (
    <ColorInp
      onChange={handleChange}
      isChecked={color === product.colors[index]}
      colorCode={hex}
    />
  );
}

function Sizes() {
  const [{ product }] = useContext(ProductContext);

  if (product && product.colors.length > 1) {
    return (
      <div className="product__checkout__sizes">
        <h4 className="product__checkout__title">Size</h4>
        <ul>
          {product.sizes.map((item, index) => (
            <Size item={item} index={index} key={index} />
          ))}
        </ul>
      </div>
    );
  }
}

function Size(props) {
  const [{ product, size }, dispatch] = useContext(ProductContext);
  const handleChange = (e) => {
    productSetSize(dispatch, product.sizes[props.index]);
  };

  return (
    <SizeInp
      onChange={handleChange}
      isChecked={size === product.sizes[props.index]}
      sizeName={product.sizes[props.index]}
    />
  );
}

function Quantity() {
  const [{ quantity }, dispatch] = useContext(ProductContext);
  const handleIncrease = (e) => {
    e.preventDefault();
    productSetQuantity(dispatch, quantity + 1);
  };
  const handleDecrease = (e) => {
    e.preventDefault();
    quantity > 1 && productSetQuantity(dispatch, quantity - 1);
  };
  const handleSet = (e) => productSetQuantity(dispatch, e.target.value);

  return (
    <div className="product__checkout__quantity">
      <div>
        <label className="product__checkout__title" htmlFor="quantity">
          Quantity:
        </label>
        <QuantityInp
          variant="PRODUCT"
          value={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onSet={handleSet}
        />
      </div>
      <h4 className="product__checkout__title">In Stock</h4>
    </div>
  );
}

// Overview
// function Overview(props) {
//   return (
//     <section id="overview" className="product__overview">
//       <div className="product__overview__content">
//         <h2 className="product__heading">Overview:</h2>
//         {props.children}
//       </div>
//       <hr />
//     </section>
//   );
// }

// Specification
// function Specs() {
//   const [{ product }] = useContext(ProductContext);

//   return (
//     <section id="specification" className="product__specs">
//       <div className="product__specs__content">
//         <h2 className="product__heading">Specification:</h2>
//         <ul className="product__specs__list">
//           {product && product.colors
//             ? product.colors.map((item, index) => <SpecsItem key={index} />)
//             : ""}
//         </ul>
//       </div>
//       <hr />
//     </section>
//   );
// }

// function SpecsItem(props) {
//   return (
//     <li className="product__specs__list__item">
//       <h4>Weight:</h4>
//       <h3>600g</h3>
//     </li>
//   );
// }

// Reviews
// function Reviews(props) {
//   return (
//     <section id="reviews" className="product__reviews">
//       <div className="product__reviews__content">
//         <h2 className="product__heading">Reviews:</h2>
//         {props.children}
//       </div>
//       <hr />
//     </section>
//   );
// }

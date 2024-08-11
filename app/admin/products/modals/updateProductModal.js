
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateModal = ({
  show,
  handleClose,
  product,
  setBarCode,
  setName,
  setPrice,
  setStock,
  handleUpdateProduct,
}) => {

  useEffect(() => {
    if (product) {
      setBarCode(product.barcode);
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock_quantity);
    }
  }, [product, setBarCode, setName, setPrice, setStock]);

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
      aria-hidden={!show}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Product</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="barcode" className="form-label">
                  Barcode
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="barcode"
                  value={product?.barcode || ''}
                  onChange={(e) => setBarCode(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={product?.name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  value={product?.price || ''}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="stock" className="form-label">
                  Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="stock"
                  value={product?.stock_quantity || ''}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateProduct}
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;

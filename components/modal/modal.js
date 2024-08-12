import { Modal, Button } from "react-bootstrap";

const InformationModal = ({
  show,
  handleClose,
  title,
  children,
  style,
  className,
  centered,
  animation,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      style={style}
      className={className}
      centered={centered}
      animation={animation}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default InformationModal;

import React, { useState } from "react";
import { Modal } from "react-bootstrap";

function ViewPreviousComments({ post }: any) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="_previous_comment">
      {/* <button type="button" className="_previous_comment_txt"> */}
      <button
        type="button"
        className="_previous_comment_txt"
        data-bs-toggle="modal"
        data-bs-target="#previousCommentsModal"
      >
        View {post?.totalComments} previous comments
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewPreviousComments;

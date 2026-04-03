import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="_social_registration_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img src="assets/images/shape1.svg" alt="" className="_shape_img" />
          <img
            src="assets/images/dark_shape.svg"
            alt=""
            className="_dark_shape"
          />
        </div>
        <div className="_shape_two">
          <img src="assets/images/shape2.svg" alt="" className="_shape_img" />
          <img
            src="assets/images/dark_shape1.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_shape_three">
          <img src="assets/images/shape3.svg" alt="" className="_shape_img" />
          <img
            src="assets/images/dark_shape2.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        {children}
      </section>
    </>
  );
}

export default layout;

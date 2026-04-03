"use client";

import { loginAction } from "@/app/actions/auth";
import { LoginFormState } from "@/app/lib/definitions";
import React, { useActionState, useEffect, useState } from "react";

const initialState = {
  error: undefined,
  inputs: {},
};
export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginFormState>(
    loginAction as any,
    initialState
  );
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<LoginFormState["message"]>
  >('');

  useEffect(() => {
    if (state?.message) {
      setFieldErrors(state.message);
    }
  }, [state.message]);

  const handleInputChange = () => {
    if (fieldErrors) {
      setFieldErrors('');
    }
  };

  return (
    <form className="_social_login_form" action={action}>
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label className="_social_login_label _mar_b8">Email</label>
            <input
              type="email"
              name="email"
              className="form-control _social_login_input"
              onChange={() => handleInputChange()}
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label className="_social_login_label _mar_b8">Password</label>
            <input
              type="password"
              name="password"
              className="form-control _social_login_input"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="form-check _social_login_form_check">
            <input
              className="form-check-input _social_login_form_check_input"
              type="radio"
              name="remember"
              id="flexRadioDefault2"
              onChange={() => handleInputChange()}
            />
            <label
              className="form-check-label _social_login_form_check_label"
              htmlFor="flexRadioDefault2"
            >
              Remember me
            </label>
          </div>
        </div>
        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="_social_login_form_left">
            <p className="_social_login_form_left_para">Forgot password?</p>
          </div>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mt-3">
        {state?.message && <p className="text-danger fs-6">{state.message}</p>}
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_login_form_btn _mar_t40 _mar_b60">
            <button
              type="submit"
              disabled={pending}
              className="_social_login_form_btn_link _btn1"
            >
              {pending ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

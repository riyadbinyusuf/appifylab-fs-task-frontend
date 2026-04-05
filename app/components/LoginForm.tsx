"use client";

import { loginAction } from "@/app/actions/auth";
import {
  FormErrorsType,
  FormState,
  LoginFormState,
} from "@/app/lib/definitions";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  status: undefined,
  message: undefined,
  errors: {},
  inputs: {},
};
export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState>(
    loginAction as any,
    initialState,
  );
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<FormErrorsType["fieldErrors"]>
  >(state?.errors?.fieldErrors || {});

  useEffect(() => {
    if (state?.errors?.fieldErrors) {
      setFieldErrors(state.errors?.fieldErrors);
    }
  }, [state.errors]);

  const handleInputChange = (
    field: keyof NonNullable<FormErrorsType["fieldErrors"]>,
  ) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <form className="_social_login_form" action={action}>
      <div className="row gy-2">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b8">
            <label className="_social_login_label _mar_b8">Email</label>
            <input
              type="email"
              name="email"
              className="form-control _social_login_input"
              onChange={() => handleInputChange("email")}
            />
          </div>
          {fieldErrors?.email && (
            <p className="small text-danger">{fieldErrors.email?.[0]}</p>
          )}
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b8">
            <label className="_social_login_label _mar_b8">Password</label>
            <input
              type="password"
              name="password"
              className="form-control _social_login_input"
              onChange={() => handleInputChange("password")}
            />
          </div>
          {fieldErrors?.password && (
            <p className="small text-danger">{fieldErrors.password?.[0]}</p>
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="form-check _social_login_form_check">
            <input
              className="form-check-input _social_login_form_check_input"
              type="radio"
              name="remember"
              id="flexRadioDefault2"
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
        {state.message && <p className="text-danger fs-6">{state.message}</p>}
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

'use client';

import { signupAction } from "@/app/actions/auth";
import { FormState } from "@/app/lib/definitions";
import React, { useActionState, useEffect, useState } from "react";

const initialState = {
  success: false,
  errors: {},
  inputs: {}
};

export default function SignUpForm() {
  const [state, action, pending] = useActionState<FormState>(signupAction as any, initialState);

  const [fieldErrors, setFieldErrors] = useState<NonNullable<FormState['errors']>>(state?.errors || {});

  useEffect(() => {
    if (state?.errors) {
      setFieldErrors(state.errors);
    }
  }, [state.errors]);

  const handleInputChange = (field: keyof NonNullable<FormState['errors']>) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form className="_social_registration_form" action={action}>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">First name</label>
            <input
              type="text"
              name="firstName"
              className="form-control _social_registration_input"
              defaultValue={state.inputs?.firstName || ''}
              onChange={() => handleInputChange('firstName')}
            />
          </div>
          {fieldErrors?.firstName && <p className="text-danger fs-6">{fieldErrors.firstName}</p>}
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Last name</label>
            <input
              type="text"
              name="lastName"
              className="form-control _social_registration_input"
              defaultValue={state.inputs?.lastName || ''}
              onChange={() => handleInputChange('lastName')}
            />
          </div>
          {fieldErrors?.lastName && <p className="text-danger fs-6">{fieldErrors.lastName}</p>}
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Email</label>
            <input
              type="email"
              name="email"
              className="form-control _social_registration_input"
              defaultValue={state.inputs?.email || ''}
              onChange={() => handleInputChange('email')}
            />
          </div>
          {fieldErrors?.email && <p className="text-danger fs-6">{fieldErrors.email}</p>}
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control _social_registration_input"
              onChange={() => handleInputChange('password')}
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">
              Repeat Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control _social_registration_input"
              onChange={() => handleInputChange('confirmPassword')}
            />
          </div>
        </div>
        {fieldErrors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {fieldErrors.password.map((error) => (
              <li key={error} className="text-danger fs-6">- {error}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
      <div className="row">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="form-check _social_registration_form_check">
            <input
              className="form-check-input _social_registration_form_check_input"
              type="radio"
              name="accept"
              id="flexRadioDefault2"
              onChange={() => handleInputChange('accept')}
            />
            <label
              className="form-check-label _social_registration_form_check_label"
              htmlFor="flexRadioDefault2"
            >
              I agree to terms & conditions
            </label>
          </div>
          {fieldErrors?.accept && <p className="text-danger fs-6">{fieldErrors.accept}</p>}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_registration_form_btn _mar_t40 _mar_b60">
            <button
              type="submit"
              disabled={pending}
              className="_social_registration_form_btn_link _btn1"
            >
              {pending ? 'Creating account...' : 'Signup now'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

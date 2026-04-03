import SignUpForm from '@/app/components/SignUpForm'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className="_social_registration_wrap">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
						<div className="_social_registration_right">
							<div className="_social_registration_right_image">
								<img src="assets/images/registration.png" alt="Image" />
							</div>
							<div className="_social_registration_right_image_dark">
								<img src="assets/images/registration1.png" alt="Image" />
							</div>
						</div>
					</div>
					<div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
						<div className="_social_registration_content">
							<div className="_social_registration_right_logo _mar_b28">
								<img src="assets/images/logo.svg" alt="Image" className="_right_logo" />
							</div>
							<p className="_social_registration_content_para _mar_b8">Get Started Now</p>
							<h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
							<button type="button" className="_social_registration_content_btn _mar_b40">
								<img src="assets/images/google.svg" alt="Image" className="_google_img" /> <span>Register with google</span>
							</button>
							<div className="_social_registration_content_bottom_txt _mar_b40"> <span>Or</span>
							</div>
							<SignUpForm />
							<div className="row">
								<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
									<div className="_social_registration_bottom_txt">
										<p className="_social_registration_bottom_txt_para">Already have an account? <Link href="/login">Login</Link>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

export default page
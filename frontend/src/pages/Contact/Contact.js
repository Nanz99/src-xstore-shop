import React from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Meta from '../../components/Meta/Meta'
import './Contact.css'

function Contact() {
	return (
		<div>
			<Meta title="Liên Hệ"/>
			<Breadcrumb title="Liên Hệ"/>
			<div className="contactform__container">
         <div className="contactform__wrapper section-center">
            <div className="contact__form">
               <h3>SEND US MESSAGE</h3>
               <div className="contact__form__content">
                  <div>
                     <div>
                        <input
                           type="text"
                           name="Your Name"
                           placeholder="Your Name"
                           className="form-control w-full focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                        />
                     </div>
                     <div>
                        <input
                           type="text"
                           name="Your Email"
                           placeholder="Your Email"
                           className="form-control w-full focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                        />
                     </div>
                     <div>
                        <input
                           type="text"
                           name="Your Phone"
                           placeholder="Your Phone"
                           className="form-control w-full focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                        />
                     </div>
                  </div>
                  <div>
                     <textarea
                        name="message"
                        cols="40"
                        rows="7"
                        className="form-control w-full focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                        aria-required="true"
                        aria-invalid="false"
                        placeholder="Your Message"
                     ></textarea>
                  </div>
               </div>
               <button type="button" className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white">
                  SUBMIT FORM
               </button>
            </div>

            <div className="contact__info">
               <h3>CONTACT INFO</h3>
               <address>
                  <div><strong>Address: </strong>97 Trần Thái Tông, P.15, Tân Bình, Hồ Chí Minh</div>
                  <div>
                     <strong>Phone:</strong>037 519 74640{" "}
                  </div>
                  <div>
                     <strong>Facebook</strong>
                     <a
                        href="https://facebook.com/anhnhut.0101"
                        target="_blank"
                        rel="noreferrer"
                     >
                        anhnhut.0101
                     </a>
                  </div>
                  <div>
                     <strong>Email:</strong>
                     <a href="https://gmail.com">iamanhnhut.0101@gmail.com</a>
                  </div>
                  <div>
                     <strong>Web: </strong>
                     <a href="https://nguyenanhnhut-projects.netlify.app">
                        https://nguyenanhnhut-projects.netlify.app
                     </a>
                  </div>
                  <div>
                     <strong>Open</strong>Sunday – Friday 08:00 – 18:00
                  </div>
               </address>
            </div>
         </div>
      </div>
		</div>
	)
}

export default Contact

import React from 'react'
import Slider from 'react-slick'
import ava01 from '../../assets/images/ava-1.jpg'
import ava02 from '../../assets/images/ava-2.jpg'
import ava03 from '../../assets/images/ava-3.jpg'

const Testimonials = () => {
    const settings={
        dots:true,
        infinite:true,
        autoplay:true,
        speed:1000,
        swipeToSlide:true,
        autoplaySpeed:2000,
        slidesToShow:3,
        
        responsive:[
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },   
        ],
    }

  return(
    <Slider {...settings}>
        <div className='testimonial py-=4 px-3'>
            <p>“From the moment I booked until the end of my trip, everything was seamless. TravelWorld made planning stress-free and fun!”</p>

            <div className='d-flex align-items-center gap-4 mt-3'>
              <img src={ava01} className='w-25 h-25 rounded-2' alt="" />
              <div>
                <h6 className='mb-0 mt-3'>Shikhar</h6>
                <p>Customer</p>
              </div>  
            </div>   
        </div>
        <div className='testimonial py-=4 px-3'>
            <p>I discovered places I never would’ve found on my own. The guides were knowledgeable, and the experience felt truly authentic</p>

            <div className='d-flex align-items-center gap-4 mt-3'>
              <img src={ava02} className='w-25 h-25 rounded-2' alt="" />
              <div>
                <h6 className='mb-0 mt-3'>Ashish Gupta</h6>
                <p>Customer</p>
              </div>  
            </div>   
        </div>
        <div className='testimonial py-=4 px-3'>
            <p>“Personalized, well-organized, and full of surprises — every moment was unforgettable. Can’t wait for my next trip!”</p>

            <div className='d-flex align-items-center gap-4 mt-3'>
              <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
              <div>
                <h6 className='mb-0 mt-3'>Riya</h6>
                <p>Customer</p>
              </div>  
            </div>   
        </div>
        <div className='testimonial py-=4 px-3'>
            <p>I discovered places I never would’ve found on my own. The guides were knowledgeable, and the experience felt truly authentic</p>

            <div className='d-flex align-items-center gap-4 mt-3'>
              <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
              <div>
                <h6 className='mb-0 mt-3'>Atishay </h6>
                <p>Customer</p>
              </div>  
            </div>   
        </div>
        <div className='testimonial py-=4 px-3'>
            <p>“Personalized, well-organized, and full of surprises — every moment was unforgettable. Can’t wait for my next trip!”</p>

            <div className='d-flex align-items-center gap-4 mt-3'>
              <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
              <div>
                <h6 className='mb-0 mt-3'>Aditya</h6>
                <p>Customer</p>
              </div>  
            </div>   
        </div>
        <div className='testimonial py-=4 px-3'>
            <p>“From the moment I booked until the end of my trip, everything was seamless. TravelWorld made planning stress-free and fun!”</p>

            <div className='d-flex align-items-center gap-4 mt-3'>
              <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
              <div>
                <h6 className='mb-0 mt-3'>Abhishek</h6>
                <p>Customer</p>
              </div>  
            </div>   
        </div>
    </Slider>
  )
}

export default Testimonials

import Slider from "react-slick";
import './VideoList.css';
import Video from './Video';

const arrVideoYoutube = [
   { 
      title: 'Phối đồ cho nam',
      link: 'https://www.youtube.com/watch?v=ZkuVVlVZn0I',
   },
   { 
      title: 'Fashion News',
      link: 'https://www.youtube.com/watch?v=gTsb3UVv9fk',
   },
   { 
      title: 'Gucci Gang',
      link: 'https://www.youtube.com/watch?v=ong_VD2L_bY',
   },
   { 
      title: 'Bomber',
      link: 'https://www.youtube.com/watch?v=5UH0gaZzJzo',
   },
   { 
      title: 'Fashion News 1',
      link: 'https://www.youtube.com/watch?v=N1yvdab4C8g',
   },
   { 
      title: 'Fashion News 2',
      link: 'https://www.youtube.com/watch?v=vwRlKqDltlI',
   },
]


function VideoList() {

   var settings = {
      dots: true,
      infinite: true,
      padding: 10,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: 3,
               slidesToScroll: 3,
               infinite: true,
               dots: true
            }
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 2,
               initialSlide: 2
            }
         },
         {
            breakpoint: 480,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1
            }
         }
      ]
   };
   return (
      <>
       
      <div className="video__content">
         <Slider {...settings} className="video__list">
            {arrVideoYoutube.map((item, index) => {
               return <Video title={item.title} link={item.link} key={index} />
            })}
           
         </Slider>
      </div>
      </>
   )
}

export default VideoList
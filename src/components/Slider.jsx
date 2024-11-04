import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Container } from "react-bootstrap"
import SlideCard from "./SliderCard/SlideCard"
import { SliderData } from "../utils/products"
import {fetchBanner, URL} from "../components/handle_api"
import { useEffect, useState } from "react"

const SliderHome = () => {

  //fetch banner
  const [banner, setBanner] = useState([])
  useEffect(() => {
    fetchBanner()
    .then((res) => {
      setBanner(res)
    })
  },[])
  return (
      <section className='homeSlide'>
        <Container>
          <Slider >
          {banner.map((value, index) => {
            return (
              <SlideCard key={index} title={value.title} cover={`${URL}/images/${value.image}`} desc={value.description} />
            )
          })}
        </Slider>
        </Container>
      </section>
  )
}

export default SliderHome

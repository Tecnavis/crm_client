import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { URL, fetchCategory } from "../components/handle_api";

const Section = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategory().then((data) => {
            setCategories(data);
        });
    }, []);

    const handleClick = (name) => {
        navigate(`/category?category=${encodeURIComponent(name)}`);
    }

    return (
        <section style={{ background: "#f5f5f5" }}>
            <Container>
                <div className="heading">
                    <h1>All Categories</h1>
                </div>
                <Row className="justify-content-center">
                    {categories.map((item) => (
                        <Col key={item._id} md={3} sm={5} xs={10} className="product mtop">
                          
                            <img
                                loading="lazy"
                                src={`${URL}/images/${item.image}`}
                                alt={item.name}
                                onClick={() => handleClick(item.name)}
                            />
                            <div className="product-details">
                                <h3>{item.name}</h3>
                                <div className="rate">
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                </div>
                                <div className="price">
                                    <h4>Discover</h4>
                                    <button aria-label="Add" type="submit" className="add">
                                        <ion-icon name="add"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default Section;
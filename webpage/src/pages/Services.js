import React, {useState, useEffect} from "react";
import { SITE } from "../data/constants";

const Services = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await fetch(`https://${SITE}/api/services/`);
          const data = await response.json();
          setServices(data);
        } catch (error) {
          console.error("Failed to fetch services:", error);
        }
      };
  
      fetchServices();
    }, []);
    return (
        <div className="services-background">
        <div className="services-container">
          <h3 className="services-title">Our Services</h3>
          <div className="services-grid">
            {services.map((service, idx) => (
              <div className="services-grid-item" key={idx}>
                  <div className="services-card">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="services-image"
                    />
                    <h5 className="services-name">{service.name}</h5>
                    <p className="services-description">{service.description}</p>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Services;

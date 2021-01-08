import React, { useState, useEffect } from "react";
import CategoryDataService from "../services/category.service";
import CultivarDataService from "../services/cultivar.service";
import UserService from "../services/user.service";
import AddCultivar from "./AddCultivar";

const Offer = () => {
  const [categories, setCategories] = useState([]);
  const [cultivars, setCultivars] = useState([]);
  const [offers, setOffers] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    retrieveOffers();
    retrieveCultivars();
    retrieveCategories();
  }, []);

  const retrieveCategories = () => {
    CategoryDataService.getAll()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveCultivars = () => {
    CultivarDataService.getAll()
      .then((res) => {
        setCultivars(res.data);
        //console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveOffers = () => {
    UserService.getOffers()
      .then((res) => {
        setOffers(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = (e) => {
    const name = e.target.id;
    const id = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (name === "offerDescription") {
      setOffers({
        ...offers,
        [id]: { ...offers[id], offerDescription: value }
      });
    } else {
      setOffers({ ...offers, [id]: { ...offers[id], offer: value } });
    }
  };

  const updateOffer = () => {
    UserService.updateOffers(offers)
      .then((res) => {
        setMessage("Offer was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getCategoryName = (categoryId) => {
    for (let category of categories) {
      if (category.id == categoryId) {
        return category.name;
      }
    }
    return "";
  };

  const handleCultivarAdded = (cultivar) => {
    setCultivars([
      ...cultivars,
      { ...cultivar, category: getCategoryName(cultivar.categoryId) }
    ]);
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <h4>What I can offer...</h4>

        <form>
          {cultivars &&
            cultivars.map((cultivar) => (
              <React.Fragment key={cultivar.id}>
                <div className="form-group">
                  <label htmlFor={cultivar.id}>
                    <input
                      type="checkbox"
                      id={cultivar.id}
                      name={cultivar.id}
                      value={cultivar.id}
                      checked={
                        (offers[cultivar.id] && offers[cultivar.id].offer) ||
                        false
                      }
                      onChange={handleInputChange}
                    />
                    {cultivar.category + " - " + cultivar.name}
                  </label>
                </div>
                {offers[cultivar.id] && offers[cultivar.id].offer ? (
                  <div className="form-group">
                    <label htmlFor="offerDescription">
                      Description:
                      <textarea
                        className="form-control"
                        id="offerDescription"
                        name={cultivar.id}
                        rows="1"
                        onChange={handleInputChange}
                        value={
                          offers[cultivar.id] &&
                          offers[cultivar.id].offerDescription
                        }
                      />
                    </label>
                  </div>
                ) : (
                  ""
                )}
              </React.Fragment>
            ))}
        </form>
        <button type="submit" onClick={() => updateOffer()}>
          Update
        </button>
        <p>{message}</p>
        <AddCultivar onCultivarAdded={handleCultivarAdded} />
      </div>
    </div>
  );
};

export default Offer;

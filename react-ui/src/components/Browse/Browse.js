import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { HtmlTooltip } from '../../helpers/Tooltip_Helper';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import { mapBorough } from '../../helpers/NYC_Data_Massaging'
import { detectMobile } from '../../helpers/Window_Helper'
import { RestaurantSearchBar } from '../Search_Bars/Restaurant_Search_Bar';
import { AdBanner } from '../Banners/Ad_Banner';
import { Footer } from '../Footer/Footer';
import './Browse.css';

export const Browse = (props) => {    
    const [results, setResults] = useState([]);
    const [showMoreVal, setShowMoreVal] = useState(40);
    const isMobile = detectMobile();
    const [allRecordsShown, setAllRecordsShown] = useState(false);
    
    // nyc request requires capital names
    let {borough} = props.match.params;
    borough = mapBorough(borough);

    useEffect(() => {
        let nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=${showMoreVal}&$order=inspectedon DESC`;

        fetch(nycCompliantRestaurantApi).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            setResults(json);
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          })
      }, []);

    const handleRestaurant = (name) => {
      const newURL = window.location.origin + `/restaurant/${name}`;
      window.location.assign(newURL);
    }

    const handleShowMoreClick = () => {      
      let nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=${showMoreVal + 40}&$order=inspectedon DESC`;
      let lastPayloadSize = results.length;

      fetch(nycCompliantRestaurantApi).then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        if (json.length === lastPayloadSize) {
          setAllRecordsShown(true);
        } else {
          window.scrollTo(0, window.scrollY - 100);   
        }
        setShowMoreVal(showMoreVal + 40);
        setResults(json);
      }).catch(e => {
        throw new Error(`API call failed: ${e}`);
      })   

    }

    const handleShowAllClick = () => {      
      let nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=20000&$order=inspectedon DESC`;
      setAllRecordsShown(true);

      fetch(nycCompliantRestaurantApi).then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setShowMoreVal(json.length);
        setResults(json);
      }).catch(e => {
        throw new Error(`API call failed: ${e}`);
      })      
    }

    return (
      <Fragment>
        <AdBanner />
        <div className="Home">
          <header className="Home-header">
              <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                <h1> nyc restaurant info </h1>
              </Link>
              <h4>Location: {borough}</h4>
              { isMobile ?
                <HtmlTooltip
                title={
                  <Fragment>
                    <Typography>what are these results?</Typography><br />
                      these are all of the recent {mapBorough(borough)} inspections, sorted by inspection date in descending order. more info is available on desktop. <br /><br />
                    <Typography>how is outdoor dining status calculated?</Typography><br />
                    <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
                    <b>{"closed: "}</b>{"cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
                    <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
                  </Fragment>
                }>
                  <div className="subheader">click on a record below or search for a restaurant 
                    to find up-to-date inspection details** &nbsp;
                    <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                  </div>
              </HtmlTooltip>
                : <div className="subheader">click on a record below or search for a restaurant 
                to find up-to-date inspection details**</div>
              }
          </header>
          { isMobile ? 
            <div className="mobileResults">
              <table>
                <thead>
                  <tr>
                    <th><RestaurantSearchBar borough={borough} /></th>
                    <th>status </th>
                  </tr>
                </thead>
                <tbody>
                {results.map((result, index) => {
                  return (
                    <tr className="result" key={index} onClick={() => handleRestaurant(result.restaurantname)}>
                      <td>{index +1  + ". " + result.restaurantname}</td>
                      <td>{result.isroadwaycompliant === "Cease and Desist" ||
                              result.skippedreason === "No Seating"
                              ? <div className="closed">Closed</div>
                              : result.isroadwaycompliant === "Compliant"
                                  ? <div className="open">Open</div>
                                  : "Unknown"
                      }</td>
                  </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
            : <div className="results">
              <table>
                <thead>
                  <tr>
                    <th>
                      <RestaurantSearchBar borough={borough} />
                    </th>
                    <HtmlTooltip
                      title={
                        <Fragment>
                        <Typography>how is outdoor dining status calculated?</Typography><br />
                        <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
                        <b>{"closed: "}</b>{"closed: cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
                        <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
                        </Fragment>
                      }
                    >
                    <th>status  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
                    </HtmlTooltip>
                    <HtmlTooltip
                      title={ 
                          <Fragment>
                              <Typography>inspection date</Typography><br />
                              {"showing results for all nyc inspections, sorted by inspection date in descending order"}
                          </Fragment>
                      }>
                    <th>date  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
                    </HtmlTooltip>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography>inspection results</Typography><br />
                          <b>{"compliant: "}</b>{"outdoor seating options listed have passed an inspection"}<br /><br />
                          <b>{"non-compliant: "}</b>{"inspection failed, but restaurant may still be operating"}<br /><br />
                          <b>{"for hiqa review: "}</b>{"pending highway inspection and quality assurance review"}<br /><br />
                          <b>{"skipped inspection: "}</b>{"inspection could not be performed"}
                        </React.Fragment>
                      }
                    >
                    <th>compliancy  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
                    </HtmlTooltip>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography>outdoor seating options</Typography><br />
                          <b>{"sidewalk only: "}</b>{"outdoor seating available on sidewalk"}<br /><br />
                          <b>{"roadway only: "}</b>{"outdoor seating available on the street in a protective barrier"}<br /><br />
                          <b>{"sidwealk and roadway: "}</b>{"both options above are available"}<br /><br />
                          <b>{"no seating: "}</b>{"inspection was skipped due to lack of seating options"}
                        </React.Fragment>
                      }
                    >
                    <th>seating  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
                    </HtmlTooltip>
                  </tr>
                </thead>
                <tbody>
                {results.slice(0, showMoreVal).map((result, index) => {
                  return (
                    <tr className="result" key={index} onClick={() => handleRestaurant(result.restaurantname)}>
                      <td>{index +1  + ". " + result.restaurantname}</td>
                      <td>{result.isroadwaycompliant === "Cease and Desist" ||
                              result.skippedreason === "No Seating"
                              ? <div className="closed">Closed</div>
                              : result.isroadwaycompliant === "Compliant"
                                  ? <div className="open">Open</div>
                                  : "Unknown"
                      }</td>
                      <td>{result.inspectedon.slice(0,10)}</td>
                      <td>{result.isroadwaycompliant}</td>
                      <td>{result.skippedreason === "No Seating"
                            ? "no seating"
                            : result.seatingchoice === "both"
                              ? "sidewalk and roadway"
                              : result.seatingchoice === "sidewalk"
                                  ? "sidewalk only"
                                  : "roadway only"
                      }</td>
                  </tr>
                  );
                })}
                </tbody>
              </table>
          </div>
          }
          { allRecordsShown 
            ?
              <div className="button">
                showing all records...
              </div>
            :
              <div className="button">
                <Button variant="outlined" style={{textTransform: "lowercase"}} onClick={handleShowMoreClick}>
                  show more
                </Button> &nbsp;
                <Button variant="outlined" style={{textTransform: "lowercase"}} onClick={handleShowAllClick}>
                  show all
                </Button>
              </div> 
          }
         <Footer />
        </div>
      </Fragment>
    )
}

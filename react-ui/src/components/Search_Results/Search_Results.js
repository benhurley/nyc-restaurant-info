import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Card } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AdBanner } from '../Banners/Ad_Banner';
import { Link } from 'react-router-dom'
import { mapBorough, massageSearchResponse, encodeRestaurantName } from '../../helpers/NYC_Data_Massaging'
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import ThumbsUpDownOutlinedIcon from '@material-ui/icons/ThumbsUpDownOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@material-ui/icons/AirlineSeatReclineNormalOutlined';
import { Footer } from '../Footer/Footer';
import './Search_Results.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}
  
const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];
  
const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export const SearchResults = (props) => {
    let {restaurantname} = props.match.params;
    restaurantname = encodeRestaurantName(restaurantname);
    const [details, setDetails] = useState({});
    const classes = useStyles();

    const nycCompliantRestaurantApi = 'https://data.cityofnewyork.us/resource/4dx7-axux.json$limit=100000000000';

    useEffect(() => {
        fetch(nycCompliantRestaurantApi + `?restaurantname=${restaurantname}&$order=inspectedon DESC`).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            setDetails(massageSearchResponse(json[0]));
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          })
      }, []);

    return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Compliancy</TableCell>
            <TableCell align="right">Seating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


        // <Fragment>
        //     <AdBanner />
        //     <div className="Home">
        //         <header className="Home-header">
        //             <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
        //                 <h1> nyc restaurant info </h1>
        //             </Link>
        //             <h4 className="subTitle">search results</h4>
        //         </header>
        //     </div>
        //     <div className="resultsCard">
        //       <Grid
        //         container
        //         spacing={0}
        //         direction="column"
        //         alignItems="center"
        //         justify="center"
        //         >
        //           <Grid item md={12}>
        //             <Card>
        //                 <div className="lineItem">
        //                     <div className="title">
        //                         <RestaurantOutlinedIcon style={{fontSize: "large"}} /> &nbsp;
        //                         { details.restaurantname }
        //                     </div>
        //                 </div>
        //                 <div className="lineItem">
        //                     <div className="title">
        //                         <RoomOutlinedIcon style={{fontSize: "large"}} /> &nbsp;
        //                         { details.businessaddress }
        //                     </div>
        //                 </div>
        //                 <div className="lineItem">
        //                     <div className="title">
        //                         <ThumbsUpDownOutlinedIcon style={{fontSize: "large"}} /> &nbsp;
        //                         {details.isroadwaycompliant === "Cease and Desist" ||
        //                             details.skippedreason === "No Seating"
        //                             ? <div className="closed">closed</div>
        //                             : details.isroadwaycompliant === "Compliant"
        //                                 ? <div className="open">open</div>
        //                                 : "unknown"
        //                         }
        //                     </div>
        //                 </div>
        //                 <div className="lineItem">
        //                     <div className="title">
        //                         <AssignmentOutlinedIcon style={{fontSize: "large"}}/> &nbsp;
        //                         { details.isroadwaycompliant && details.inspectedon && details.skippedreason &&
        //                             details.isroadwaycompliant + " on " + details.inspectedon.slice(0,10) +
        //                             " due to " + details.skippedreason
        //                         }
        //                         { details.isroadwaycompliant && details.inspectedon && !details.skippedreason &&
        //                             details.isroadwaycompliant + " on " + details.inspectedon.slice(0,10)
        //                         }
        //                     </div>
        //                 </div>
        //                 <div className="lineItem">
        //                     <div className="title">{ details.seatingchoice && !details.skippedreason &&
        //                         <Fragment>
        //                             <AirlineSeatReclineNormalOutlinedIcon style={{fontSize: "large"}}/> &nbsp;
        //                             {details.seatingchoice && details.skippedreason !== "No Seating" &&
        //                                 details.seatingchoice === "both"
        //                                     ? "sidewalk and roadway"
        //                                     : details.seatingchoice === "sidewalk"
        //                                         ? "sidewalk only"
        //                                         : "roadway only"
        //                             }
        //                         </Fragment>
        //                         }
        //                     </div>
        //                 </div>
        //             </Card>  
        //           </Grid>
        //         </Grid>
        //         <Link to={`/location/${mapBorough(details.borough)}`} style={{ textDecoration: 'none'}} >
        //             <div className="button">
        //                 <Button variant="outlined" style={{textTransform: "lowercase"}}>
        //                     back
        //                 </Button>
        //             </div>
        //         </Link>
        //     </div>
        //   <Footer />
        // </Fragment>
    )
}

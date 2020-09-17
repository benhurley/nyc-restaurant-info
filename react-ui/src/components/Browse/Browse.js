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
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import './Browse.css';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten } from '@material-ui/core/styles';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: '10px'
  }
}))(TableRow);

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'restaurantname', numeric: false, disablePadding: false, label: 'name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'status' },
  { id: 'inspectedon', numeric: true, disablePadding: false, label: 'date' },
  { id: 'isroadwaycompliant', numeric: false, disablePadding: false, label: 'compliancy' },
  { id: 'seatingchoice', numeric: false, disablePadding: false, label: 'seating' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export const Browse = (props) => {    
    const [results, setResults] = useState([]);
    const isMobile = detectMobile();

    // enhanced table
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('status');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    // nyc request requires capital names
    let {borough} = props.match.params;
    borough = mapBorough(borough);

    useEffect(() => {
        let nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=20000&$order=inspectedon DESC`;

        fetch(nycCompliantRestaurantApi).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            console.log(json);
            setResults(json);
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          })
      }, []);

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleChangeDense = (event) => {
      setDense(event.target.checked);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, results.length - page * rowsPerPage);

    const handleRestaurant = (name) => {
      const newURL = window.location.origin + `/restaurant/${name}`;
      window.location.assign(newURL);
    }
    
    return (
      <div className={classes.root}>
        <AdBanner />
        <div className="Home Browse">
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
        </div>
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              size={dense ? 'small' : 'medium'}
              aria-label="restaurantInspectionTable"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={results.length}
              />
              <TableBody>
              {stableSort(results, getComparator(order, orderBy))                
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((result) => (
                <StyledTableRow key={result.restaurantinspectionid} onClick={() => handleRestaurant(result.restaurantname)}>
                  <StyledTableCell component="th" scope="row">{result.restaurantname}
                  </StyledTableCell>
                  <StyledTableCell align="left">{result.isroadwaycompliant === "Cease and Desist" ||
                              result.skippedreason === "No Seating"
                              ? <div className="closed">Closed</div>
                              : result.isroadwaycompliant === "Compliant"
                                  ? <div className="open">Open</div>
                                  : "Need More Info"
                  }</StyledTableCell>
                  <StyledTableCell align="left">{result.inspectedon.slice(0,10)}</StyledTableCell>
                  <StyledTableCell align="left">{result.isroadwaycompliant}</StyledTableCell>
                  <StyledTableCell align="left">{result.skippedreason === "No Seating"
                            ? "no seating"
                            : result.seatingchoice === "both"
                              ? "sidewalk and roadway"
                              : result.seatingchoice === "sidewalk"
                                  ? "sidewalk only"
                                  : "roadway only"}</StyledTableCell>
                </StyledTableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50, 100]}
            component="div"
            count={results.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
        <Footer />
      </div>
    );


    // new old
    // return (
    // <Fragment>
    //   <AdBanner />
    //   <div className="Home Browse">
    //     <header className="Home-header">
    //         <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
    //           <h1> nyc restaurant info </h1>
    //         </Link>
    //         <h4>Location: {borough}</h4>
    //         { isMobile ?
    //           <HtmlTooltip
    //           title={
    //             <Fragment>
    //               <Typography>what are these results?</Typography><br />
    //                 these are all of the recent {mapBorough(borough)} inspections, sorted by inspection date in descending order. more info is available on desktop. <br /><br />
    //               <Typography>how is outdoor dining status calculated?</Typography><br />
    //               <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
    //               <b>{"closed: "}</b>{"cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
    //               <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
    //             </Fragment>
    //           }>
    //             <div className="subheader">click on a record below or search for a restaurant 
    //               to find up-to-date inspection details** &nbsp;
    //               <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
    //             </div>
    //         </HtmlTooltip>
    //           : <div className="subheader">click on a record below or search for a restaurant 
    //           to find up-to-date inspection details**</div>
    //         }
    //     </header>
    //     <TableContainer className={classes.container} component={Paper}>
    //       <Table stickyHeader size={'medium'} className={classes.table} aria-label="sticky table">
    //         <TableHead>
    //           <StyledTableRow>
    //             <StyledTableCell><RestaurantSearchBar borough={borough} /></StyledTableCell>
    //             <StyledTableCell align="left"><b>Status</b> <HelpIcon alt={"tooltip question mark"} style={{ fontSize: 14 }}/></StyledTableCell>
    //             <StyledTableCell align="left"><b>Date</b> <HelpIcon alt={"tooltip question mark"} style={{ fontSize: 14 }}/></StyledTableCell>
    //             <StyledTableCell align="left"><b>Compliancy</b> <HelpIcon alt={"tooltip question mark"} style={{ fontSize: 14 }}/></StyledTableCell>
    //             <StyledTableCell align="left"><b>Seating</b> <HelpIcon alt={"tooltip question mark"} style={{ fontSize: 14 }}/></StyledTableCell>
    //           </StyledTableRow>
    //         </TableHead>
    //         <TableBody>
    //           {results.map((result) => (
    //             <StyledTableRow key={result.restaurantinspectionid}>
    //               <StyledTableCell component="th" scope="row">{result.restaurantname}
    //               </StyledTableCell>
    //               <StyledTableCell align="left">{result.isroadwaycompliant === "Cease and Desist" ||
    //                           result.skippedreason === "No Seating"
    //                           ? <div className="closed">Closed</div>
    //                           : result.isroadwaycompliant === "Compliant"
    //                               ? <div className="open">Open</div>
    //                               : "Unknown"
    //               }</StyledTableCell>
    //               <StyledTableCell align="left">{result.inspectedon.slice(0,10)}</StyledTableCell>
    //               <StyledTableCell align="left">{result.isroadwaycompliant}</StyledTableCell>
    //               <StyledTableCell align="left">{result.seatingchoice}</StyledTableCell>
    //             </StyledTableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //     <TablePagination
    //       rowsPerPageOptions={[15, 40, 100]}
    //       component="div"
    //       count={results.length}
    //       rowsPerPage={rowsPerPage}
    //       page={page}
    //       onChangePage={handleChangePage}
    //       onChangeRowsPerPage={handleChangeRowsPerPage}
    //     />
    //   </div>
    //   <Footer />
    // </Fragment>
    // )



    //old old
      // <Fragment>
      //   <AdBanner />
      //   <div className="Home">
      //     <header className="Home-header">
      //         <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
      //           <h1> nyc restaurant info </h1>
      //         </Link>
      //         <h4>Location: {borough}</h4>
      //         { isMobile ?
      //           <HtmlTooltip
      //           title={
      //             <Fragment>
      //               <Typography>what are these results?</Typography><br />
      //                 these are all of the recent {mapBorough(borough)} inspections, sorted by inspection date in descending order. more info is available on desktop. <br /><br />
      //               <Typography>how is outdoor dining status calculated?</Typography><br />
      //               <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
      //               <b>{"closed: "}</b>{"cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
      //               <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
      //             </Fragment>
      //           }>
      //             <div className="subheader">click on a record below or search for a restaurant 
      //               to find up-to-date inspection details** &nbsp;
      //               <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
      //             </div>
      //         </HtmlTooltip>
      //           : <div className="subheader">click on a record below or search for a restaurant 
      //           to find up-to-date inspection details**</div>
      //         }
      //     </header>
      //     { isMobile ? 
      //       <div className="mobileResults">
      //         <table>
      //           <thead>
      //             <tr>
      //               <th><RestaurantSearchBar borough={borough} /></th>
      //               <th>status </th>
      //             </tr>
      //           </thead>
      //           <tbody>
      //           {results.map((result, index) => {
      //             return (
      //               <tr className="result" key={index} onClick={() => handleRestaurant(result.restaurantname)}>
      //                 <td>{index +1  + ". " + result.restaurantname}</td>
      //                 <td>{result.isroadwaycompliant === "Cease and Desist" ||
      //                         result.skippedreason === "No Seating"
      //                         ? <div className="closed">Closed</div>
      //                         : result.isroadwaycompliant === "Compliant"
      //                             ? <div className="open">Open</div>
      //                             : "Unknown"
      //                 }</td>
      //             </tr>
      //             );
      //           })}
      //           </tbody>
      //         </table>
      //       </div>
      //       : <div className="results">
      //         <table>
      //           <thead>
      //             <tr>
      //               <th>
      //                 <RestaurantSearchBar borough={borough} />
      //               </th>
      //               <HtmlTooltip
      //                 title={
      //                   <Fragment>
      //                   <Typography>how is outdoor dining status calculated?</Typography><br />
      //                   <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
      //                   <b>{"closed: "}</b>{"closed: cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
      //                   <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
      //                   </Fragment>
      //                 }
      //               >
      //               <th>status  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
      //               </HtmlTooltip>
      //               <HtmlTooltip
      //                 title={ 
      //                     <Fragment>
      //                         <Typography>inspection date</Typography><br />
      //                         {"showing results for all nyc inspections, sorted by inspection date in descending order"}
      //                     </Fragment>
      //                 }>
      //               <th>date  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
      //               </HtmlTooltip>
      //               <HtmlTooltip
      //                 title={
      //                   <React.Fragment>
      //                     <Typography>inspection results</Typography><br />
      //                     <b>{"compliant: "}</b>{"outdoor seating options listed have passed an inspection"}<br /><br />
      //                     <b>{"non-compliant: "}</b>{"inspection failed, but restaurant may still be operating"}<br /><br />
      //                     <b>{"for hiqa review: "}</b>{"pending highway inspection and quality assurance review"}<br /><br />
      //                     <b>{"skipped inspection: "}</b>{"inspection could not be performed"}
      //                   </React.Fragment>
      //                 }
      //               >
      //               <th>compliancy  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
      //               </HtmlTooltip>
      //               <HtmlTooltip
      //                 title={
      //                   <React.Fragment>
      //                     <Typography>outdoor seating options</Typography><br />
      //                     <b>{"sidewalk only: "}</b>{"outdoor seating available on sidewalk"}<br /><br />
      //                     <b>{"roadway only: "}</b>{"outdoor seating available on the street in a protective barrier"}<br /><br />
      //                     <b>{"sidwealk and roadway: "}</b>{"both options above are available"}<br /><br />
      //                     <b>{"no seating: "}</b>{"inspection was skipped due to lack of seating options"}
      //                   </React.Fragment>
      //                 }
      //               >
      //               <th>seating  <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></th>
      //               </HtmlTooltip>
      //             </tr>
      //           </thead>
      //           <tbody>
      //           {results.slice(0, showMoreVal).map((result, index) => {
      //             return (
      //                 <tr className="result" key={index} onClick={() => handleRestaurant(result.restaurantname)}>
      //                 <td>{index +1  + ". " + result.restaurantname}</td>
      //                 <td>{result.isroadwaycompliant === "Cease and Desist" ||
      //                         result.skippedreason === "No Seating"
      //                         ? <div className="closed">Closed</div>
      //                         : result.isroadwaycompliant === "Compliant"
      //                             ? <div className="open">Open</div>
      //                             : "Unknown"
      //                 }</td>
      //                 <td>{result.inspectedon.slice(0,10)}</td>
      //                 <td>{result.isroadwaycompliant}</td>
      //                 <td>{result.skippedreason === "No Seating"
      //                       ? "no seating"
      //                       : result.seatingchoice === "both"
      //                         ? "sidewalk and roadway"
      //                         : result.seatingchoice === "sidewalk"
      //                             ? "sidewalk only"
      //                             : "roadway only"
      //                 }</td>
      //             </tr>
      //             );
      //           })}
      //           </tbody>
      //         </table>
      //     </div>
      //     }
      //     { allRecordsShown 
      //       ?
      //         <div className="button">
      //           showing all records...
      //         </div>
      //       :
      //         <div className="button">
      //           <Button variant="outlined" style={{textTransform: "lowercase"}} onClick={handleShowMoreClick}>
      //             show more
      //           </Button> &nbsp;
      //           <Button variant="outlined" style={{textTransform: "lowercase"}} onClick={handleShowAllClick}>
      //             show all
      //           </Button>
      //         </div> 
      //     }
      //   </div>
      //   <Footer />
      // </Fragment>
    // );
}

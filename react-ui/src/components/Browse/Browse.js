import React, { useState, useEffect, Fragment, createRef, Suspense, lazy } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Multiselect } from 'multiselect-react-dropdown';
import { mapBorough } from '../../helpers/NYC_Data_Massaging'
import { detectMobile } from '../../helpers/Window_Helper'
import { AdBanner } from '../Banners/Ad_Banner';
import { getZipCodes } from '../../helpers/NYC_Post_Codes';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './Browse.css';

//lazy-loaded components
const RestaurantSearchBar = lazy(() => import('../Search_Bars/Restaurant_Search_Bar').then(module => ({ default: module.RestaurantSearchBar })));
const Table = lazy(() => import('@material-ui/core/Table'));
const TableBody = lazy(() => import('@material-ui/core/TableBody'));
const TableCell = lazy(() => import('@material-ui/core/TableCell'));
const TableContainer = lazy(() => import('@material-ui/core/TableContainer'));
const TableHead = lazy(() => import('@material-ui/core/TableHead'));
const TableRow = lazy(() => import('@material-ui/core/TableRow'));
const Paper = lazy(() => import('@material-ui/core/Paper'));
const Button = lazy(() => import('@material-ui/core/Button'));
const HtmlTooltip = lazy(() => import('../../helpers/Tooltip_Helper').then(module => ({ default: module.HtmlTooltip })));

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
  { id: 'restaurantname', numeric: false, disablePadding: false, label: 'restaurant' },
  { id: 'time_of_submission', numeric: true, disablePadding: false, label: 'inspected on' },
  { id: 'seating_interest_sidewalk', numeric: false, disablePadding: false, label: 'applied for' },
  { id: 'decision', numeric: false, disablePadding: false, label: 'status' },
  { id: 'zip', numeric: true, disablePadding: false, label: 'zip' },
];

const mobileHeadCells = [
  { id: 'restaurantname', numeric: false, disablePadding: false, label: 'name' },
  { id: 'seating_interest_sidewalk', numeric: false, disablePadding: false, label: 'request' },
  { id: 'decision', numeric: false, disablePadding: false, label: 'status' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isMobile } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headerCells = isMobile ? mobileHeadCells : headCells

  return (
    <Suspense>
      <TableHead className="header">
        <TableRow>
          {headerCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {!isMobile &&
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
              }
              {isMobile &&
                <div className="mobileTableHeader">
                  {headCell.label}
                </div>
              }
            &nbsp;
              {headCell.id === 'seating_interest_sidewalk' &&
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>outdoor seating applications</Typography><br />
                      <b>{"sidewalk only: "}</b>{"applied for outdoor seating on sidewalk"}<br /><br />
                      <b>{"street only: "}</b>{"applied for outdoor seating on street"}<br /><br />
                      <b>{"sidewalk and street: "}</b>{"applied for both options above"}<br /><br />
                    </Fragment>
                  }>
                  <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                </HtmlTooltip>}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </Suspense>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
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
  desktopTable: {
    minWidth: 750,
  },
  mobileTable: {
    mobileTable: 150,
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

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

export const Browse = (props) => {
  const [results, setResults] = useState([{
    "borough": "",
    "restaurantname": "loading...",
    "seating_interest_sidewalk": "",
    "legalbusinessname": "",
    "businessaddress": "",
    "restaurantinspectionid": "",
    "isroadwaycompliant": "",
    "time_of_submission": "",
},]);
  const [fullResults, setFullResults] = useState([]);
  const isMobile = detectMobile();

  // enhanced material-ui table
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('time_of_submission');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const tableRef = createRef();

  // nyc request requires capital names
  let { borough } = props.match.params;
  borough = borough[0].toUpperCase() + borough.slice(1)
  const zipCodes = getZipCodes(borough);

  useEffect(() => {
    let nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/pitm-atqc.json?borough=${borough}&$limit=20000&$order=time_of_submission%20DESC`;

    fetch(nycCompliantRestaurantApi).then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        setResults(json);
        setFullResults(json);
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
    tableRef.current.scrollTop = 0;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRestaurant = (name) => {
    const newURL = window.location.origin + `/restaurant/${name}`;
    window.location.assign(newURL);
  }

  const handleZipFilterSelect = (selectedList, selectedItem) => {
    setResults(results.filter((result) => result['zip'] === selectedItem['zipcode']));
  }

  const handleZipFilterRemove = (selectedList, removedItem) => {
    setResults(fullResults);
  }

  return (
    <Fragment>
      <div className={classes.root}>
        <AdBanner />
        <div className="Home browse">
          <header className="Home-header">
            <Link to={'/'} style={{ textDecoration: 'none' }} >
              <div className="backArrow">
                <ArrowBackIcon />
              </div>
            </Link>
            <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
              <h1> 
                nyc restaurant info
                    <img alt="working trademark" className="tm" src={require("../../helpers/tm.png")} />
                </h1>                </Link>
            <h2>{borough}</h2>
            <Suspense fallback={<Loader
              type="ThreeDots"
              color="#d3d3d3"
              height={100}
              width={100} 
            />}>
              <Fragment>
                <div className="desktopSearch">
                  <RestaurantSearchBar borough={borough} />
                </div>
                <div className="subheader"> browse recent restaurant inspections below &nbsp;
                  <HtmlTooltip
                    title={
                      <Fragment>
                        <Typography>how do i use this table?</Typography><br />
                            below you will find all of the most-recent {mapBorough(borough)} restaurant inspections <br /><br />
                            clicking on a line item below will pull up the detail page for that restaurant,
                            where you can find the health code status full inspection history <br /><br />
                      </Fragment>
                    }>
                      <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                  </HtmlTooltip>
                </div>
              </Fragment>
            </Suspense>
          </header>
          <Suspense fallback={<Loader
            type="ThreeDots"
            color="#d3d3d3"
            height={100}
            width={100} 
          />}>
            {isMobile
              ?
              <Fragment>
                <div className="filterBarMobile">
                  <div className="zipCodeFilterMobile">
                    <Multiselect
                      id={"zip_mobile"}
                      options={zipCodes} // Options to display in the dropdown
                      onSelect={handleZipFilterSelect} // Function will trigger on select event
                      onRemove={handleZipFilterRemove} // Function will trigger on remove event
                      displayValue="zipcode" // Property name to display in the dropdown options
                      placeholder="filter on zip"
                      selectionLimit={1}
                      style={{
                        searchBox: { // To change search box element look
                          minHeight: 30,
                        }}}
                    />
                  </div>
                </div>
                <div className="mobileTable">
                  <Paper className="container">
                    <TableContainer>
                      <Table
                        className={classes.mobileTable}
                        size={'medium'}
                        aria-label="restaurantInspectionTable"
                      >
                        <EnhancedTableHead
                          classes={classes}
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          rowCount={results.length}
                          isMobile={true}
                        />
                      </Table>
                    </TableContainer>
                    <div style={{ overflowY: 'scroll', height: '300px' }} ref={tableRef}>
                      <TableContainer>
                        <Table style={{ tableLayout: 'fixed' }}>
                          <TableBody>
                            {stableSort(results, getComparator(order, orderBy))
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((result) => (
                                <StyledTableRow key={result.restaurantinspectionid} onClick={() => handleRestaurant(result.restaurant_name)}>
                                  <StyledTableCell component="th" scope="row">{result.restaurant_name}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">{result.seating_interest_sidewalk === "both"
                                    ? "sidewalk and street"
                                    : result.seating_interest_sidewalk === "sidewalk"
                                      ? "sidewalk only"
                                      : result.restaurantname === "loading..."
                                        ? null
                                        : "street only"}
                                </StyledTableCell>
                                  <StyledTableCell align="left">{result.seating_interest_sidewalk === "both"
                                  ? (result.approved_for_sidewalk_seating === 'yes' && result.approved_for_roadway_seating === 'yes')
                                    ? "approved" : "declined"
                                  : result.seating_interest_sidewalk === "sidewalk"
                                    ? result.approved_for_sidewalk_seating === 'yes' ? "approved" : "declined"
                                    : result.approved_for_roadway_seating === 'yes' ? "approved" : "declined"
                                  }</StyledTableCell>
                                </StyledTableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    <TablePagination
                      rowsPerPageOptions={[]}
                      component="div"
                      count={results.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </Paper>
                </div>
              </Fragment>
              :<Fragment>
                <div className="filterBar">
                  <div className="zipCodeFilter">
                    <Multiselect
                      id={"zip"}
                      options={zipCodes} // Options to display in the dropdown
                      onSelect={handleZipFilterSelect} // Function will trigger on select event
                      onRemove={handleZipFilterRemove} // Function will trigger on remove event
                      displayValue="zipcode" // Property name to display in the dropdown options
                      placeholder="filter on zip"
                      selectionLimit={1}
                      style={{
                        searchBox: { // To change search box element look
                          minHeight: 30,
                        }}}
                    />
                  </div>
                </div>
              <div className="desktopTable">
                <Paper className={classes.paper}>
                  <TableContainer>
                    <Table
                      className={classes.desktopTable}
                      size={'medium'}
                      aria-label="restaurantInspectionTable"
                    >
                      <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={results.length}
                        isMobile={false}
                      />
                    </Table>
                  </TableContainer>
                  <div style={{ overflowY: 'scroll', height: '300px' }} ref={tableRef}>
                    <TableContainer>
                      <Table style={{ tableLayout: 'fixed' }}>
                        <TableBody>
                          {stableSort(results, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((result) => (
                              <StyledTableRow key={result.restaurantinspectionid} onClick={() => handleRestaurant(result.restaurant_name)}>
                                <StyledTableCell component="th" scope="row">{result.restaurant_name}
                                </StyledTableCell>
                                <StyledTableCell align="left">{result.time_of_submission.slice(0, 10)}</StyledTableCell>
                                <StyledTableCell align="left">{result.seating_interest_sidewalk === "both"
                                    ? "sidewalk and street"
                                    : result.seating_interest_sidewalk === "sidewalk"
                                      ? "sidewalk only"
                                      : result.restaurantname === "loading..."
                                        ? null
                                        : "street only"}
                                </StyledTableCell>
                                <StyledTableCell align="left">{result.seating_interest_sidewalk === "both"
                                  ? (result.approved_for_sidewalk_seating === 'yes' && result.approved_for_roadway_seating === 'yes')
                                    ? "approved" : "declined"
                                  : result.seating_interest_sidewalk === "sidewalk"
                                    ? result.approved_for_sidewalk_seating === 'yes' ? "approved" : "declined"
                                    : result.approved_for_roadway_seating === 'yes' ? "approved" : "declined"
                                  }</StyledTableCell>
                                <StyledTableCell align="left">{result.zip}</StyledTableCell>
                              </StyledTableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={results.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </Paper>
              </div>
              </Fragment>
            }
            <Link to={'/'} style={{ textDecoration: 'none' }} >
              <div className="button">
                <Button variant="outlined" style={{ textTransform: "lowercase" }}>
                  back
                </Button>
              </div>
            </Link>
          </Suspense>
        </div>
      </div>
    </Fragment>
  );
}

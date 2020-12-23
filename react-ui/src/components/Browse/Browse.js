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

import { mapBorough } from '../../helpers/NYC_Data_Massaging'
import { detectMobile } from '../../helpers/Window_Helper'
import { AdBanner } from '../Banners/Ad_Banner';
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
  { id: 'restaurantname', numeric: false, disablePadding: false, label: 'name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'dining status' },
  { id: 'inspectedon', numeric: true, disablePadding: false, label: 'date' },
  { id: 'isroadwaycompliant', numeric: false, disablePadding: false, label: 'compliancy' },
  { id: 'seatingchoice', numeric: false, disablePadding: false, label: 'seating' },
];

const mobileHeadCells = [
  { id: 'restaurantname', numeric: false, disablePadding: false, label: 'name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'dining status' },
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
              {!isMobile && headCell.id !== 'status' &&
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
              {!isMobile && headCell.id === 'status' &&
                <div className="mobileTableHeader">
                  {headCell.label}
                </div>
              }
            &nbsp;
              {headCell.id === 'status' &&
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>how is outdoor dining status calculated?</Typography><br />
                      <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
                      <b>{"closed: "}</b>{"cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
                      <b>{"pending: "}</b>{"awaiting roadway compliance check, usually still operating"}<br /><br />
                      <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
                    </Fragment>
                  }>
                  <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                </HtmlTooltip>}
              {headCell.id === 'inspectedon' &&
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>inspection date</Typography><br />
                      {"showing results for all nyc inspections, sorted by inspection date in descending order"}
                    </Fragment>
                  }>
                  <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                </HtmlTooltip>}
              {headCell.id === 'isroadwaycompliant' &&
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>inspection results</Typography><br />
                      <b>{"compliant: "}</b>{"outdoor seating options listed have passed an inspection"}<br /><br />
                      <b>{"non-compliant: "}</b>{"inspection failed, but restaurant may still be operating"}<br /><br />
                      <b>{"for hiqa review: "}</b>{"pending highway inspection and quality assurance review"}<br /><br />
                      <b>{"skipped inspection: "}</b>{"inspection could not be performed"}
                    </Fragment>
                  }>
                  <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                </HtmlTooltip>}
              {headCell.id === 'seatingchoice' &&
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>outdoor seating options</Typography><br />
                      <b>{"sidewalk only: "}</b>{"outdoor seating available on sidewalk"}<br /><br />
                      <b>{"roadway only: "}</b>{"outdoor seating available on the street in a protective barrier"}<br /><br />
                      <b>{"sidwealk and roadway: "}</b>{"both options above are available"}<br /><br />
                      <b>{"no seating: "}</b>{"inspection was skipped due to lack of seating options"}
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
  const [results, setResults] = useState([]);
  const isMobile = detectMobile();

  // enhanced material-ui table
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('inspectedon');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const tableRef = createRef();

  // nyc request requires capital names
  let { borough } = props.match.params;
  borough = mapBorough(borough);

  useEffect(() => {
    let nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}$limit=20000&$where=inspectedon between '2020-07-08T00:00:00' and '2020-12-21T23:59:59'&$order=inspectedon DESC`

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
              <h1> nyc restaurant info™ </h1>
            </Link>
            <h4>Location: {borough}</h4>
            <Suspense fallback={<div></div>}>
              <Fragment>
                <div className="desktopSearch">
                  <RestaurantSearchBar borough={borough} />
                </div>
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>what are the records below?</Typography><br />
                          all recent {mapBorough(borough)} inspections, sorted by inspection date in descending order<br /><br />
                          more infomation and sorting options are available on destop <br /><br />
                    </Fragment>
                  }>
                  <div className="subheader"> browse recent restaurant updates &nbsp;
                      <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                  </div>
                </HtmlTooltip>
              </Fragment>
            </Suspense>
          </header>
          <Suspense fallback={<div></div>}>
            {isMobile
              ?
              <Fragment>
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
                                <StyledTableRow key={result.restaurantinspectionid} onClick={() => handleRestaurant(result.restaurantname)}>
                                  <StyledTableCell component="th" scope="row">{result.restaurantname}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">{result.isroadwaycompliant === "Cease and Desist" ||
                                    result.skippedreason === "No Seating"
                                    ? <div className="closed">closed</div>
                                    : result.isroadwaycompliant === "Compliant"
                                      ? <div className="open">open</div>
                                      : result.isroadwaycompliant &&
                                        result.isroadwaycompliant === "For HIQA Review"
                                        ? <div className="pending">pending</div>
                                        : <div className="unknown">unknown</div>
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
              :
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
                              <StyledTableRow key={result.restaurantinspectionid} onClick={() => handleRestaurant(result.restaurantname)}>
                                <StyledTableCell component="th" scope="row">{result.restaurantname}
                                </StyledTableCell>
                                <StyledTableCell align="left">{result.isroadwaycompliant === "Cease and Desist" ||
                                  result.skippedreason === "No Seating"
                                  ? <div className="closed">closed</div>
                                  : result.isroadwaycompliant === "Compliant"
                                    ? <div className="open">open</div>
                                    : result.isroadwaycompliant &&
                                    result.isroadwaycompliant === "For HIQA Review"
                                    ? <div className="pending">pending</div>
                                    : <div className="unknown">unknown</div>
                                }</StyledTableCell>
                                <StyledTableCell align="left">{result.inspectedon.slice(0, 10)}</StyledTableCell>
                                <StyledTableCell align="left">{result.isroadwaycompliant}</StyledTableCell>
                                <StyledTableCell align="left">{result.skippedreason === "No Seating"
                                  ? "no seating"
                                  : result.seatingchoice === "both"
                                    ? "sidewalk and roadway"
                                    : result.seatingchoice === "sidewalk"
                                      ? "sidewalk only"
                                      : "roadway only"}
                                </StyledTableCell>
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

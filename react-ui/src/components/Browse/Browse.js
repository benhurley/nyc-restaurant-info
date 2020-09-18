import React, { useState, useEffect, Fragment } from 'react';
import { HtmlTooltip } from '../../helpers/Tooltip_Helper';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import { mapBorough } from '../../helpers/NYC_Data_Massaging'
import { detectMobile } from '../../helpers/Window_Helper'
import { RestaurantSearchBar } from '../Search_Bars/Restaurant_Search_Bar';
import { AdBanner } from '../Banners/Ad_Banner';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Browse.css';

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

const mobileHeadCells = [
  { id: 'restaurantname', numeric: false, disablePadding: false, label: 'name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'status' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isMobile } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headerCells = isMobile ? mobileHeadCells : headCells

  return (
    <TableHead className="header">
      <TableRow>
        {headerCells.map((headCell) => (
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
            </TableSortLabel> &nbsp;
            {headCell.id === 'status' &&
              <HtmlTooltip
              title={
                <Fragment>
                <Typography>how is outdoor dining status calculated?</Typography><br />
                <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
                <b>{"closed: "}</b>{"closed: cease and desist issued or a skipped inspection due to no seating available"}<br /><br />
                <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
                </Fragment>
              }>
            <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
            </HtmlTooltip> }
            {headCell.id === 'inspectedon' &&
              <HtmlTooltip
              title={
                <Fragment>
                  <Typography>inspection date</Typography><br />
                  {"showing results for all nyc inspections, sorted by inspection date in descending order"}
                </Fragment>
              }>
            <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
            </HtmlTooltip> }
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
            <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
            </HtmlTooltip> }
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
            <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
            </HtmlTooltip> }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
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

    const handleRestaurant = (name) => {
      const newURL = window.location.origin + `/restaurant/${name}`;
      window.location.assign(newURL);
    }
    
    return (
      <div className={classes.root}>
        <AdBanner />
        <div className="Home browse">
          <header className="Home-header">
            <Link to={'/'} style={{ textDecoration: 'none'}} >
              <div class="backArrow">
                  <ArrowBackIcon />
              </div>
            </Link>
           <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
             <h1> nyc restaurant info </h1>
           </Link>
           <h4>Location: {borough}</h4>
           { isMobile ?
              <Fragment>
                <div className="desktopSearch">
                  <RestaurantSearchBar borough={borough} />
                </div>
                <HtmlTooltip
                  title={
                    <Fragment>
                      <Typography>what are the records below?</Typography><br />
                        all recent {mapBorough(borough)} inspections, sorted by inspection date in descending order.<br /><br />
                        more infomation and sorting options are available on desktop. <br /><br />
                    </Fragment> 
                  }>
                  <div className="subheader"> search above for a restaurant or click on a record below to get up-to-date outdoor dining info** &nbsp;
                    <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                  </div>
              </HtmlTooltip>
            </Fragment>
              : 
              <Fragment>
                <div className="desktopSearch">
                  <RestaurantSearchBar borough={borough} />
                </div>
                <div className="subheader">
                  search above for a restaurant or click on a record below to get up-to-date outdoor dining info**
                </div>
              </Fragment>
            }
          </header>
          {isMobile 
            ?
            <Fragment>
              <div className="mobileTable">
              <Paper className="container">
                <TableContainer>
                  <Table 
                    className={classes.mobileTable}
                    size={dense ? 'small' : 'medium'}
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
                      </StyledTableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                  size={dense ? 'small' : 'medium'}
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
                                      : "roadway only"}
                      </StyledTableCell>
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
                ActionsComponent={TablePaginationActions}
              />
            </Paper>
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
          </div>
          }
        </div>
      </div>
    );
}

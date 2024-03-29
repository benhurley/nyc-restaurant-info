import React, { createRef, useState, useEffect, Fragment, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import AirlineSeatReclineNormalOutlinedIcon from '@material-ui/icons/AirlineSeatReclineNormalOutlined';
import ThumbsUpDownOutlinedIcon from '@material-ui/icons/ThumbsUpDownOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

import { mapBorough } from '../../helpers/NYC_Data_Massaging';
import { detectMobile } from '../../helpers/Window_Helper';

import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './Restaurant_Detail.css';

//lazy-loaded components
const Table = lazy(() => import('@material-ui/core/Table'));
const TableBody = lazy(() => import('@material-ui/core/TableBody'));
const TableCell = lazy(() => import('@material-ui/core/TableCell'));
const TableContainer = lazy(() => import('@material-ui/core/TableContainer'));
const TableHead = lazy(() => import('@material-ui/core/TableHead'));
const TableRow = lazy(() => import('@material-ui/core/TableRow'));
const Paper = lazy(() => import('@material-ui/core/Paper'));
const HtmlTooltip = lazy(() => import('../../helpers/Tooltip_Helper').then(module => ({ default: module.HtmlTooltip })));
const GoogleMapReact = lazy(() => import('google-map-react'));
const Card = lazy(() => import('@material-ui/core/Card'));
const Button = lazy(() => import('@material-ui/core/Button'));

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const defaultMapProps = {
    center: {
        lat: 40.74,
        lng: -73.98
    },
    zoom: 10
};

const LocationMapIcon = () => <LocationOnIcon style={{ fill: "red" }}></LocationOnIcon>

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
        { id: 'time_of_submission', numeric: true, disablePadding: false, label: 'inspected on' },
        { id: 'seating_interest_sidewalk', numeric: false, disablePadding: false, label: 'applied for' },
        { id: 'decision', numeric: false, disablePadding: false, label: 'status' },
        { id: 'healthcompliance_terms', numeric: false, disablePadding: false, label: 'health compliant' },
    ];
      
    const mobileHeadCells = [
        { id: 'time_of_submission', numeric: true, disablePadding: false, label: 'inspected on' },
        { id: 'healthcompliance_terms', numeric: false, disablePadding: false, label: 'health compliant' },
    ];
    
    function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, isMobile } = props;
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
                {isMobile && headCell.id !== 'time_of_submission' &&
                    <div className="mobileTableHeader">
                        {headCell.label} &nbsp;
                    </div>
                }   
                {headCell.id === 'time_of_submission' &&
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                    {headCell.label}
                    </TableSortLabel>
                }
                {!isMobile && headCell.id !== 'time_of_submission' &&
                    <div className="mobileTableHeader">
                        {headCell.label} &nbsp;
                    </div>
                }
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

export const RestaurantDetail = (props) => {
    debugger
    let { restaurantname } = props.match.params;
    restaurantname = restaurantname && restaurantname.toUpperCase();
    const [details, setDetails] = useState([]);
    const [mostRecentInspection, setMostRecentInspection] = useState([]);
    const isMobile = detectMobile();

    // enhanced material-ui table
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('time_of_submission');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const tableRef = createRef();

    const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/pitm-atqc.json?restaurant_name=${restaurantname}`;

    const addressLine1 = details.businessaddress && details.businessaddress.substr(0, details.businessaddress.indexOf(','));
    const addressLine2 = details.businessaddress && details.businessaddress.substr(details.businessaddress.indexOf(',') + 2);

    const getDetails = () => {
        fetch(nycCompliantRestaurantApi).then(response => {
            if (!response.ok) {
                throw new Error(`status ${response.status}`);
            }
            return response.json();
        }).then(json => {
                if (json.length > 0){
                    setDetails(json);
                    setMostRecentInspection(json[0]);
                }
            }).catch(e => {
                throw new Error(`API call failed: ${e}`);
            });
    }
    
    useEffect(() => {
        getDetails();
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

    if (!mostRecentInspection) {
        return null;
    }
      
    return (
        <Fragment>
            <div className="Home">
                <header className="Home-header">
                    <Link to={`/location/${mapBorough(mostRecentInspection.borough)}`} style={{ textDecoration: 'none' }} >
                        <div className="backArrow">
                            <ArrowBackIcon />
                        </div>
                    </Link>
                    <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                        <h1> 
                            nyc restaurant info
                            <img alt="working trademark" className="tm" src={require("../../helpers/tm.png")} />
                        </h1>                    
                    </Link>
                </header>
            </div>
            <div className="resultsCard">
                <Box paddingY="2%">
                    <Container maxWidth="md" >
                        <Suspense fallback={<div className="loadingAnimation"><Loader
                            type="ThreeDots"
                            color="#d3d3d3"
                            height={100}
                            width={100} 
                        /></div>}>
                            <Card className="card-container">
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h5" className="standard-padding" gutterBottom>
                                            {mostRecentInspection.restaurant_name}
                                        </Typography>
                                        <CardContent>
                                            <RoomOutlinedIcon className="icon" /> &nbsp;
                                        <span className="details">
                                                {mostRecentInspection.business_address}
                                            </span>
                                            <span className="details">
                                                {isMobile && addressLine1}<br />
                                                {isMobile && addressLine2}
                                            </span>
                                        </CardContent>
                                        <CardContent>
                                        <AssignmentOutlinedIcon className="icon" /> &nbsp;
                                        {mostRecentInspection.time_of_submission && <span className="details">
                                                {mostRecentInspection.time_of_submission && mostRecentInspection.healthcompliance_terms === 'yes' ?
                                                    "health compliant"
                                                    : "health non-compliant"
                                                }
                                        </span>}
                                        </CardContent>
                                        <CardContent>
                                        <AirlineSeatReclineNormalOutlinedIcon className="icon" /> &nbsp;
                                        <span className="details">
                                                {mostRecentInspection.seatingchoice &&
                                                    mostRecentInspection.seatingchoice === "both"
                                                    ? "applied for sidewalk and street seating"
                                                    : mostRecentInspection.seatingchoice === "sidewalk"
                                                        ? "applied for sidewalk seating"
                                                        : "applied for street seating"
                                                }
                                            </span>
                                        </CardContent>
                                        <CardContent>
                                            <ThumbsUpDownOutlinedIcon className="icon" /> &nbsp;
                                        <span className="details">
                                        {mostRecentInspection.seating_interest_sidewalk === "both"
                                        ? (mostRecentInspection.approved_for_sidewalk_seating === 'yes' && mostRecentInspection.approved_for_roadway_seating === 'yes')
                                            ? "application approved" : " application declined"
                                        : mostRecentInspection.seating_interest_sidewalk === "sidewalk"
                                            ? mostRecentInspection.approved_for_sidewalk_seating === 'yes' ? "application approved" : "application declined"
                                            : mostRecentInspection.approved_for_roadway_seating === 'yes' ? "application approved" : "application declined"
                                        }
                                        </span>
                                        </CardContent>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div style={{ height: '300px', width: '100%' }}>
                                            <GoogleMapReact
                                                bootstrapURLKeys={{ key: googleApiKey }}
                                                defaultCenter={defaultMapProps.center}
                                                defaultZoom={defaultMapProps.zoom}
                                                yesIWantToUseGoogleMapApiInternals
                                            >
                                                <LocationMapIcon
                                                    lat={mostRecentInspection.latitude}
                                                    lng={mostRecentInspection.longitude} x
                                                    text="My Marker"
                                                />
                                            </GoogleMapReact>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Suspense>
                    </Container>
                </Box>
            </div>
            <div className="historyTable">
                <Suspense fallback={
                    <div className="loadingAnimation">
                        <Loader
                            type="ThreeDots"
                            color="#d3d3d3"
                            height={100}
                            width={100} 
                        />
                    </div>}>
                <div className="tableHelper"> browse all previous inspections below &nbsp;
                  <HtmlTooltip
                    title={
                      <Fragment>
                        <Typography>how do i use this table?</Typography><br />
                            below you will find all previous inspections for this restaurant<br /><br />
                            this information can be helpful to understand the restaurant's track record,
                            so you can confirm if a recent inspection is an accurate representation of their status <br /><br />
                      </Fragment>
                    }>
                      <img width={10} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img>
                  </HtmlTooltip>
                </div>
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
                                rowCount={details.length}
                                isMobile={true}
                            />
                            </Table>
                        </TableContainer>
                        <div style={{ overflowY: 'scroll', height: '300px' }} ref={tableRef}>
                            <TableContainer>
                            <Table style={{ tableLayout: 'fixed' }}>
                                <TableBody>
                                {stableSort(details, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((result) => (
                                    <StyledTableRow key={result.restaurantinspectionid}>
                                        <StyledTableCell component="th" scope="row">
                                            {result.time_of_submission.slice(0,10)}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {result.healthcompliance_terms}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </div>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            component="div"
                            count={details.length}
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
                                    rowCount={details.length}
                                    isMobile={false}
                                />
                            </Table>
                        </TableContainer>
                        <div style={{ overflowY: 'scroll', height: '300px' }} ref={tableRef}>
                        <TableContainer>
                            <Table style={{ tableLayout: 'fixed' }}>
                            <TableBody>
                                {stableSort(details, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((result) => (
                                    <StyledTableRow key={result.restaurantinspectionid}>
                                    <StyledTableCell component="th" scope="row">{result.time_of_submission.slice(0,10)}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{result.seating_interest_sidewalk === "both"
                                        ? "sidewalk and street"
                                        : result.seating_interest_sidewalk === "sidewalk"
                                        ? "sidewalk only"
                                        : result.restaurant_name === "loading..."
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
                                    <StyledTableCell align="left">{result.healthcompliance_terms || "n/a"}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                        </div>
                        <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        component="div"
                        count={details.length}
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
                </Suspense>
            </div>
            <Suspense fallback={<div className="loadingAnimation"><Loader
                type="ThreeDots"
                color="#d3d3d3"
                height={100}
                width={100} 
            /></div>}>
                {mostRecentInspection &&
                    <Link to={`/location/${mapBorough(mostRecentInspection.borough)}`} style={{ textDecoration: 'none' }}>
                        <div className="button">
                            <Button variant="outlined" style={{ textTransform: "lowercase" }}>
                                back
                                </Button>
                        </div>
                    </Link>
                }
            </Suspense>
        </Fragment>
    )
}
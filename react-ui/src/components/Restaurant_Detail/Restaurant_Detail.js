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
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

import { mapBorough } from '../../helpers/NYC_Data_Massaging';
import { DetectMobile } from '../../helpers/Window_Helper';
import BulletList from '../../helpers/bullet_list';

import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './Restaurant_Detail.css';
import { getGradeImage } from '../../helpers/get_grade_image';
import { getGeocodeAddress } from '../../helpers/get_geocode_address';
import { toTitleCase } from '../../helpers/to_title_case';

//lazy-loaded components
const Table = lazy(() => import('@material-ui/core/Table'));
const TableBody = lazy(() => import('@material-ui/core/TableBody'));
const TableCell = lazy(() => import('@material-ui/core/TableCell'));
const TableContainer = lazy(() => import('@material-ui/core/TableContainer'));
const TableHead = lazy(() => import('@material-ui/core/TableHead'));
const TableRow = lazy(() => import('@material-ui/core/TableRow'));
const Paper = lazy(() => import('@material-ui/core/Paper'));
const GoogleMapReact = lazy(() => import('google-map-react'));
const Card = lazy(() => import('@material-ui/core/Card'));
const Button = lazy(() => import('@material-ui/core/Button'));

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

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
    { id: 'grade_date', numeric: true, disablePadding: false, label: 'grade date' },
    { id: 'grade', numeric: false, disablePadding: false, label: 'grade' },
    { id: 'violation_description', numeric: false, disablePadding: false, label: 'health compliant' },
];

const mobileHeadCells = [
    { id: 'grade_date', numeric: true, disablePadding: false, label: 'grade date' },
    { id: 'grade', numeric: false, disablePadding: false, label: 'grade' },
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
                            width={headCell.id === 'grade_date' && !isMobile ? '20%' : 'auto'}
                        >
                            {isMobile && headCell.id !== 'grade_date' &&
                                <div className="mobileTableHeader">
                                    {headCell.label} &nbsp;
                                </div>
                            }
                            {headCell.id === 'grade_date' &&
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            }
                            {!isMobile && headCell.id !== 'grade_date' &&
                                <div className="mobileTableHeader">
                                    {headCell.label} &nbsp;
                                </div>
                            }
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
    let { dba } = props.match.params;
    dba = dba && dba.toUpperCase();
    const [details, setDetails] = useState([]);
    const [mapProps, setMapProps] = useState({
        center: {
            lat: 40.74,
            lng: -73.98
        },
        formatted_address: null,
        zoom: 11
    });

    const [mostRecentInspection, setMostRecentInspection] = useState([]);
    const isMobile = DetectMobile();

    // enhanced material-ui table
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('grade_date');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const tableRef = createRef();

    const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/gra9-xbjk.json?dba=${dba}`;

    const getDetails = () => {
        fetch(nycCompliantRestaurantApi).then(response => {
            if (!response.ok) {
                throw new Error(`status ${response.status}`);
            }
            return response.json();
        }).then(json => {
            if (json.length > 0) {
                setDetails(json);
                setMostRecentInspection(json[0]);
            }
        }).catch(e => {
            console.error(`API call failed: ${e}`);
            window.history.back();
        });
    }

    useEffect(() => {
        getDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mostRecentInspection?.zipcode) {
            getGeocodeAddress(`${mostRecentInspection.building} ${mostRecentInspection.street}, ${mostRecentInspection.boro} New York ${mostRecentInspection.zipcode}`)
                .then(coords => {
                    if (coords?.latitude && coords?.longitude) {
                        setMapProps(prevProps => ({
                            ...prevProps,
                            center: {
                                lat: coords.latitude,
                                lng: coords.longitude
                            },
                            formatted_address: coords.formatted_address
                        }));
                    }
                });
        }
    }, [mostRecentInspection]);

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

    const handleMapChange = ({ center, zoom }) => {
        setMapProps({ ...mapProps, center, zoom });
    };

    if (!mostRecentInspection) {
        return null;
    }

    return (
        <>
            <div className="Home">
                <header className="Home-header">
                    <Link to={`/location/${mapBorough(mostRecentInspection.boro)}`} style={{ textDecoration: 'none' }} >
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
                                        alignItems='center'
                                    >
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h5" className="standard-padding" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', textAlign: 'center' }}>
                                                {toTitleCase(mostRecentInspection.dba)}
                                            </Typography>
                                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginTop: -24, marginBottom: -16 }}>
                                                <p style={{textAlign: 'center'}}><b>{`${mapProps.formatted_address}`}</b></p>
                                            </CardContent>
                                            <CardContent style={{ marginBottom: '-16px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                                                    {getGradeImage(mostRecentInspection.grade, 100)}
                                                </div>
                                            </CardContent>
                                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                                                <p>{`(Graded ${mostRecentInspection.grade_date?.slice(0, 10)})`}</p>
                                            </CardContent>
                                            <CardContent>
                                                <AssignmentOutlinedIcon className="icon" /> &nbsp;
                                                <span className="details">
                                                    {mostRecentInspection.critical_flag === "Critical" ? <span style={{ color: 'red', fontSize: 16 }}><b>critical violations</b></span> : <span style={{ color: 'green' }}><b>No critical violations</b></span>}
                                                </span>
                                            </CardContent>
                                            <CardContent>
                                                <div className='columns'>
                                                    <span className="details pull-left">
                                                        <BulletList text={mostRecentInspection.violation_description} />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div style={{ height: '400px', width: '100%' }}>
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{ key: googleApiKey }}
                                                    center={mapProps.center}
                                                    zoom={mapProps.zoom}
                                                    onChange={handleMapChange} // This event is triggered when the map is moved or zoomed
                                                    yesIWantToUseGoogleMapApiInternals
                                                >
                                                    <LocationMapIcon
                                                        lat={mapProps.center.lat}
                                                        lng={mapProps.center.lng}
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
                        <div className="tableHelper"> Previous Inspections</div>
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
                                                                        {result.grade_date.slice(0, 10)}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell component="th" scope="row">
                                                                        {getGradeImage(result.grade)}
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
                            : <Fragment>
                                <div className="desktopTable" style={{marginBottom: 164}}>
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
                                                                    <StyledTableCell width={'20%'} component="th" scope="row">{result.grade_date.slice(0, 10)}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell width={'20%'} align="left">{getGradeImage(result.grade)}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="left">
                                                                        <BulletList text={mostRecentInspection.violation_description} />
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
                        {mostRecentInspection &&
                            <Link to={`/location/${mapBorough(mostRecentInspection.boro)}`} style={{ textDecoration: 'none' }}>
                                <div className="button">
                                    <Button variant="outlined">
                                        Back
                                    </Button>
                                </div>
                            </Link>
                        }
                    </Suspense>
                </div>
            </div>
            <Suspense fallback={<div className="loadingAnimation"><Loader
                type="ThreeDots"
                color="#d3d3d3"
                height={100}
                width={100}
            /></div>}>
            </Suspense>
        </>
    )
}
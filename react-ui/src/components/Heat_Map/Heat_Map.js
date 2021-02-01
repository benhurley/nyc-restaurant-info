import { Typography, Container, Box, Grid, Card, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
// import * as topojson from 'topojson';
import { useRef } from 'react';
import { detectMobile } from '../../helpers/Window_Helper';
import useResizeObserver from "../../helpers/Resize_Observer";

import './Heat_Map.css'
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: "128px 0px 128px 0px"
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

export const HeatMap = (props) => {
    const isMobile = detectMobile();
    const classes = useStyles();
    const [selectedBorough, setSelectedBorough] = useState(null);
    const [boroughData, setBoroughData] = useState(null);
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    const loadData = () => {
        fetch("https://raw.githubusercontent.com/dwillis/nyc-maps/master/boroughs.geojson").then(response => {
            if (!response.ok) {
                throw new Error(`status ${response.status}`);
            }
            return response.json()
        
        }).then(json => {
            setBoroughData(json);
        })
    }

    useEffect(() => {
        if(!boroughData) {
            loadData();
        } else {
            let svg = select(svgRef.current);
            console.log('geoJson', boroughData)
            const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
            // Projects geo-coordinates on a 2d plane
            const projection = geoMercator()
                .fitSize([width, height], selectedBorough || boroughData)
                .precision(100);
    
    
            // Take geojson data,
            // transforms that into the d attribute of a path element
            let pathGenerator = geoPath().projection(projection); 
            
            svg
                .selectAll('.borough')
                .data(boroughData.features)
                .join('path')
                .on('click', (event, feature) => {
                    console.log(feature);
                    console.log(selectedBorough);
                    return setSelectedBorough(selectedBorough === feature ? null : feature);
                })
                .attr('class', 'borough')
                .transition()
                .duration(1000)
                .attr("fill", '#ccc')
                .attr('d', (feature) => {
                    console.log(feature);
                    return pathGenerator(feature)
                });
        }
        
    }, [boroughData, dimensions, selectedBorough]);

    return (
        <Fragment>
            <Typography variant="h5" align="center" className="standard-padding" gutterBottom>
                🔥 🔥 🔥 Heat Map 🔥 🔥 🔥
            </Typography>
            <Container className="heatmap-container" justify="center" maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card id="content">
                            <Box p={2}>
                                <div ref={wrapperRef}>
                                    <svg ref={svgRef} height={750} width={1250}></svg>
                                </div>
                             </Box>
                         </Card>
                     </Grid>
                 </Grid>
             </Container>
        </Fragment>
    )
}
import { Typography, Container, Box, Grid, Card, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, Fragment, Suspense, lazy } from 'react';
import * as d3 from "d3";
import * as topojson from 'topojson';
import './Heat_Map.css'
import { select, svg } from 'd3';
import { useRef } from 'react';
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
    const classes = useStyles();

    const svgRef = useRef();
    const wrapperRef = useRef();
    let bouroughData = {};

    // let projection = d3.geoEquirectangular();
    // let geoGenerator = d3.geoPath().projection(projection); 
    const loadData = () => {
        // fetch("https://data-beta-nyc-files.s3.amazonaws.com/resources/35dd04fb-81b3-479b-a074-a27a37888ce7/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson?Signature=kNTm%2FKVCnbv1sH0z5zuc71bWtnU%3D&Expires=1612033618&AWSAccessKeyId=AKIAWM5UKMRH2KITC3QA").then(response => {
        fetch("https://raw.githubusercontent.com/dwillis/nyc-maps/master/boroughs.geojson").then(response => {
            if (!response.ok) {
                throw new Error(`status ${response.status}`);
            }
            return response.json()
        
        }).then(json => {
            console.log(json);
            bouroughData = json;
            drawChart(json);
        })
    }

    const drawChart = (geoJson) => {   
        console.log('geoJson', geoJson)
    
        const { width, height } = wrapperRef.current.getBoundingClientRect();
    
        const svg = select(svgRef.current);
        // Projects geo-coordinates on a 2d plane
        let projection = d3.geoMercator().fitSize([width, height], geoJson);

        // Take geojson data,
        // transforms that into the d attribute of a path element
        let pathGenerator = d3.geoPath().projection(projection); 
        
        svg.selectAll('.borough')
            .data(geoJson.features)
            .join('path')
            .attr('class', 'borough')
            .attr('d', feature => pathGenerator(feature))


    };


    useEffect(() => {
        loadData();
    }, []);

    return (
        <Fragment>
            <Typography variant="h5" align="center" className="standard-padding" gutterBottom>
                🔥 🔥 🔥 Heat Map 🔥 🔥 🔥
            </Typography>
            <Container className="heatmap-container" justify="center" maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card ref={wrapperRef} id="content">
                            <svg ref={svgRef} width="1000" height="750">
                            </svg>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
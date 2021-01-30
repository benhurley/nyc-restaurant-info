export const getPostCodes = (borough) => {
    if (borough.toLowerCase() === "manhattan") {
        return manhattanPostCodes();
    } else if (borough.toLowerCase() === "bronx") {
        return bronxPostCodes();
    } else if (borough.toLowerCase() === "brooklyn") {
        return brooklynPostCodes();
    } else if (borough.toLowerCase() === "queens") {
        return queensPostCodes();
    } else if (borough.toLowerCase() === "staten island") {
        return statenIslandPostCodes();
    }
}

export const manhattanPostCodes = () => {
    return ([{'postcode': '10001'}, {'postcode': '10002'}, {'postcode': '10003'}, {'postcode': '10004'}, 
    {'postcode': '10005'}, {'postcode': '10006'}, {'postcode': '10007'}, {'postcode': '10009'}, 
    {'postcode': '10010'}, {'postcode': '10011'}, {'postcode': '10012'}, {'postcode': '10013'}, 
    {'postcode': '10014'}, {'postcode': '10016'}, {'postcode': '10017'}, {'postcode': '10018'}, 
    {'postcode': '10019'}, {'postcode': '10020'}, {'postcode': '10021'}, {'postcode': '10022'}, 
    {'postcode': '10023'}, {'postcode': '10024'}, {'postcode': '10025'}, {'postcode': '10026'}, 
    {'postcode': '10027'}, {'postcode': '10028'}, {'postcode': '10029'}, {'postcode': '10030'},
    {'postcode': '10031'}, {'postcode': '10032'}, {'postcode': '10033'}, {'postcode': '10034'}, 
    {'postcode': '10035'}, {'postcode': '10036'}, {'postcode': '10037'}, {'postcode': '10038'}, 
    {'postcode': '10039'}, {'postcode': '10040'}, {'postcode': '10044'}, {'postcode': '10065'}, 
    {'postcode': '10075'}, {'postcode': '10128'}, {'postcode': '10280'}]);
}

export const bronxPostCodes = () => {
    return ([{'postcode': '10451'}, {'postcode': '10452'}, {'postcode': '10453'}, {'postcode': '10454'}, 
    {'postcode': '10455'}, {'postcode': '10456'}, {'postcode': '10457'}, {'postcode': '10458'}, 
    {'postcode': '10460'}, {'postcode': '10459'}, {'postcode': '10461'}, {'postcode': '10462'}, 
    {'postcode': '10463'}, {'postcode': '10464'}, {'postcode': '10465'}, {'postcode': '10466'}, 
    {'postcode': '10467'}, {'postcode': '10468'}, {'postcode': '10469'}, {'postcode': '10470'}, 
    {'postcode': '10471'}, {'postcode': '10471'}, {'postcode': '10472'}, {'postcode': '10473'}, 
    {'postcode': '10475'}]);
}

export const brooklynPostCodes = () => {
    return ([{'postcode': '11201'}, {'postcode': '11203'}, {'postcode': '11204'}, {'postcode': '11205'}, 
    {'postcode': '11206'}, {'postcode': '11207'}, {'postcode': '11208'}, {'postcode': '11209'}, 
    {'postcode': '11210'}, {'postcode': '11211'}, {'postcode': '11212'}, {'postcode': '11213'}, 
    {'postcode': '11214'}, {'postcode': '11215'}, {'postcode': '11216'}, {'postcode': '11217'}, 
    {'postcode': '11228'}, {'postcode': '11219'}, {'postcode': '11220'}, {'postcode': '11221'}, 
    {'postcode': '11222'}, {'postcode': '11223'}, {'postcode': '11224'}, {'postcode': '11201'}, 
    {'postcode': '11225'}, {'postcode': '11226'}, {'postcode': '11229'}, {'postcode': '11230'}, 
    {'postcode': '11231'}, {'postcode': '11232'}, {'postcode': '11233'}, {'postcode': '11234'}, 
    {'postcode': '11235'}, {'postcode': '11236'}, {'postcode': '11237'}, {'postcode': '11238'}, 
    {'postcode': '11239'}]);
}

export const statenIslandPostCodes = () => {
    return ([{'postcode': '10301'}, {'postcode': '10302'}, {'postcode': '10303'}, {'postcode': '10304'}, 
    {'postcode': '10305'}, {'postcode': '10306'}, {'postcode': '10307'}, {'postcode': '10308'}, 
    {'postcode': '10309'}, {'postcode': '10310'}, {'postcode': '10312'}, {'postcode': '10314'},]);
}

export const queensPostCodes = () => {
    return ([{'postcode': '11004'}, {'postcode': '11005'}, {'postcode': '11101'}, {'postcode': '11102'}, 
    {'postcode': '11103'}, {'postcode': '11104'}, {'postcode': '11105'}, {'postcode': '11106'}, 
    {'postcode': '11354'}, {'postcode': '11355'}, {'postcode': '11356'}, {'postcode': '11357'}, 
    {'postcode': '11358'}, {'postcode': '11359'}, {'postcode': '11360'}, {'postcode': '11361'},
    {'postcode': '11362'}, {'postcode': '11363'}, {'postcode': '11364'}, {'postcode': '11365'}, 
    {'postcode': '11366'}, {'postcode': '11367'}, {'postcode': '11368'}, {'postcode': '11369'}, 
    {'postcode': '11370'}, {'postcode': '11373'}, {'postcode': '11374'}, {'postcode': '11375'},
    {'postcode': '11377'}, {'postcode': '11378'}, {'postcode': '11379'}, {'postcode': '11385'},
    {'postcode': '11411'}, {'postcode': '11412'}, {'postcode': '11413'}, {'postcode': '11414'}, 
    {'postcode': '11415'}, {'postcode': '11416'}, {'postcode': '11417'}, {'postcode': '11418'},
    {'postcode': '11419'}, {'postcode': '11420'}, {'postcode': '11421'}, {'postcode': '11422'}, 
    {'postcode': '11423'}, {'postcode': '11426'}, {'postcode': '11427'}, {'postcode': '11428'}, 
    {'postcode': '11429'}, {'postcode': '11432'}, {'postcode': '11433'}, {'postcode': '11434'}, 
    {'postcode': '11435'}, {'postcode': '11436'}, {'postcode': '11691'}, {'postcode': '11692'}, 
    {'postcode': '11693'}, {'postcode': '11694'}, {'postcode': '11695'}, {'postcode': '11697'}]);
}
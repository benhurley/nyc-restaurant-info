export const getZipCodes = (borough) => {
    if (borough === "Manhattan") {
        return manhattanZipCodes();
    } else if (borough === "Bronx") {
        return bronxZipCodes();
    } else if (borough === "Brooklyn") {
        return brooklynZipCodes();
    } else if (borough === "Queens") {
        return queensZipCodes();
    } else if (borough === "Staten island") {
        return statenIslandZipCodes();
    }
}

export const manhattanZipCodes = () => {
    return ([{'zipcode': '10001'}, {'zipcode': '10002'}, {'zipcode': '10003'}, {'zipcode': '10004'}, 
    {'zipcode': '10005'}, {'zipcode': '10006'}, {'zipcode': '10007'}, {'zipcode': '10009'}, 
    {'zipcode': '10010'}, {'zipcode': '10011'}, {'zipcode': '10012'}, {'zipcode': '10013'}, 
    {'zipcode': '10014'}, {'zipcode': '10016'}, {'zipcode': '10017'}, {'zipcode': '10018'}, 
    {'zipcode': '10019'}, {'zipcode': '10020'}, {'zipcode': '10021'}, {'zipcode': '10022'}, 
    {'zipcode': '10023'}, {'zipcode': '10024'}, {'zipcode': '10025'}, {'zipcode': '10026'}, 
    {'zipcode': '10027'}, {'zipcode': '10028'}, {'zipcode': '10029'}, {'zipcode': '10030'},
    {'zipcode': '10031'}, {'zipcode': '10032'}, {'zipcode': '10033'}, {'zipcode': '10034'}, 
    {'zipcode': '10035'}, {'zipcode': '10036'}, {'zipcode': '10037'}, {'zipcode': '10038'}, 
    {'zipcode': '10039'}, {'zipcode': '10040'}, {'zipcode': '10044'}, {'zipcode': '10065'}, 
    {'zipcode': '10075'}, {'zipcode': '10128'}, {'zipcode': '10280'}]);
}

export const bronxZipCodes = () => {
    return ([{'zipcode': '10451'}, {'zipcode': '10452'}, {'zipcode': '10453'}, {'zipcode': '10454'}, 
    {'zipcode': '10455'}, {'zipcode': '10456'}, {'zipcode': '10457'}, {'zipcode': '10458'}, 
    {'zipcode': '10460'}, {'zipcode': '10459'}, {'zipcode': '10461'}, {'zipcode': '10462'}, 
    {'zipcode': '10463'}, {'zipcode': '10464'}, {'zipcode': '10465'}, {'zipcode': '10466'}, 
    {'zipcode': '10467'}, {'zipcode': '10468'}, {'zipcode': '10469'}, {'zipcode': '10470'}, 
    {'zipcode': '10471'}, {'zipcode': '10471'}, {'zipcode': '10472'}, {'zipcode': '10473'}, 
    {'zipcode': '10475'}]);
}

export const brooklynZipCodes = () => {
    return ([{'zipcode': '11201'}, {'zipcode': '11203'}, {'zipcode': '11204'}, {'zipcode': '11205'}, 
    {'zipcode': '11206'}, {'zipcode': '11207'}, {'zipcode': '11208'}, {'zipcode': '11209'}, 
    {'zipcode': '11210'}, {'zipcode': '11211'}, {'zipcode': '11212'}, {'zipcode': '11213'}, 
    {'zipcode': '11214'}, {'zipcode': '11215'}, {'zipcode': '11216'}, {'zipcode': '11217'}, 
    {'zipcode': '11228'}, {'zipcode': '11219'}, {'zipcode': '11220'}, {'zipcode': '11221'}, 
    {'zipcode': '11222'}, {'zipcode': '11223'}, {'zipcode': '11224'}, {'zipcode': '11201'}, 
    {'zipcode': '11225'}, {'zipcode': '11226'}, {'zipcode': '11229'}, {'zipcode': '11230'}, 
    {'zipcode': '11231'}, {'zipcode': '11232'}, {'zipcode': '11233'}, {'zipcode': '11234'}, 
    {'zipcode': '11235'}, {'zipcode': '11236'}, {'zipcode': '11237'}, {'zipcode': '11238'}, 
    {'zipcode': '11239'}]);
}

export const statenIslandZipCodes = () => {
    return ([{'zipcode': '10301'}, {'zipcode': '10302'}, {'zipcode': '10303'}, {'zipcode': '10304'}, 
    {'zipcode': '10305'}, {'zipcode': '10306'}, {'zipcode': '10307'}, {'zipcode': '10308'}, 
    {'zipcode': '10309'}, {'zipcode': '10310'}, {'zipcode': '10312'}, {'zipcode': '10314'},]);
}

export const queensZipCodes = () => {
    return ([{'zipcode': '11004'}, {'zipcode': '11005'}, {'zipcode': '11101'}, {'zipcode': '11102'}, 
    {'zipcode': '11103'}, {'zipcode': '11104'}, {'zipcode': '11105'}, {'zipcode': '11106'}, 
    {'zipcode': '11354'}, {'zipcode': '11355'}, {'zipcode': '11356'}, {'zipcode': '11357'}, 
    {'zipcode': '11358'}, {'zipcode': '11359'}, {'zipcode': '11360'}, {'zipcode': '11361'},
    {'zipcode': '11362'}, {'zipcode': '11363'}, {'zipcode': '11364'}, {'zipcode': '11365'}, 
    {'zipcode': '11366'}, {'zipcode': '11367'}, {'zipcode': '11368'}, {'zipcode': '11369'}, 
    {'zipcode': '11370'}, {'zipcode': '11373'}, {'zipcode': '11374'}, {'zipcode': '11375'},
    {'zipcode': '11377'}, {'zipcode': '11378'}, {'zipcode': '11379'}, {'zipcode': '11385'},
    {'zipcode': '11411'}, {'zipcode': '11412'}, {'zipcode': '11413'}, {'zipcode': '11414'}, 
    {'zipcode': '11415'}, {'zipcode': '11416'}, {'zipcode': '11417'}, {'zipcode': '11418'},
    {'zipcode': '11419'}, {'zipcode': '11420'}, {'zipcode': '11421'}, {'zipcode': '11422'}, 
    {'zipcode': '11423'}, {'zipcode': '11426'}, {'zipcode': '11427'}, {'zipcode': '11428'}, 
    {'zipcode': '11429'}, {'zipcode': '11432'}, {'zipcode': '11433'}, {'zipcode': '11434'}, 
    {'zipcode': '11435'}, {'zipcode': '11436'}, {'zipcode': '11691'}, {'zipcode': '11692'}, 
    {'zipcode': '11693'}, {'zipcode': '11694'}, {'zipcode': '11695'}, {'zipcode': '11697'}]);
}
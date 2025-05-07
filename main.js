import Feature from './node_modules/ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import { Vector } from 'ol/source';
import OSM from 'ol/source/OSM.js';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import { transform } from 'ol/proj';
import Overlay from 'ol/Overlay.js';
import Select from 'ol/interaction/Select.js';
import { singleClick } from 'ol/events/condition';

//get html elements
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const styles = {
  '1': new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 5,
    }),
  }),
  '2': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 5,
    }),
  }),
  '3': new Style({
    stroke: new Stroke({
      color: 'orange',
      width: 5,
    }),
  }),
  '4': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 5,
    }),
  }),
  '5': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 5,
    }),
  }),
  'Point': new Style({
    image: new CircleStyle({
        radius: 7,
        fill: new Fill({color:'purple'}),
        stroke: new Stroke({color: 'black', width: 1}),
      }),
  }),
  'Selected': new Style({
    image: new CircleStyle({
        radius: 7,
        fill: new Fill({color:'white'}),
        stroke: new Stroke({color: 'black', width: 1}),
      }),
  }),
};

const styleFunction = function (feature) {
    return styles[feature.get('f-scale')];

};

const geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857',
    },
  },
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [0, 0],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [4e6, -2e6],
          [8e6, 2e6],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [4e6, 2e6],
          [8e6, -2e6],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-5e6, -1e6],
            [-3e6, -1e6],
            [-4e6, 1e6],
            [-5e6, -1e6],
          ],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiLineString',
        'coordinates': [
          [
            [-1e6, -7.5e5],
            [-1e6, 7.5e5],
          ],
          [
            [1e6, -7.5e5],
            [1e6, 7.5e5],
          ],
          [
            [-7.5e5, -1e6],
            [7.5e5, -1e6],
          ],
          [
            [-7.5e5, 1e6],
            [7.5e5, 1e6],
          ],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              [-5e6, 6e6],
              [-3e6, 6e6],
              [-3e6, 8e6],
              [-5e6, 8e6],
              [-5e6, 6e6],
            ],
          ],
          [
            [
              [-2e6, 6e6],
              [0, 6e6],
              [0, 8e6],
              [-2e6, 8e6],
              [-2e6, 6e6],
            ],
          ],
          [
            [
              [1e6, 6e6],
              [3e6, 6e6],
              [3e6, 8e6],
              [1e6, 8e6],
              [1e6, 6e6],
            ],
          ],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'GeometryCollection',
        'geometries': [
          {
            'type': 'LineString',
            'coordinates': [
              [-5e6, -5e6],
              [0, -5e6],
            ],
          },
          {
            'type': 'Point',
            'coordinates': [4e6, -5e6],
          },
          {
            'type': 'Polygon',
            'coordinates': [
              [
                [1e6, -6e6],
                [3e6, -6e6],
                [2e6, -4e6],
                [1e6, -6e6],
              ],
            ],
          },
        ],
      },
    },
  ],
};

const ta_data = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:4326',
    },
  },
  'features': [
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T00:57:00Z",
            "f-scale": "4",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2362023USA",
            "countries": [
                "US"
            ],
            "fatalities": 17,
            "path-width": 1320,
            "path-length": 59.23,
            "wind": 195,
            "injuries": 165,
            "states": [
                "MS"
            ],
            "comments": "This long track, violent tornado began over northern Issaquena County near Grant Rd, downing multiple trees and damaging two older outbuildings. It tracked northeastward, producing tree damage as it crossed the Steele Bayou Canal before crossing into Sharkey County. At this point, the tornado began to substantially increase in size and intensity. A very high percentage of trees were snapped along the path through a wooded area south of Bear Lake Rd. It was in this wooded area where the first indications of EF3 to EF4 damage were noted, with at least one tree and root ball and several more large tree pieces fully displaced into the downstream field. From this point along the path in Sharkey County, there was a well defined confluence zone in damage along the center of the tornado track.\nOn the western outskirts of the city of Rolling Fork, homes began to be impacted with significant roof damage along Bear Lake Rd. Several tall wooden utility transmission poles were snapped along Bear Lake Rd and MS Highway 826. Along Pinkins Rd, each structure along the road, including several manufactured homes and two site built homes, was demolished. Structures on the west end of the road were scattered radially southeastward, and structures on the east end of the road were scattered northward. An occupant of one of the mobile homes was critically injured during the tornado and eventually passed away nearly four weeks later. Debarking was observed on several hardwood trees, with only stubs of the main branches of some trees remaining. Crossing MS 826 and along Fleetwood Rd, an older metal building was swept away, a small home was destroyed and numerous manufactured homes were destroyed.\nAs the tornado moved into the western side of Rolling Fork, the tornadic wind field was broad, encompassing the area from Race St, where exterior damage occurred to the Sharkey Issaquena Hospital, to Bear Lake Rd on the south end where several utility poles were snapped. The corridor of greatest damage on the west side of the city, rated high end EF3, extended from 7th St between Martin Ave and Joor Ave to 3rd St between Southern Ave and Lewis Ave. In this area, multiple homes lost most exterior walls, several more lost roofs and some walls, and even more received at least minor damage. Two fatalities occurred along 7th St when a trailer truck was tossed into a home. Through this corridor, additional debarking of trees was noted near the center of the path. Brief and minor weakening occurred as the tornado moved east of 3rd St and began to approach Deer Creek, with EF2 damage still common. Along the creek, the fire station, Rolling Fork Elementary School, and South Delta High School all sustained roof and other exterior damage.\nAfter the tornado crossed Deer Creek and began to move into the downtown area of Rolling Fork, reintensification occurred. Additional EF4 damage was noted in the block between Sharkey St and Worthington Ave and north of Collette Ave where a home and a duplex apartment were entirely demolished, with the foundation of the duplex partially swept. Large metal buildings at an agriculture business at the intersection of East St and West Ave were destroyed. A fatality occurred when a mobile home along Worthington Ave was destroyed. On Parkway Ave, a Masonic lodge was leveled and a gas station was substantially damaged.\nThe tornado then crossed Rolling Fork Creek, damaging and destroying several structures along McLaurin St and China St. A water tower east of Hicks Ave, which was in service at the time of the tornado, was felled in a southeastward direction, perpendicular to the tornado path. In the downtown area, the roof was removed from the Rolling Fork US Post Office, portions of Rolling Fork City Hall, and portions of the Rolling Fork Police Department. The Sharkey County Courthouse received damage to the roof and some windows, with the cupola removed. Additional EF4 damage was observed as the tornado crossed Walnut St, with multiple homes and businesses having all or most walls downed. One building in this corridor was compromised by two tossed tractor trailers and another was compromised by a southward facing metal door. A fatality occurred when a mobile home off Sidney Alexander St north of Walnut St was destroyed.\nThe tornado reached its peak intensity as it approached US Highway 61 just north of Walnut St. Multiple brick homes along Mulberry St were leveled, with debris remaining on the foundations. A discount retail chain store was completely destroyed, with much of the debris swept to the downstream side of the foundation and rowed along the tornado path. Two people died at this location. A gift/floral shop was destroyed, with most debris swept from the foundation. Additional businesses, including a lumber/hardware store, two restaurants, a furniture store, and an insurance agency were also destroyed in this area. One occupant of a truck traveling along US 61 was killed when the tornado tossed his vehicle from the highway to near the lumber/hardware store. A mobile/manufactured home park on the east side of US 61 was devastated, with all 30-35 homes destroyed. Considerable debris from these homes was rowed 300-400 yards downstream along the tornado path into an adjacent field and stand of trees. Six occupants of these homes died in the tornado.\nThe tornado remained strong to violent as it continued northeast of Rolling Fork across mainly open fields. Through these fields, aerial imagery revealed multiple areas of ground scarring. The tornado crossed Matthews Rd near a catfish farm, where several utility poles were snapped near the ground and covered in 1 to 2 inches of mud. Some of the poles were tossed into nearby ponds. Prolific tree damage occurred along Sandy Bayou, with a few buildings along the outer edges of the path damaged and a tractor trailer flipped. Another area of EF4 damage was observed from Widow Bayou and E River Rd northeastward through Dogwood Rd and Linsey Rd. Through this corridor, extraordinary hardwood tree damage occurred with most trees completely mangled and debarking noted. There was additional evidence of trees or large parts of trees being tossed or dragged a short distance. Several utility poles were snapped, with some tossed a short distance. An outbuilding type structure off Dogwood Rd was blown away, with a school bus from the property tossed into nearby trees. Ground scarring and cycloidal marks were observed in the field between Dogwood Rd and Linsey Rd, along with mulched tree debris which was rowed into a narrow line along the center of the tornado path. Tree damage continued across Keith Rd and Charlie Pitt Rd as the tornado approached MS Highway 14.\nEast of Anguilla along MS Highway 14, a frame home was completely destroyed. Near the home, several power poles were snapped or broken. Tree damage was extensive with large areas mowed down. A tenth of a mile east, a mobile home was rolled into nearby trees. Moving into Humphreys County, along Prudent Rd, most of the roof was taken off of a home, where the garage collapsed along with a portion of the front porch. One vehicle was flipped and another was moved. A metal workshop was destroyed and structural beams were bent. Along the road, several power poles were snapped and thrown a couple hundred feet into a nearby field. As the tornado approached and crossed Seven Mile Rd, intensity increased. Here, several metal buildings were heavily damaged or destroyed with structural beams bent. Grain bins had sides collapsed and the tops blown off. A small brick home was completely destroyed with all of the exterior walls collapsed. The home next door had a large portion of the roof removed and part of a wall had collapsed. Debris from the home was thrown several hundred feet into a nearby field. Vehicles were moved out of the garage and a large grain storage cart was thrown into the field as well.\nFor several miles, the tornado traveled along MS Highway 149 moving toward Silver City where large areas of hardwood trees were snapped and uprooted. Multiple center pivot irrigation systems were flipped. A mobile home was completely destroyed when it was rolled into a nearby field. A portion of the roof was blown off a school. A community along the same road had several homes with significant roof damage, and at least one home had decking material partially removed. Several homes and a large metal building were severely damaged when portions of the roof were blown off. A second metal building was completely destroyed with large structural posts bent.\nAs the tornado came into Silver City from the west along Highway 149, an apartment complex was heavily damaged. Several buildings had sections of the roof removed and one building had portions of the western walls partially collapsed. A fatality occurred in one of the single story apartment buildings. In the nearby neighborhood, numerous homes had roof damage. At least two frame homes were destroyed where one or more exterior walls collapsed. A large number of old hardwood trees were snapped or uprooted. As the storm moved east toward US 49W, more trees were snapped and uprooted. Several homes and a church near the intersection of MS Highway 14 and US 49W had areas of the roof damaged or removed. Four mobile homes were completely destroyed. One person died when a mobile home was tossed into a house, and a child died in one of the mobile homes that was destroyed. Numerous trees were snapped and uprooted, a few of which fell on homes. The rating in the Silver City area ranged from EF1-EF2.\nThe tornado continued to track east where mostly tree damage occurred. In rural portions of Holmes County northeast of Tchula, there was substantial tree damage with swaths of snapped and uprooted trees. Several center pivot irrigation systems were overturned and grain bins were flipped or destroyed. The tornado continued to move northeast before dissipating in a wooded area north of Randall Road.",
            "datetime-end": "2023-03-25T02:08:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -90.999299222,
                    32.841397587
                ],
                [
                    -90.986510449,
                    32.845219483
                ],
                [
                    -90.969417376,
                    32.856522091
                ],
                [
                    -90.954993359,
                    32.866687564
                ],
                [
                    -90.949774058,
                    32.870090032
                ],
                [
                    -90.93603265,
                    32.875377967
                ],
                [
                    -90.931188581,
                    32.877582169
                ],
                [
                    -90.926225153,
                    32.87967932
                ],
                [
                    -90.91961619,
                    32.883193233
                ],
                [
                    -90.912923247,
                    32.887848485
                ],
                [
                    -90.904117738,
                    32.893005574
                ],
                [
                    -90.896297782,
                    32.895968313
                ],
                [
                    -90.894070797,
                    32.897195338
                ],
                [
                    -90.888012872,
                    32.899531214
                ],
                [
                    -90.885818825,
                    32.900456801
                ],
                [
                    -90.883847402,
                    32.90133959
                ],
                [
                    -90.880966709,
                    32.903260526
                ],
                [
                    -90.877529458,
                    32.90552934
                ],
                [
                    -90.876266138,
                    32.906747607
                ],
                [
                    -90.874973469,
                    32.907752588
                ],
                [
                    -90.87309576,
                    32.908784335
                ],
                [
                    -90.871969124,
                    32.909372897
                ],
                [
                    -90.871579645,
                    32.909806242
                ],
                [
                    -90.871063319,
                    32.910202555
                ],
                [
                    -90.870076267,
                    32.910771127
                ],
                [
                    -90.869746355,
                    32.910879212
                ],
                [
                    -90.867571757,
                    32.912186818
                ],
                [
                    -90.856970483,
                    32.916876569
                ],
                [
                    -90.845276051,
                    32.92232529
                ],
                [
                    -90.823643137,
                    32.932905077
                ],
                [
                    -90.815109689,
                    32.936253672
                ],
                [
                    -90.797942719,
                    32.943317207
                ],
                [
                    -90.784871859,
                    32.949580386
                ],
                [
                    -90.77468787,
                    32.954222898
                ],
                [
                    -90.768200111,
                    32.957368951
                ],
                [
                    -90.76397429,
                    32.958931962
                ],
                [
                    -90.759563278,
                    32.961019198
                ],
                [
                    -90.757312905,
                    32.961914886
                ],
                [
                    -90.749092471,
                    32.96594013
                ],
                [
                    -90.747568977,
                    32.966772758
                ],
                [
                    -90.745747757,
                    32.967362344
                ],
                [
                    -90.74391849,
                    32.967983431
                ],
                [
                    -90.741314971,
                    32.96949785
                ],
                [
                    -90.736966426,
                    32.972105981
                ],
                [
                    -90.734313721,
                    32.973496594
                ],
                [
                    -90.732194776,
                    32.974671173
                ],
                [
                    -90.723071612,
                    32.979560581
                ],
                [
                    -90.721334882,
                    32.980655205
                ],
                [
                    -90.717736995,
                    32.98303453
                ],
                [
                    -90.71468023,
                    32.985451737
                ],
                [
                    -90.711727506,
                    32.987149541
                ],
                [
                    -90.704000061,
                    32.99123849
                ],
                [
                    -90.696481225,
                    32.994775019
                ],
                [
                    -90.69067047,
                    32.996897329
                ],
                [
                    -90.684378578,
                    33.000934312
                ],
                [
                    -90.675798394,
                    33.005535963
                ],
                [
                    -90.665839443,
                    33.010637381
                ],
                [
                    -90.640767239,
                    33.023213382
                ],
                [
                    -90.630510471,
                    33.029698965
                ],
                [
                    -90.622978828,
                    33.03280216
                ],
                [
                    -90.601177833,
                    33.045150898
                ],
                [
                    -90.578818939,
                    33.055744428
                ],
                [
                    -90.570858143,
                    33.059521101
                ],
                [
                    -90.563069008,
                    33.06293795
                ],
                [
                    -90.554056785,
                    33.066552473
                ],
                [
                    -90.551215417,
                    33.067941383
                ],
                [
                    -90.549779765,
                    33.068616831
                ],
                [
                    -90.549043498,
                    33.068953992
                ],
                [
                    -90.548679388,
                    33.06913381
                ],
                [
                    -90.54826901,
                    33.069319247
                ],
                [
                    -90.542734272,
                    33.072024337
                ],
                [
                    -90.53745896,
                    33.074867263
                ],
                [
                    -90.534530995,
                    33.076773223
                ],
                [
                    -90.530308757,
                    33.07954478
                ],
                [
                    -90.52811005,
                    33.08065654
                ],
                [
                    -90.526335169,
                    33.081528554
                ],
                [
                    -90.522558619,
                    33.083429842
                ],
                [
                    -90.518095423,
                    33.085827742
                ],
                [
                    -90.515690831,
                    33.087184679
                ],
                [
                    -90.513192047,
                    33.088430386
                ],
                [
                    -90.511078466,
                    33.089540512
                ],
                [
                    -90.508704252,
                    33.090592523
                ],
                [
                    -90.506446291,
                    33.091744991
                ],
                [
                    -90.504212011,
                    33.092850581
                ],
                [
                    -90.493095539,
                    33.101880659
                ],
                [
                    -90.456317089,
                    33.120195386
                ],
                [
                    -90.422092102,
                    33.138506294
                ],
                [
                    -90.380974942,
                    33.158161784
                ],
                [
                    -90.360718899,
                    33.167358659
                ],
                [
                    -90.323167973,
                    33.181134205
                ],
                [
                    -90.28909319,
                    33.197331619
                ],
                [
                    -90.277634793,
                    33.201981985
                ],
                [
                    -90.232831173,
                    33.217062557
                ],
                [
                    -90.223561459,
                    33.219503928
                ],
                [
                    -90.184594326,
                    33.235586558
                ],
                [
                    -90.172921353,
                    33.239750328
                ],
                [
                    -90.113698178,
                    33.263293436
                ],
                [
                    -90.112582379,
                    33.263580508
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T01:19:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2372023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 70,
            "path-length": 0.26,
            "wind": 95,
            "injuries": 0,
            "states": [
                "TN"
            ],
            "comments": "A short-lived tornado touched down near Jim Hardister Road in southeast Haywood County on the evening of Friday, March 24, 2023. This tornado primarily uprooted and/or snapped trees, but roof damage was noted to a house, barn, and outbuilding. The tornado continued to a manufactured home, shifting it off the block piers. The last sign of tornado damage occurred just to the northeast at another residence where numerous trees were uprooted and/or snapped, including one that fell onto the residence and caused significant roof damage. The tornado likely lifted up in a field shortly after. Peak winds were estimated at 95 mph.",
            "datetime-end": "2023-03-25T01:20:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -89.197633217,
                    35.424771927
                ],
                [
                    -89.193459699,
                    35.42629314
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T01:25:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2382023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 100,
            "path-length": 8.39,
            "wind": 95,
            "injuries": 0,
            "states": [
                "MS"
            ],
            "comments": "The tornado developed along Three Wheeler Road in extreme southern Panola County. This tornado caused intermittent tree damage as it moved northeast across Cole Road and Crowder Pope Road. Additional tree damage was noted along Gleaton Road and Main Street on the southwest side of Pope. A structure sustained minor roof damage in this area. Numerous trees were uprooted across eastern Pope with one large tree falling on a home and causing structural damage. The tornado continued to move northeast across Green Road, causing damage to trees and an outbuilding near Interstate 55 and Hentz Road. This tornado lifted shortly after crossing the Interstate. Peak winds were estimated at 95 mph.",
            "datetime-end": "2023-03-25T01:34:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -90.045831144,
                    34.162451765
                ],
                [
                    -90.022013128,
                    34.170938288
                ],
                [
                    -89.997478597,
                    34.18378533
                ],
                [
                    -89.975574378,
                    34.1957911
                ],
                [
                    -89.92356098,
                    34.228725157
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T01:38:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2392023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 150,
            "path-length": 6.18,
            "wind": 110,
            "injuries": 0,
            "states": [
                "MS"
            ],
            "comments": "The tornado formed near the intersection of Eureka Road and Crouch Road, moving northeast and affecting the areas along Holmes Road and Henderson Road. Numerous trees were snapped or uprooted along this path with minor roof damage observed and a few snapped utility poles. This tornado then crossed both Dees Road and Highway 315 where significant tree damage was observed. Minor damage occurred to trees and a few outbuildings along Joiner Road where the tornado finally lifted. Peak winds were estimated at 110 mph.",
            "datetime-end": "2023-03-25T01:44:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -89.848241365,
                    34.238136088
                ],
                [
                    -89.819788492,
                    34.257043943
                ],
                [
                    -89.814209497,
                    34.259384957
                ],
                [
                    -89.808973825,
                    34.2622934
                ],
                [
                    -89.804682291,
                    34.265272676
                ],
                [
                    -89.80081991,
                    34.268819296
                ],
                [
                    -89.797644174,
                    34.27286226
                ],
                [
                    -89.793947161,
                    34.277638742
                ],
                [
                    -89.789833581,
                    34.282366006
                ],
                [
                    -89.784984147,
                    34.286798356
                ],
                [
                    -89.78026346,
                    34.28949311
                ],
                [
                    -89.77528528,
                    34.291620487
                ],
                [
                    -89.766101396,
                    34.293251439
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T01:47:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2402023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 125,
            "path-length": 3.94,
            "wind": 100,
            "injuries": 0,
            "states": [
                "MS"
            ],
            "comments": "The tornado produced minor damage near the intersection of Shady Grove Road and Perkins Road in extreme eastern Panola County. It then moved east-northeast into Lafayette County. Peak winds in Panola County were estimated at 85 mph. This tornado moved from Panola County into LaFayette County. The tornado generally followed County Road 317 and caused sporadic, but significant, tree damage from Murphy Ridge Road to County Road 362. Minor structural damage was noted along the path, mainly to barns and outbuildings. Peak winds in LaFayette County were estimated at 100 mph.",
            "datetime-end": "2023-03-25T01:51:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -89.730889438,
                    34.321942619
                ],
                [
                    -89.7223922,
                    34.325132431
                ],
                [
                    -89.716727375,
                    34.326620968
                ],
                [
                    -89.705826877,
                    34.327258905
                ],
                [
                    -89.695870517,
                    34.32818036
                ],
                [
                    -89.688832401,
                    34.33002324
                ],
                [
                    -89.680678485,
                    34.333425374
                ],
                [
                    -89.674155353,
                    34.336685623
                ],
                [
                    -89.667031406,
                    34.343560081
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T02:12:00Z",
            "f-scale": "3",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2412023USA",
            "countries": [
                "US"
            ],
            "fatalities": 3,
            "path-width": 1250,
            "path-length": 29.43,
            "wind": 155,
            "injuries": 5,
            "states": [
                "MS"
            ],
            "comments": "This long track tornado began just southwest of Black Hawk in a wooded area with widespread tree damage, including snapped and uprooted trees. Satellite imagery indicates major tree damage of EF2 intensity. It continued northeast before crossing Highway 430, CR 235, and Highway 17. In this area, numerous residential structures were damaged, including 2 homes that were destroyed, with both losing outer walls and another with collapsed brick on the exterior with the interior slab exposed. Large farming equipment was also blown over on the side. No injuries were reported in this area. The tornado was strongest just northeast of here at EF3 intensity, around 155mph, where Black Hawk Independent Church, Historic Blackhawk School and parsonage were completely destroyed. Both the school and church had stood for nearly 100 years. The church steeple was gone with the bell thrown out and not seen by the survey team. The slab to the church remained intact with a few exterior walls standing. A nearby well building made of cinder block masonry stood mostly untouched outside of minor damage to the roof and doorway. The tornado then continued to the northeast before crossing Highway 17 where widespread tree damage and some structural damage continued. It then continued northeast, just north of Highway 243, before crossing Highway 218 and Nebo Rd, where widespread tree damage occurred. Some areas beyond this were inaccessible due to fallen trees. Satellite imagery indicates potential EF2 to EF3 tree damage in the nearby wooded area. The tornado crossed CR 144, CR 163, CR 211, Good Hope Rd and Spring Lake Rd between Burkhead Lake, Spring Lake and Water Lake. In this area, the tornado was an estimated one half to three quarters of a mile wide and caused EF2 to EF3 tree damage to the forested areas. Some damage was noted to structures along these inaccessible areas. It then crossed Enon Rd, where damage was noted to a home, and Highway 35, where widespread tree damage, major roof, and minor siding damage occurred to a mobile home. One mobile home just north of Highway 35 was thrown off the blocks and into a nearby wooded area some 50 yards away. In this location, 3 fatalities occurred. An 18 wheeler tractor trailer was also blown over on the side. Just to the northeast, satellite imagery indicates a structure had major damage, with the majority of it destroyed. The tornado then crossed CR 278 and CR 61, with minor tree damage, but the majority of the more intense tree damage as viewed within satellite imagery occurred in inaccessible areas just to the north. It then crossed Gum Branch Rd before crossing Interstate 55, where ground surveys and satellite imagery indicated the tornado was nearly a half mile wide. The tornado then crossed Highway 51, Stafford Wells Rd and Highway 407, where major roof damage occurred to residential homes consistent with EF2 intensity. The tornado then crossed Highway 82, where numerous power lines were downed, causing high end EF1 to low end EF2 damage. The tornado then crossed the intersection of Bethlehem Community Rd and Bethlehem Church Rd, where EF2 damage occurred. Three outbuildings were destroyed. A home had major roof damage, and another structure moved off the foundation. The tornado then crossed Hammond Rd, causing major tree damage in the wooded areas. The tornado then caused low end EF2 damage just south of Robinson-Thompson Rd, where an outbuilding was destroyed and a nearby 100 year old home had minor to moderate roof and siding damage but was left standing. The tornado lifted as it crossed Robinson-Thompson Rd.",
            "datetime-end": "2023-03-25T02:42:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -90.041791607,
                    33.312330212
                ],
                [
                    -90.03870706599997,
                    33.31299817500002
                ],
                [
                    -90.03802956099997,
                    33.313657283
                ],
                [
                    -90.036835163,
                    33.315055392
                ],
                [
                    -90.034882515,
                    33.316496615
                ],
                [
                    -90.031979185,
                    33.318231596
                ],
                [
                    -90.031461519,
                    33.31902951
                ],
                [
                    -90.030778735,
                    33.320117934
                ],
                [
                    -90.028981655,
                    33.321104097
                ],
                [
                    -90.024378985,
                    33.322939676
                ],
                [
                    -90.023050027,
                    33.323471799
                ],
                [
                    -90.020898895,
                    33.324436633
                ],
                [
                    -90.019188987,
                    33.325470932
                ],
                [
                    -90.015664564,
                    33.327089031
                ],
                [
                    -90.006921323,
                    33.332255184
                ],
                [
                    -90.00620115,
                    33.332697777
                ],
                [
                    -90.005366983,
                    33.333215999
                ],
                [
                    -90.004300134,
                    33.333967276
                ],
                [
                    -90.00391859,
                    33.334243471
                ],
                [
                    -90.003484072,
                    33.334504539
                ],
                [
                    -90.003331857,
                    33.334622188
                ],
                [
                    -90.003196405,
                    33.334709584
                ],
                [
                    -90.002938913,
                    33.334861406
                ],
                [
                    -90.002695502,
                    33.335030034
                ],
                [
                    -90.001367138,
                    33.335651324
                ],
                [
                    -90.000544371,
                    33.336012107
                ],
                [
                    -89.99971825,
                    33.336421068
                ],
                [
                    -89.998291315,
                    33.337076521
                ],
                [
                    -89.997190268,
                    33.337604241
                ],
                [
                    -89.99656062,
                    33.337964455
                ],
                [
                    -89.995825695,
                    33.338373967
                ],
                [
                    -89.994473861,
                    33.33882101
                ],
                [
                    -89.994048061,
                    33.339113996
                ],
                [
                    -89.992350893,
                    33.340162125
                ],
                [
                    -89.989990549,
                    33.341751942
                ],
                [
                    -89.989281105,
                    33.342129506
                ],
                [
                    -89.988901572,
                    33.342395031
                ],
                [
                    -89.988552885,
                    33.342625825
                ],
                [
                    -89.98812239,
                    33.342834211
                ],
                [
                    -89.987796502,
                    33.343057162
                ],
                [
                    -89.987469272,
                    33.343236418
                ],
                [
                    -89.987014638,
                    33.343458246
                ],
                [
                    -89.985709743,
                    33.344088999
                ],
                [
                    -89.983864384,
                    33.344961738
                ],
                [
                    -89.982377099,
                    33.345906169
                ],
                [
                    -89.981392728,
                    33.346513377
                ],
                [
                    -89.980570631,
                    33.347055604
                ],
                [
                    -89.980004685,
                    33.347485798
                ],
                [
                    -89.979338156,
                    33.347923832
                ],
                [
                    -89.978353785,
                    33.348660979
                ],
                [
                    -89.976674722,
                    33.349791333
                ],
                [
                    -89.976169126,
                    33.350173343
                ],
                [
                    -89.975526737,
                    33.3506853
                ],
                [
                    -89.97338097,
                    33.351619586
                ],
                [
                    -89.971732752,
                    33.352605393
                ],
                [
                    -89.970182435,
                    33.353594549
                ],
                [
                    -89.968220399,
                    33.35434397
                ],
                [
                    -89.967047392,
                    33.354725016
                ],
                [
                    -89.966256141,
                    33.35491601
                ],
                [
                    -89.965790107,
                    33.355066677
                ],
                [
                    -89.9654783,
                    33.355234706
                ],
                [
                    -89.964649497,
                    33.355823366
                ],
                [
                    -89.963264136,
                    33.356639979
                ],
                [
                    -89.962792068,
                    33.356846091
                ],
                [
                    -89.962128564,
                    33.357117239
                ],
                [
                    -89.9616632,
                    33.357350234
                ],
                [
                    -89.961204543,
                    33.357572027
                ],
                [
                    -89.960223852,
                    33.35804803
                ],
                [
                    -89.958489804,
                    33.358790692
                ],
                [
                    -89.956790625,
                    33.359656562
                ],
                [
                    -89.952423989,
                    33.361744474
                ],
                [
                    -89.946086359,
                    33.364463254
                ],
                [
                    -89.944328842,
                    33.365256264
                ],
                [
                    -89.94334313,
                    33.36572613
                ],
                [
                    -89.942749021,
                    33.365987104
                ],
                [
                    -89.941176576,
                    33.366762739
                ],
                [
                    -89.939103533,
                    33.367766556
                ],
                [
                    -89.9375509,
                    33.368473593
                ],
                [
                    -89.93620943,
                    33.369121786
                ],
                [
                    -89.935023893,
                    33.369695232
                ],
                [
                    -89.933881272,
                    33.370333635
                ],
                [
                    -89.932215357,
                    33.370941344
                ],
                [
                    -89.930815244,
                    33.371443099
                ],
                [
                    -89.9297665,
                    33.371716375
                ],
                [
                    -89.928562188,
                    33.372068049
                ],
                [
                    -89.927903706,
                    33.372327883
                ],
                [
                    -89.927337048,
                    33.372633824
                ],
                [
                    -89.926533056,
                    33.373186527
                ],
                [
                    -89.925569472,
                    33.373878102
                ],
                [
                    -89.924434898,
                    33.37439944
                ],
                [
                    -89.922953648,
                    33.375250036
                ],
                [
                    -89.921516651,
                    33.375884105
                ],
                [
                    -89.920927906,
                    33.376162966
                ],
                [
                    -89.920477295,
                    33.376369032
                ],
                [
                    -89.919785285,
                    33.376643413
                ],
                [
                    -89.918685403,
                    33.377113432
                ],
                [
                    -89.912906099,
                    33.379459472
                ],
                [
                    -89.910379997,
                    33.380765179
                ],
                [
                    -89.908751972,
                    33.381452172
                ],
                [
                    -89.90808142,
                    33.381741095
                ],
                [
                    -89.907507427,
                    33.382146481
                ],
                [
                    -89.906359442,
                    33.382619055
                ],
                [
                    -89.905899443,
                    33.382813908
                ],
                [
                    -89.90540994,
                    33.383018838
                ],
                [
                    -89.904920437,
                    33.38321033
                ],
                [
                    -89.901898313,
                    33.384592864
                ],
                [
                    -89.899911408,
                    33.385165434
                ],
                [
                    -89.89330903,
                    33.387291233
                ],
                [
                    -89.883079458,
                    33.391661004
                ],
                [
                    -89.882190306,
                    33.392071942
                ],
                [
                    -89.881151892,
                    33.392548942
                ],
                [
                    -89.879726298,
                    33.393205092
                ],
                [
                    -89.878272748,
                    33.393886947
                ],
                [
                    -89.877544529,
                    33.394295635
                ],
                [
                    -89.873621236,
                    33.395725274
                ],
                [
                    -89.869825275,
                    33.3972283
                ],
                [
                    -89.867839367,
                    33.398174627
                ],
                [
                    -89.86607244,
                    33.398846889
                ],
                [
                    -89.863093177,
                    33.399716411
                ],
                [
                    -89.861563918,
                    33.400264151
                ],
                [
                    -89.860587594,
                    33.400569805
                ],
                [
                    -89.859694428,
                    33.400934918
                ],
                [
                    -89.85936988,
                    33.401067032
                ],
                [
                    -89.85901717,
                    33.401265201
                ],
                [
                    -89.857566061,
                    33.402068772
                ],
                [
                    -89.856694343,
                    33.402448313
                ],
                [
                    -89.854284598,
                    33.403575948
                ],
                [
                    -89.85354565,
                    33.403977874
                ],
                [
                    -89.852515346,
                    33.40452478
                ],
                [
                    -89.852291046,
                    33.404686557
                ],
                [
                    -89.851912184,
                    33.404913547
                ],
                [
                    -89.851219504,
                    33.405290276
                ],
                [
                    -89.850558339,
                    33.405611027
                ],
                [
                    -89.849613531,
                    33.405920581
                ],
                [
                    -89.848379715,
                    33.406429411
                ],
                [
                    -89.845901354,
                    33.407040675
                ],
                [
                    -89.844254478,
                    33.407514234
                ],
                [
                    -89.842608942,
                    33.408488212
                ],
                [
                    -89.841348304,
                    33.409162154
                ],
                [
                    -89.840713962,
                    33.409509198
                ],
                [
                    -89.839105977,
                    33.410018567
                ],
                [
                    -89.838576912,
                    33.410300118
                ],
                [
                    -89.837873502,
                    33.410550883
                ],
                [
                    -89.836989044,
                    33.411033938
                ],
                [
                    -89.836482777,
                    33.411594234
                ],
                [
                    -89.835713654,
                    33.41229194
                ],
                [
                    -89.835298247,
                    33.41249848
                ],
                [
                    -89.834980069,
                    33.412651566
                ],
                [
                    -89.834485872,
                    33.412850269
                ],
                [
                    -89.83387567,
                    33.413069681
                ],
                [
                    -89.833040162,
                    33.413343386
                ],
                [
                    -89.832145645,
                    33.413720639
                ],
                [
                    -89.831117018,
                    33.414030724
                ],
                [
                    -89.829828217,
                    33.414358718
                ],
                [
                    -89.828847869,
                    33.41465089
                ],
                [
                    -89.827880262,
                    33.41494418
                ],
                [
                    -89.826683326,
                    33.415421613
                ],
                [
                    -89.826135485,
                    33.415602959
                ],
                [
                    -89.825930967,
                    33.415667885
                ],
                [
                    -89.825701638,
                    33.415738409
                ],
                [
                    -89.824953302,
                    33.416017702
                ],
                [
                    -89.824217035,
                    33.416243823
                ],
                [
                    -89.823564588,
                    33.416558376
                ],
                [
                    -89.822727068,
                    33.416867891
                ],
                [
                    -89.821969344,
                    33.417106883
                ],
                [
                    -89.820591359,
                    33.417529455
                ],
                [
                    -89.819515793,
                    33.417912286
                ],
                [
                    -89.818459674,
                    33.418220677
                ],
                [
                    -89.817919879,
                    33.418332055
                ],
                [
                    -89.817076324,
                    33.418539141
                ],
                [
                    -89.816469475,
                    33.418700331
                ],
                [
                    -89.815666153,
                    33.418955549
                ],
                [
                    -89.814760237,
                    33.41907924
                ],
                [
                    -89.814164116,
                    33.419296957
                ],
                [
                    -89.813319891,
                    33.419461504
                ],
                [
                    -89.812479689,
                    33.419669706
                ],
                [
                    -89.810021444,
                    33.420853427
                ],
                [
                    -89.807480051,
                    33.422468633
                ],
                [
                    -89.801769628,
                    33.424735244
                ],
                [
                    -89.79758437,
                    33.426753411
                ],
                [
                    -89.796877608,
                    33.427125569
                ],
                [
                    -89.796469242,
                    33.427316964
                ],
                [
                    -89.793732718,
                    33.428413278
                ],
                [
                    -89.792280302,
                    33.42909434
                ],
                [
                    -89.791405901,
                    33.429412205
                ],
                [
                    -89.790135875,
                    33.429984134
                ],
                [
                    -89.788625792,
                    33.430726741
                ],
                [
                    -89.787267923,
                    33.431756979
                ],
                [
                    -89.785517112,
                    33.432580713
                ],
                [
                    -89.784108281,
                    33.433184518
                ],
                [
                    -89.783458516,
                    33.43341675
                ],
                [
                    -89.782820821,
                    33.433709976
                ],
                [
                    -89.782010123,
                    33.434091058
                ],
                [
                    -89.7806945,
                    33.43468422
                ],
                [
                    -89.778651327,
                    33.435838078
                ],
                [
                    -89.776852235,
                    33.436769211
                ],
                [
                    -89.77578941,
                    33.437303041
                ],
                [
                    -89.773683205,
                    33.438195549
                ],
                [
                    -89.772322655,
                    33.438723775
                ],
                [
                    -89.769084558,
                    33.439408673
                ],
                [
                    -89.766801328,
                    33.44038565
                ],
                [
                    -89.765816957,
                    33.440710188
                ],
                [
                    -89.764734686,
                    33.440902112
                ],
                [
                    -89.763840839,
                    33.441319532
                ],
                [
                    -89.76082752999997,
                    33.443276072
                ],
                [
                    -89.75812922799997,
                    33.444549553
                ],
                [
                    -89.75672643299998,
                    33.44561040000002
                ],
                [
                    -89.755275358,
                    33.44665333
                ],
                [
                    -89.75327711199998,
                    33.44722626499998
                ],
                [
                    -89.75096773000001,
                    33.44788647799999
                ],
                [
                    -89.748958755,
                    33.44879510200002
                ],
                [
                    -89.74716167499997,
                    33.449310954
                ],
                [
                    -89.74544774399999,
                    33.45084394700001
                ],
                [
                    -89.74324565,
                    33.452562656
                ],
                [
                    -89.74057417,
                    33.45318926099998
                ],
                [
                    -89.732732506,
                    33.458144376
                ],
                [
                    -89.72612622600002,
                    33.461186526
                ],
                [
                    -89.72027901000001,
                    33.46337157200003
                ],
                [
                    -89.717639716,
                    33.46493648
                ],
                [
                    -89.71582520200002,
                    33.465963514
                ],
                [
                    -89.71230882600003,
                    33.46742013800002
                ],
                [
                    -89.71071559400002,
                    33.467950423
                ],
                [
                    -89.706861259,
                    33.46978737799998
                ],
                [
                    -89.704645755,
                    33.47092175
                ],
                [
                    -89.69873722900002,
                    33.47409627500002
                ],
                [
                    -89.69336476500001,
                    33.476633365
                ],
                [
                    -89.68976523999999,
                    33.477890695999974
                ],
                [
                    -89.68636688100003,
                    33.47967710299997
                ],
                [
                    -89.68339767600003,
                    33.480917611
                ],
                [
                    -89.666089381,
                    33.48688611900002
                ],
                [
                    -89.66335084600001,
                    33.487458788000026
                ],
                [
                    -89.64889118299999,
                    33.492477205
                ],
                [
                    -89.64427216000001,
                    33.492841665000014
                ],
                [
                    -89.64319391200002,
                    33.49312350600002
                ],
                [
                    -89.64208616000002,
                    33.49337626800002
                ],
                [
                    -89.63989747699998,
                    33.49404284000002
                ],
                [
                    -89.633873236,
                    33.49652566399999
                ],
                [
                    -89.62884677599999,
                    33.49787664799999
                ],
                [
                    -89.608672469,
                    33.503956395
                ],
                [
                    -89.600228875,
                    33.506738623
                ],
                [
                    -89.592846392,
                    33.509826655
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T02:38:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2422023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 125,
            "path-length": 0.73,
            "wind": 90,
            "injuries": 1,
            "states": [
                "MS"
            ],
            "comments": "The short-lived tornado initially touched down just southwest of County Road 222. Numerous trees were snapped and uprooted at the beginning of the path. The tornado traveled northeast and damaged an outbuilding and patio at a residence. Numerous trees were uprooted on the same property. This tornado traveled up County Road 180 causing minor roof damage to several homes. The tornado lifted just north of the intersection of County Roads 180 and 222. A lone injury occurred in the same area as a tree fell on a moving vehicle with a male passenger inside. Peak winds were estimated at 90 mph.",
            "datetime-end": "2023-03-25T02:39:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -88.870617709,
                    34.472118319
                ],
                [
                    -88.858343921,
                    34.475090142
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T02:45:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2432023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 250,
            "path-length": 14.66,
            "wind": 100,
            "injuries": 0,
            "states": [
                "MS"
            ],
            "comments": "The tornado initially touched down just east of the Lee and Union County border at the intersection of County Roads 251 and 2250. A house sustained minor roof damage and had its carport destroyed. The majority of the track was highlighted by snapped and/or uprooted trees, outbuilding damage, and minor roof damage to several homes. The most significant damage occurred near the railroad tracks on Main Street in Guntown, where two large sheds were destroyed and an adjacent house had its wall shifted. The tornado then tracked northeastward to the north side of Five County Sportsman Lake where several trees were damaged. Intermittent damage continued into the northeast portion of the county before dissipating near the Prentiss and Lee County line. Peak winds were estimated at 100 mph.",
            "datetime-end": "2023-03-25T02:57:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -88.786215183,
                    34.402063837
                ],
                [
                    -88.543485996,
                    34.471153953
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T03:38:00Z",
            "f-scale": "3",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2442023USA",
            "countries": [
                "US"
            ],
            "fatalities": 2,
            "path-width": 1600,
            "path-length": 36.56,
            "wind": 155,
            "injuries": 55,
            "states": [
                "MS"
            ],
            "comments": "The tornado began near County Roads 173 and 182 southwest of Egypt in far eastern Chickasaw County. It traveled northeast across County Road 179, causing numerous snapped and uprooted trees. This tornado moved into Monroe County as it crossed Highway 45 near the intersection of Old Houston Road. Peak winds were estimated at 95 mph in Chickasaw County. This tornado crossed into Monroe County from Chickasaw County near the Highway 45 and Old Houston Road intersection, rapidly intensifying as it approached Egypt and Tumblin Roads. Several structures sustained significant damage, including the total destruction of a couple of single-wide, manufactured homes. Numerous trees and utility poles were heavily damaged in the area and roof damage was noted on several homes. Several injuries were reported in this area. The tornado continued to move northeast, crossing White Rock Road and causing widespread, significant tree damage, and roof damage to several homes in the path. The tornado strengthened further as it approached McAllister Road. Several homes in the area of McAllister and Herndon Roads suffered significant damage with missing roofs and collapsed walls. A single-wide, manufactured home on Herndon Road was separated from its frame and completely destroyed, resulting in 2 fatalities and multiple significant injuries. Tree damage was severe with many hardwood trees snapped or uprooted. Additional home and widespread, significant tree damage was observed along Whatley Road near the intersection with Highway 45 East south of New Wren. The tornado was nearly one mile wide at this point. One manufactured home was destroyed with debris blown 200 yards down to the highway. A church was destroyed and several homes suffered significant damage. Several homes sustained severe damage along Little Coontail Road, including the complete destruction of multiple manufactured homes. A boat was tossed more than 50 yards and an SUV was thrown into a tree. Some of this damage along Highway 45 East and Little Coontail Road was rated EF3. Farther east along Coontail Road, damage to homes was less significant and was generally confined to minor roof damage. However, severe tree damage continued. The tornado then moved into more wooded, wetland areas, crossing Highway 278 where it intersects with the Tennessee Tombigbee Waterway. Widespread, significant damage to homes and trees was observed all throughout the northern half of Amory. Several locations in Amory sustained damage rated as EF3. The tornado continued to cause damage to trees and homes as it moved across the Amory Golf Course, then affecting Myrtle and Elliott Roads. A few homes suffered significant roof damage to the south of Smithville near Parham Store Road and Williams Young Road and widespread tree damage continued. The tornado path began to narrow as the storm moved into northern Monroe County with tree damage found along Highway 23 and State Line Road. Peak winds were estimated at 155 mph in Monroe County. A tornado crossed from northern Monroe County into southern Itawamba County. Tree damage became more intermittent as the tornado moved into southern Itawamba County with additional trees down across State Line Road. The tornado finally lifted as it approached Wilson Road. Peak winds were estimated at 90 mph in Itawamba County.",
            "datetime-end": "2023-03-25T04:09:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -88.757587272,
                    33.852736471
                ],
                [
                    -88.747459251,
                    33.854375895
                ],
                [
                    -88.740335304,
                    33.85644295
                ],
                [
                    -88.73106559,
                    33.86178855
                ],
                [
                    -88.722053367,
                    33.867917759
                ],
                [
                    -88.693385918,
                    33.892572691
                ],
                [
                    -88.660426933,
                    33.918217657
                ],
                [
                    -88.632961113,
                    33.931891817
                ],
                [
                    -88.596568901,
                    33.942715637
                ],
                [
                    -88.568416435,
                    33.953538081
                ],
                [
                    -88.526531059,
                    33.976317675
                ],
                [
                    -88.489452202,
                    33.993967663
                ],
                [
                    -88.453746635,
                    34.012752333
                ],
                [
                    -88.392635185,
                    34.044619838
                ],
                [
                    -88.376842339,
                    34.05770481
                ],
                [
                    -88.355556328,
                    34.072494086
                ],
                [
                    -88.306804497,
                    34.089555427
                ],
                [
                    -88.214107353,
                    34.129351852
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T03:54:00Z",
            "f-scale": "2",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2452023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 300,
            "path-length": 3.82,
            "wind": 120,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "The tornado touched down near the intersection of Sweetwater Avenue and Huntsville Road in southeast Florence. The tornado nearly paralleled Sweetwater Creek as it tracked northward. Along Sweetwater Creek and Sweetwater Avenue, numerous trees were uprooted and snapped and structures and small outbuildings were damaged. There was also minor room damage to a single family home. As the tornado crossed Highway 43, more trees and minor structure damage was observed near Mall Road and north of Hough Road. The tornado approached Hunter Ridge subdivision northeast of Florence and south of Saint Florian along County Road 61, removing part of a roof at the back of the neighborhood. The tornado then moved northeast into the Plantation Springs subdivision, damaging roofs to two homes on the southeastern corner of Plantation Springs Drive around the Blackberry Trail Golf Course. The tornado then strengthened to its strongest and widest point between Cottonwood Trail and Karley Lane, producing the most widespread structure damage along its path here. About half of the roofs of several homes were destroyed, and the backside of the homes sustained severe damage as the tornado moved through the area. At this point, the tornado was about 100 yards wide, and produced peak winds of 120 mph at this location. The last house on the northeast corner of Plantation Springs Drive sustained the worst damage near the golf course, with more than half the roof destroyed and two rooms with walls collapsed at this location. The tornado lifted shortly after this point.",
            "datetime-end": "2023-03-25T04:02:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -87.655273046,
                    34.808577414
                ],
                [
                    -87.655219117,
                    34.810369437
                ],
                [
                    -87.654489557,
                    34.811408877
                ],
                [
                    -87.652622739,
                    34.813258695
                ],
                [
                    -87.65206484,
                    34.814474267
                ],
                [
                    -87.6510888,
                    34.819006679
                ],
                [
                    -87.640692273,
                    34.830327912
                ],
                [
                    -87.627721395,
                    34.851078963
                ],
                [
                    -87.624760237,
                    34.854547868
                ],
                [
                    -87.622614469,
                    34.855974127
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T04:14:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2462023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 120,
            "path-length": 4.07,
            "wind": 95,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "A National Weather Service and Lauderdale County Emergency Management Agency damage assessment team surveyed damage consistent with an EF-1 tornado near Anderson. Peak winds were estimated at 97 mph. The main damage indicators for this assessment were from uprooted or snapped trees and minor structural damage, mainly to roofs. The tornado touched down off County Road (CR) 49, near the West Fork of Anderson Creek and tracked east-northeast along Highway 64. Along Highway 64, between CR 508 and CR 93, numerous trees were uprooted with a couple of snapped trees that fell on at least one home. Near CR 508, one home sustained roof damage with greater than 20% loss of roofing materials. Additionally, a small garage was completely destroyed when the garage door caved in. The tornado began tracking more northeast as it passed CR 93. More trees were uprooted and sporadic limb damage was noted through CR 207 as the tornado lifted.",
            "datetime-end": "2023-03-25T04:18:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -87.290362263,
                    34.968497611
                ],
                [
                    -87.284525776,
                    34.971592312
                ],
                [
                    -87.276972676,
                    34.974757226
                ],
                [
                    -87.262724782,
                    34.974757226
                ],
                [
                    -87.244442845,
                    34.978343981
                ],
                [
                    -87.224358464,
                    34.987978211
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T04:44:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2472023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 275,
            "path-length": 5.19,
            "wind": 110,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "National Weather Service meteorologists surveyed damage in northeast Marion County and determined that it was consistent with an EF1 tornado, with maximum winds near 110 mph. The tornado touched down along the Horseshoe Bend area of Bear Creek. The tornado tracked eastward where it produced its most significant damage along Highway 172 and Highway 241, where numerous pine trees were snapped. Additional trees were uprooted as the tornado approached Highway 13, where it also caused damage to a house and barn on County Road 65. The tornado dissipated along the banks of the Upper Bear Creek Reservoir.",
            "datetime-end": "2023-03-25T04:49:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -87.765998017,
                    34.278358837
                ],
                [
                    -87.761482057,
                    34.279357681
                ],
                [
                    -87.75659151,
                    34.28006411
                ],
                [
                    -87.75364108,
                    34.280445311
                ],
                [
                    -87.750765752,
                    34.280826511
                ],
                [
                    -87.743598889,
                    34.281101329
                ],
                [
                    -87.736013602,
                    34.282714756
                ],
                [
                    -87.725239129,
                    34.286242412
                ],
                [
                    -87.705602925,
                    34.286990692
                ],
                [
                    -87.676623249,
                    34.287051222
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T04:59:00Z",
            "f-scale": "2",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2482023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 300,
            "path-length": 3.96,
            "wind": 120,
            "injuries": 0,
            "states": [
                "TN"
            ],
            "comments": "The tornado formed on Amana Avenue with minor roof and shingle damage to single family homes. It tracked due east into the Fairgrounds where it uplifted reinforced roofing to horse stalls, and destroyed a large outdoor shed approximately 80 ft. by 30 ft. that had several 4x4 support beams anchored with concrete snapped near the base. The tornado then rolled a large horse trailer next to the building approximately 80 yards. It continued to snap trees and power lines heading east. As it approached Hedgemont Avenue, several residential and commercial structures had roofing and siding damage. The tornado crossed Main Avenue South and snapped several bradford pear trees, then crossed Highway 231. At the Lincoln Medical Center, power poles were snapped, debris collided with the front of the building, several cars were lifted and had their windows blown out, and an exterior wall was disconnected but not collapsed. The HVAC system was also toppled on the roof. After damaging Lincoln Medical Center, the tornado went through open fields and wooded areas where numerous trees were snapped and uprooted. Before lifting, an awning that was reinforced with 4x4s in concrete was flipped. Just west of Winchester Highway, the tornado lifted.",
            "datetime-end": "2023-03-25T05:05:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -86.589845416,
                    35.135001953
                ],
                [
                    -86.579288241,
                    35.145424826
                ],
                [
                    -86.571106568,
                    35.148499874
                ],
                [
                    -86.563939705,
                    35.149973652
                ],
                [
                    -86.555270806,
                    35.149482395
                ],
                [
                    -86.54205288,
                    35.151587759
                ],
                [
                    -86.528792038,
                    35.148991136
                ],
                [
                    -86.519608155,
                    35.150675442
                ],
                [
                    -86.511454239,
                    35.149728024
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T05:00:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "Park/Forest Service": null
                }
            ],
            "id": "RV2492023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 130,
            "path-length": 2.76,
            "wind": 95,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "An official from the Bankhead National Forest reported tornado damage to the National Weather Service (NWS) in a remote area. After reviewing high resolution satellite data through the United States Geological Survey (USGS), the NWS has determined an EF-1 tornado occurred. Damage indicators were mostly noted as hard wood tree uproots. Satellite imagery showed large swath of trees uprooted as evidenced by Worldview (35 cm) imagery. Tree fall patterns indicates convergence and falls partly perpendicular to storm track. Based on this information, the tornado touched down near Northwest Road and Thompson Creek and lifted near Braziel Creek.",
            "datetime-end": "2023-03-25T05:06:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -87.472984192,
                    34.339989262
                ],
                [
                    -87.458221313,
                    34.339705778
                ],
                [
                    -87.453243134,
                    34.341123187
                ],
                [
                    -87.445775864,
                    34.342398835
                ],
                [
                    -87.43539035,
                    34.343957933
                ],
                [
                    -87.42534816,
                    34.344524871
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T05:23:00Z",
            "f-scale": "2",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2502023USA",
            "countries": [
                "US"
            ],
            "fatalities": 1,
            "path-width": 175,
            "path-length": 13.53,
            "wind": 115,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "The tornado likely first touched down between County Road 203 and Highway 157 in far eastern Lawrence County. Minor roof damage to chicken houses was noted at this location before the tornado crossed the highway. Sporadic tree damage was observed near the Highway 36 and CR 200 intersection. Peak wind speeds of 74 mph were estimated. The tornado then moved into Morgan County toward Danville. A tornado tracked out of far east central Lawrence County into Morgan County. Minor damage was noted around Danville High School with the football scoreboard partially destroyed. The tornado intensified as it tracked east-northeast toward Targum Road. Uprooted trees, minor damage to a home, and a destroyed carport were observed. Tracking east, the tornado uprooted and snapped a significant number of trees along Iron Man Road and Forest Chapel Road. While there was heavy structural damage to single-family homes, the bulk of the damage was due to trees falling on houses. The tornado remained on the ground uprooting trees and tracking toward Vaughn Bridge Road. Near the Vaughn Bridge and Vest Road intersection, the tornado lifted and snapped the anchoring system of a single-wide mobile home. This caused the unit to overturn and roll, destroying the home. One fatality was reported at this location. Given the degree of damage, and strapping of anchors to the I-beam, the damage indicator held consistent with expected wind speed values. As the tornado tracked east, numerous trees were uprooted causing structural damage along Highway 31 and further east on Sparkman Street and through Bethel Road. The tornado likely lifted before the Bethel Road and I-65 intersection.",
            "datetime-end": "2023-03-25T05:29:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -87.134841827,
                    34.401569149
                ],
                [
                    -87.117074874,
                    34.407340677
                ],
                [
                    -87.093342689,
                    34.41555468
                ],
                [
                    -87.065018561,
                    34.423413876
                ],
                [
                    -87.038711455,
                    34.428051162
                ],
                [
                    -87.017637339,
                    34.439121202
                ],
                [
                    -87.011757937,
                    34.441173998
                ],
                [
                    -87.008067218,
                    34.443757618
                ],
                [
                    -87.005470839,
                    34.444819356
                ],
                [
                    -87.002295104,
                    34.444235401
                ],
                [
                    -86.999674585,
                    34.444421206
                ],
                [
                    -86.975641993,
                    34.45149915
                ],
                [
                    -86.965235022,
                    34.457107995
                ],
                [
                    -86.962190715,
                    34.456957605
                ],
                [
                    -86.961182204,
                    34.457205306
                ],
                [
                    -86.960881797,
                    34.457576856
                ],
                [
                    -86.960002032,
                    34.458001483
                ],
                [
                    -86.958263961,
                    34.458549956
                ],
                [
                    -86.950925437,
                    34.458585341
                ],
                [
                    -86.944187728,
                    34.458939192
                ],
                [
                    -86.927236167,
                    34.46024843
                ],
                [
                    -86.91390827,
                    34.464697914
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T05:24:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2512023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 240,
            "path-length": 15.26,
            "wind": 90,
            "injuries": 0,
            "states": [
                "TN"
            ],
            "comments": "A National Weather Service and Franklin County Emergency Management Agency damage assessment determined the sporadic damage in northern Franklin County was caused by an EF-1 tornado with a peak wind speed of 88 mph.\nThe tornado touched down west of Estill Springs near the Harris Chapel and Eastbrook Drive area. Here, several uprooted trees or downed large branches were observed. Minor structural damage to a single family home roof was noted too. The tornado tracked east, likely lifting at times, across Tims Ford Lake. Tree damage and minor roof damage to small farm buildings occurred along Cobb Road and adjacent to Peabody Road. As the tornado tracked east, again ascending at times, toward the Highway 64 and Old Alto Highway corridor, more tree uproots were noted. Softwood tree snaps were observed near the Highway 64 and Yellow Branch Road area, which prompted the EF-1 rating. Only minor limb damage was observed further east on Highway 64 heading toward the county line.",
            "datetime-end": "2023-03-25T05:39:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -86.170792212,
                    35.225809452
                ],
                [
                    -86.16306745,
                    35.229315067
                ],
                [
                    -86.160320868,
                    35.231137927
                ],
                [
                    -86.153969397,
                    35.234783524
                ],
                [
                    -86.148476233,
                    35.236466052
                ],
                [
                    -86.144699682,
                    35.238008339
                ],
                [
                    -86.140236486,
                    35.239410392
                ],
                [
                    -86.136288275,
                    35.241092824
                ],
                [
                    -86.132340063,
                    35.242354625
                ],
                [
                    -86.123585333,
                    35.245999718
                ],
                [
                    -86.115860571,
                    35.247121252
                ],
                [
                    -86.085991491,
                    35.249504461
                ],
                [
                    -86.067452063,
                    35.24992502
                ],
                [
                    -86.027111639,
                    35.253850131
                ],
                [
                    -85.989174475,
                    35.266465273
                ],
                [
                    -85.973896612,
                    35.269408524
                ],
                [
                    -85.966000189,
                    35.271650929
                ],
                [
                    -85.912467898,
                    35.280250814
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T05:33:00Z",
            "f-scale": "2",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2522023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 125,
            "path-length": 4.94,
            "wind": 120,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "A tornado touched down on Highway 55 in Falkville and tracked generally northeastward. Initially, the tornado snapped trees and a small power pole in a yard on Highway 55. Farther to the northeast, the tornado did considerable roof damage to a barn at a residence on Chappell Road, and uprooted trees near the intersection of Chappell Road and Bert Stinson Road. The tornado then tracked along a largely wooded area, before snapping and uprooting trees on Nature Trail. There, the tornado also created roof damage to a small log cabin style home.\nFarther to the northeast, in a heavily wooded area to the north of Nature Trail, the tornado uprooted and snapped a long swath of trees nearly continuously before emerging into an open field, where it continued to snap and uproot trees along its path. In the open field, the tornado completely destroyed a large pole barn that contained 4x4 posts, some of which were anchored into the ground with cement. The walls of the barn were made of exterior metal sheeting with 2x4 wooden studs, which were toe-nailed into the 4x4 posts, and accompanied by a metal truss system. The barn contained 10,500lb hay bales which were blown downstream. A very large, old oak tree was uprooted adjacent to the barn. The width at its base was estimated to be 5 feet.\nThe tornado continued to track generally to the northeast, snapping and uprooting trees along Wilson Mountain Road, which continued along the northeast adjacent and along Blankenship Narrell Drive. On Cottonwood Lane, trees were uprooted and snapped. One tree fell on an RV at a residence. From there, the tornado moved into a largely inaccessible heavily wooded area.",
            "datetime-end": "2023-03-25T05:36:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -86.871327833,
                    34.36701716
                ],
                [
                    -86.79871507,
                    34.405974476
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T05:47:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2532023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 325,
            "path-length": 2.09,
            "wind": 95,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "A National Weather Service damage survey assessed tornado damage in northeastern Morgan County. Damage was consistent with an EF-1 tornado with a peak wind speed of 94 mph.\nMany damage indicators were in the form of uprooted trees and minor structural damage. The tornado touched down near the Highway 32 and Crisco Circle intersection. Tracking east-northeast, numerous trees were uprooted along Rescue Road. Near Rescue Road and Highway 231, an unanchored shed was destroyed. The tornado crossed the highway and uprooted many more trees along Old Silo Road and also damaged the roof to chicken houses. The tornado lifted just west of the Morgan-Marshall County line.",
            "datetime-end": "2023-03-25T05:50:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -86.600327003,
                    34.47584726
                ],
                [
                    -86.598267067,
                    34.475776505
                ],
                [
                    -86.594061363,
                    34.475564237
                ],
                [
                    -86.590628136,
                    34.475918016
                ],
                [
                    -86.587538231,
                    34.476059528
                ],
                [
                    -86.579040993,
                    34.477616137
                ],
                [
                    -86.576981056,
                    34.478252923
                ],
                [
                    -86.57620858,
                    34.478323677
                ],
                [
                    -86.575521934,
                    34.478252923
                ],
                [
                    -86.572861183,
                    34.478040662
                ],
                [
                    -86.564192283,
                    34.478960458
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "datetime-start": "2023-03-25T06:28:00Z",
            "f-scale": "1",
            "scale": "EF",
            "source": [
                {
                    "NWS Storm Survey": null
                }
            ],
            "id": "RV2542023USA",
            "countries": [
                "US"
            ],
            "fatalities": 0,
            "path-width": 250,
            "path-length": 8.51,
            "wind": 90,
            "injuries": 0,
            "states": [
                "AL"
            ],
            "comments": "Aerial surveillance provided by Jackson County Emergency Management Agency (EMA), supplemented by a ground survey of National Weather Service personnel and DeKalb County EMA confirmed an EF-1 tornado near the Flat Rock area.\nThe tornado touched down southwest of CR 81, north of Flat Rock near Fabius Poultry. Multiple chicken houses sustained roof damage at this location. The tornado tracked east toward CR 81 where numerous softwood trees were uprooted. The final damage point was east of Highway 117 where a possible ground scar was noted. Damage was then reported along and between Highway 71 and CR 326 to the county line. Uprooted trees and minor structure damage was observed in this location. The tornado tracked from Jackson into DeKalb County where it caused minor roof damage to a single-family home and uprooted several trees. As it tracked east to Highway 75, power poles were tilted, and additional trees were uprooted before the tornado lifted just east of Highway 75.",
            "datetime-end": "2023-03-25T06:36:00Z"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    -85.739261291,
                    34.785636147
                ],
                [
                    -85.738681934,
                    34.785636147
                ],
                [
                    -85.737952373,
                    34.785671393
                ],
                [
                    -85.737501762,
                    34.785741885
                ],
                [
                    -85.736943862,
                    34.785865246
                ],
                [
                    -85.736836574,
                    34.785865246
                ],
                [
                    -85.736579082,
                    34.785953361
                ],
                [
                    -85.735849521,
                    34.78600623
                ],
                [
                    -85.735227249,
                    34.786041475
                ],
                [
                    -85.734218738,
                    34.786111967
                ],
                [
                    -85.733746669,
                    34.786111967
                ],
                [
                    -85.733038566,
                    34.786147213
                ],
                [
                    -85.732223174,
                    34.786059098
                ],
                [
                    -85.730120323,
                    34.786076721
                ],
                [
                    -85.729197643,
                    34.785900492
                ],
                [
                    -85.72829642,
                    34.785882869
                ],
                [
                    -85.721515796,
                    34.78519557
                ],
                [
                    -85.719069621,
                    34.784631629
                ],
                [
                    -85.718833587,
                    34.784490643
                ],
                [
                    -85.693225132,
                    34.785388947
                ],
                [
                    -85.65677284,
                    34.788744312
                ],
                [
                    -85.643115465,
                    34.794205538
                ],
                [
                    -85.631442491,
                    34.794628446
                ],
                [
                    -85.591617052,
                    34.793853114
                ]
            ]
        }
    }
  ],
};

//console.log(geojsonObject);
//console.log(ta_data);

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(ta_data),
});

var feat = new Feature;

vectorSource.getFeatures().forEach(e => {
  e.getGeometry().transform("EPSG:4326", "EPSG:3857");
  //isolate the EF-4 for now
  if(e.get("f-scale") == '4'){
    feat = e;
  }
});

var start = feat.get('datetime-start');
var end = feat.get('datetime-end');
var firstcoord = feat.getGeometry().getFirstCoordinate();
var lastcoord = feat.getGeometry().getLastCoordinate();

// console.log("starttime", start);
// console.log("endtime", end);
//console.log("startcoords", firstcoord);
//console.log("endcoords", lastcoord);

//ISO-8601 to miliseconds to minutes
var duration = (Date.parse(end) - Date.parse(start))/60000;
console.log(duration);

var pointtime1 = (Date.parse("2023-03-25T01:19:00Z")-Date.parse(start))/60000;
var pointtime2 = (Date.parse("2023-03-25T01:27:00Z")-Date.parse(start))/60000;
var pointtime3 = (Date.parse("2023-03-25T01:37:00Z")-Date.parse(start))/60000;
var pointtime4 = (Date.parse("2023-03-25T01:42:00Z")-Date.parse(start))/60000;
var pointtime5 = (Date.parse("2023-03-25T01:48:00Z")-Date.parse(start))/60000;
var pointtime6 = (Date.parse("2023-03-25T01:51:00Z")-Date.parse(start))/60000;
var pointtime7 = (Date.parse("2023-03-25T02:05:00Z")-Date.parse(start))/60000;

var t1 = pointtime1/duration;
var p1 = [((1-t1)*firstcoord[0]+(t1*lastcoord[0])),((1-t1)*firstcoord[1]+(t1*lastcoord[1]))];

var t2 = pointtime2/duration;
var p2 = [((1-t2)*firstcoord[0]+(t2*lastcoord[0])),((1-t2)*firstcoord[1]+(t2*lastcoord[1]))];

var t3 = pointtime3/duration;
var p3 = [((1-t3)*firstcoord[0]+(t3*lastcoord[0])),((1-t3)*firstcoord[1]+(t3*lastcoord[1]))];

var t4 = pointtime4/duration;
var p4 = [((1-t4)*firstcoord[0]+(t4*lastcoord[0])),((1-t4)*firstcoord[1]+(t4*lastcoord[1]))];

var t5 = pointtime5/duration;
var p5 = [((1-t5)*firstcoord[0]+(t5*lastcoord[0])),((1-t5)*firstcoord[1]+(t5*lastcoord[1]))];

var t6 = pointtime6/duration;
var p6= [((1-t6)*firstcoord[0]+(t6*lastcoord[0])),((1-t6)*firstcoord[1]+(t6*lastcoord[1]))];

var t7 = pointtime7/duration;
var p7= [((1-t7)*firstcoord[0]+(t7*lastcoord[0])),((1-t7)*firstcoord[1]+(t7*lastcoord[1]))];

// var why = feat.getGeometry().getClosestPoint(p1);
// console.log(why);
// console.log(transform(why, "EPSG:3857", "EPSG:4326"));
// console.log(why);

// const points = {
//     'type': 'FeatureCollection',
//   'crs': {
//     'type': 'name',
//     'properties': {
//       'name': 'EPSG:4326',
//     },
//     },
//     'features': [
//         {
//             'type': 'Feature',
//             'properties': {
//                 'occurance': 0,
//             },
//             'geometry': {
//               'type': 'Point',
//               'coordinates': firstcoord,
//             },
//           },
//           {
//             'type': 'Feature',
//             'properties': {
//                 'occurance': 0,
//             },
//             'geometry': {
//               'type': 'Point',
//               'coordinates': lastcoord,
//             },
//           },
//           {
//             'type': 'Feature',
//             'properties': {
//                 'occurance': 0,
//             },
//             'geometry': {
//               'type': 'Point',
//               'coordinates': feat.getGeometry().getCoordinates()[49],
//             },
//           },
//           {
//             'type': 'Feature',
//             'properties': {
//                 'occurance': 0,
//             },
//             'geometry': {
//               'type': 'Point',
//               'coordinates': feat.getGeometry().getCoordinates()[50],
//             },
//           },
//         //   {
//         //     'type': 'Feature',
//         //     'properties': {
//         //         'occurance': 0,
//         //     },
//         //     'geometry': {
//         //       'type': 'Point',
//         //       'coordinates': p,
//         //     },
//         //   },
//           {
//             'type': 'Feature',
//             'properties': {
//                 'occurance': 0,
//             },
//             'geometry': {
//               'type': 'Point',
//               'coordinates': feat.getGeometry().getClosestPoint(p),
//             },
//           },
//     ],
// };

const points = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties': {
        'name': 'EPSG:4326',
        },
        },
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'id': "1",
                    'occurance': "2023-03-25T01:19:00Z",
                    'description': "Beginning of available WTVA Footage.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p1),
                },
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': "2",
                    'occurance': "2023-03-25T01:27:00Z",
                    'description': "Focus on EF4 in Rolling Fork. Referred to as Ongoing Threat. Warning of Storm Arrival Time Directed to Winona, Grenada, Eupora, Bruce, MS area.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p2),
                },
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': "3",
                    'occurance': "2023-03-25T01:37:00Z",
                    'description': "Check on EF4, referred to as 'Near Belzoni', not expected to reach Winona, MS but caution advised. Visible Debris signature over Silver City, MS. Extended time estimates provided.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p3),
                },
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': "4",
                    'occurance': "2023-03-25T01:42:00Z",
                    'description': "Upgrade from lead warning to tornado emergency. First confirmed injury report from Rolling Fork, MS. Field Meteorologists rerouted to more effective positions.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p4),
                },
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': "5",
                    'occurance': "2023-03-25T01:48:00Z",
                    'description': "Live storm chaser footage, with appropriate disclaimers. Reassessment of EF4 movement speed in line with NWS reports. Was 60mph, may have decreased to 45mph.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p5),
                },
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': "6",
                    'occurance': "2023-03-25T01:51:00Z",
                    'description': "Tornado speed reassessment confirmed. Actual wind speeds closest to 50-55mph. Estimated arrival times adjusted accordingly.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p6),
                },
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': "7",
                    'occurance': "2023-03-25T02:05:00Z",
                    'description': "Wider map zoom. Focus on confirmed damage from Silver City. Emphasis on Tornado Safety Procedures given to Winona and Kilmichael, MS.",
                },
                'geometry': {
                'type': 'Point',
                'coordinates': feat.getGeometry().getClosestPoint(p7),
                },
            },
        ]
}

//source for the tornado track lines
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction,
});

// source and layer for the points
const pointSource = new VectorSource({
    features: new GeoJSON().readFeatures(points),
    style: styles['Point'],
});

const pointLayer = new VectorLayer({
    source: pointSource,
    style: function () {
        return styles['Point'];
    },
});

//popup overlay 
const overlay = new Overlay({
    element: container,
    autoPan: {
        animation: {
            duration: 250,
        },
    },
});

//close popup button
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    popupinteract.getFeatures().clear();
    return false;
};

//triggers the listener for the selected point
const popupinteract = new Select({
    condition: singleClick,
    layers: [pointLayer],
    style: function () {
        return styles['Point'];
    },
});

//add event listener to make the popup show up
popupinteract.on('select', function(evt){
    const feat = evt.selected[0];
    const coordinate = feat.getGeometry().getCoordinates();
    const pid = feat.get('id');
    const occur = feat.get('occurance');
    const desc = feat.get('description');

    content.innerHTML = "<p><b>Point ID: </b>" + pid + "<br>" +
                        "<b>Time of Point: </b>" + occur + "<br>" +
                        "<b>Description: </b>" + desc + "</p>";
    overlay.setPosition(coordinate);
})

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
    pointLayer,
  ],
  overlays: [overlay],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

// Auto-zooms the map to our area of interest upon page loading
// Just here for convenience
var ex2 = [-10299995.651937777,
           3834271.01815915, 
           -9398015.226401512, 
           4202031.631136171];

map.getView().fit(ex2, map.getSize());

// map.on('singleclick', function(evt){
//     console.log("map", evt);
// })

map.addInteraction(popupinteract);

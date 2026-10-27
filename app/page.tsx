'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {Map as MapLibreMap, GeoJSONSource} from 'maplibre-gl';

type Place = {
  id: number; name: string; bn: string; area: string; kind: string;
  lat: number; lng: number; desc: string; icon: string; hours?: string;
};
const places: Place[] = [
  {id:1,name:'Lalbagh Fort',bn:'লালবাগ কেল্লা',area:'Old Dhaka',kind:'Heritage',lat:23.7195,lng:90.388,desc:'A Mughal-era fort complex and one of Dhaka’s best-known historic landmarks.',icon:'⌂'},
  {id:2,name:'Ahsan Manzil',bn:'আহসান মঞ্জিল',area:'Old Dhaka',kind:'Heritage',lat:23.7089,lng:90.4062,desc:'The pink palace beside the Buriganga, layered with stories of old Dhaka.',icon:'◇'},
  {id:3,name:'Sadarghat Riverfront',bn:'সদরঘাট',area:'Old Dhaka',kind:'Riverside',lat:23.7064,lng:90.4071,desc:'A lively river terminal on the Buriganga. Expect crowds and changing conditions.',icon:'≈'},
  {id:4,name:'Star Mosque',bn:'তারা মসজিদ',area:'Old Dhaka',kind:'Culture',lat:23.7104,lng:90.4025,desc:'A distinctive mosque known for decorative star motifs and tilework.',icon:'✳'},
  {id:40,name:'Central Shaheed Minar',bn:'কেন্দ্রীয় শহীদ মিনার',area:'University Area',kind:'Heritage',lat:23.7276,lng:90.3967,desc:'A national monument commemorating the language martyrs of the 1952 Bengali Language Movement, designed by Hamidur Rahman.',icon:'✦'},
  {id:5,name:'National Museum',bn:'জাতীয় জাদুঘর',area:'Shahbagh',kind:'Culture',lat:23.7389,lng:90.3948,desc:'Collections spanning archaeology, history, art and cultural heritage.',icon:'▤'},
  {id:6,name:'Ramna Park',bn:'রমনা পার্ক',area:'Ramna',kind:'Parks',lat:23.7382,lng:90.3995,desc:'A green public park near central Dhaka, popular for walks and quiet breaks.',icon:'♧'},
  {id:7,name:'Hatirjheel',bn:'হাতিরঝিল',area:'Central Dhaka',kind:'Outdoors',lat:23.7621,lng:90.4074,desc:'An urban lake and waterfront network with bridges and city views.',icon:'≈'},
  {id:8,name:'Jatiya Sangsad Bhaban',bn:'জাতীয় সংসদ ভবন',area:'Sher-e-Bangla Nagar',kind:'Architecture',lat:23.7625,lng:90.3783,desc:'Louis Kahn’s celebrated parliamentary complex. Access rules may vary.',icon:'▦'},
  {id:9,name:'Dhanmondi Lake',bn:'ধানমন্ডি লেক',area:'Dhanmondi',kind:'Parks',lat:23.7465,lng:90.376,desc:'A popular neighbourhood lake with walking paths and nearby cafés.',icon:'♧'},
  {id:10,name:'Gulshan Lake Park',bn:'গুলশান লেক পার্ক',area:'Gulshan',kind:'Parks',lat:23.7925,lng:90.4147,desc:'A green corridor and walking spot around Gulshan Lake.',icon:'♧'},
  {id:11,name:'Bashundhara City',bn:'বসুন্ধরা সিটি',area:'Panthapath',kind:'Shopping',lat:23.7514,lng:90.3915,desc:'A major shopping and entertainment complex in central Dhaka.',icon:'▣'},
  {id:12,name:'Curzon Hall',bn:'কার্জন হল',area:'University Area',kind:'Architecture',lat:23.7289,lng:90.4,desc:'An iconic early-20th-century building within the University of Dhaka area.',icon:'⌂'},
  {id:13,name:'Baitul Mukarram',bn:'বায়তুল মোকাররম',area:'Paltan',kind:'Culture',lat:23.7288,lng:90.4125,desc:'Bangladesh’s national mosque in the heart of the city.',icon:'✧'},
  {id:14,name:'Botanical Garden',bn:'জাতীয় উদ্ভিদ উদ্যান',area:'Mirpur',kind:'Parks',lat:23.8114,lng:90.3485,desc:'A large botanical garden in Mirpur; confirm opening times before travel.',icon:'♧'},
  {id:15,name:'Uttara Sector 7 Park',bn:'উত্তরা সেক্টর ৭ পার্ক',area:'Uttara',kind:'Parks',lat:23.87,lng:90.3958,desc:'A neighbourhood green space in northern Dhaka.',icon:'♧'},
  {id:16,name:'Narayanganj Riverfront',bn:'নারায়ণগঞ্জ নদীতীর',area:'Narayanganj',kind:'Riverside',lat:23.616,lng:90.5,desc:'A riverfront starting point for exploring the wider metropolitan region.',icon:'≈'},
  {id:17,name:'Suhrawardy Udyan',bn:'সোহরাওয়ার্দী উদ্যান',area:'Shahbagh',kind:'Heritage',lat:23.7337,lng:90.3968,desc:'A historic public ground closely connected with Bangladesh’s independence movement.',icon:'♧'},
  {id:18,name:'Dhakeshwari National Temple',bn:'ঢাকেশ্বরী জাতীয় মন্দির',area:'Old Dhaka',kind:'Culture',lat:23.7214,lng:90.3854,desc:'A major Hindu temple complex and an important part of Dhaka’s religious heritage.',icon:'✧'},
  {id:19,name:'Armenian Church',bn:'আর্মেনীয় গির্জা',area:'Old Dhaka',kind:'Heritage',lat:23.7107,lng:90.4073,desc:'A historic church in Armanitola that reflects the Armenian community’s legacy in Dhaka.',icon:'⌂'},
  {id:20,name:'Hussaini Dalan',bn:'হোসেনি দালান',area:'Old Dhaka',kind:'Culture',lat:23.7187,lng:90.3909,desc:'A historic imambara and an important centre of Shia Muslim heritage in the city.',icon:'✧'},
  {id:21,name:'Bangladesh Shilpakala Academy',bn:'বাংলাদেশ শিল্পকলা একাডেমি',area:'Segunbagicha',kind:'Culture',lat:23.7367,lng:90.4062,desc:'A national venue for visual arts, theatre, music and cultural programmes.',icon:'▤'},
  {id:22,name:'Bangladesh Liberation War Museum',bn:'মুক্তিযুদ্ধ জাদুঘর',area:'Agargaon',kind:'Heritage',lat:23.7777,lng:90.3754,desc:'A museum documenting the 1971 Liberation War and its historical context.',icon:'▤'},
  {id:23,name:'Bangladesh Air Force Museum',bn:'বাংলাদেশ বিমান বাহিনী জাদুঘর',area:'Agargaon',kind:'Culture',lat:23.7764,lng:90.3857,desc:'An aviation museum featuring aircraft and exhibits about Bangladesh’s air force.',icon:'▤'},
  {id:24,name:'Bangladesh Military Museum',bn:'বাংলাদেশ সামরিক জাদুঘর',area:'Sher-e-Bangla Nagar',kind:'Culture',lat:23.7639,lng:90.3781,desc:'A museum exploring military history through exhibits and outdoor displays.',icon:'▤'},
  {id:25,name:'Chandrima Udyan',bn:'চন্দ্রিমা উদ্যান',area:'Sher-e-Bangla Nagar',kind:'Parks',lat:23.7612,lng:90.3787,desc:'A landscaped public park beside the National Parliament complex.',icon:'♧'},
  {id:26,name:'Bangladesh National Zoo',bn:'বাংলাদেশ জাতীয় চিড়িয়াখানা',area:'Mirpur',kind:'Outdoors',lat:23.8127,lng:90.3445,desc:'A large zoological park in Mirpur; check current visitor guidance before going.',icon:'♧'},
  {id:27,name:'Jamuna Future Park',bn:'যমুনা ফিউচার পার্ক',area:'Baridhara',kind:'Shopping',lat:23.8104,lng:90.4246,desc:'A major shopping and entertainment destination in the Bashundhara area.',icon:'▣'},
  {id:28,name:'Justice Shahabuddin Ahmed Park',bn:'বিচারপতি শাহাবুদ্দিন আহমেদ পার্ক',area:'Gulshan',kind:'Parks',lat:23.7939,lng:90.4168,desc:'A landscaped neighbourhood park in Gulshan, suited to a short outdoor break.',icon:'♧'},
  {id:29,name:'Banani Lake Park',bn:'বনানী লেক পার্ক',area:'Banani',kind:'Parks',lat:23.7948,lng:90.4054,desc:'A green waterside stretch in the Banani area; paths and access may vary.',icon:'♧'},
  {id:30,name:'National Museum of Science and Technology',bn:'জাতীয় বিজ্ঞান ও প্রযুক্তি জাদুঘর',area:'Agargaon',kind:'Culture',lat:23.7772,lng:90.3781,desc:'A science museum in Agargaon with exhibits for visitors and students; confirm current access details.',icon:'▤'},
  {id:31,name:'Baldha Garden',bn:'বলধা গার্ডেন',area:'Wari',kind:'Parks',lat:23.7168,lng:90.4193,desc:'A historic botanical garden in old Dhaka with a notable collection of plants.',icon:'♧'},
  {id:32,name:'TSC, University of Dhaka',bn:'ঢাকা বিশ্ববিদ্যালয় টিএসসি',area:'University Area',kind:'Culture',lat:23.7335,lng:90.3933,desc:'A well-known student and cultural gathering point at the University of Dhaka.',icon:'▤'},
  {id:33,name:'Dhaka University Central Mosque',bn:'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদ',area:'University Area',kind:'Culture',lat:23.7324,lng:90.3947,desc:'A prominent mosque within the University of Dhaka campus.',icon:'✧'},
  {id:34,name:'National Martyrs’ Memorial',bn:'জাতীয় স্মৃতিসৌধ',area:'Savar',kind:'Heritage',lat:23.9105,lng:90.2637,desc:'The national memorial honouring those who died in the Bangladesh Liberation War.',icon:'⌂'},
  {id:35,name:'Fantasy Kingdom',bn:'ফ্যান্টাসি কিংডম',area:'Ashulia',kind:'Outdoors',lat:23.8896,lng:90.3252,desc:'An amusement park in Ashulia; check rides, ticketing and opening times before travelling.',icon:'♧'},
  {id:36,name:'Tongi Riverfront',bn:'টঙ্গী নদীতীর',area:'Tongi',kind:'Riverside',lat:23.8988,lng:90.4056,desc:'A river corridor north of Dhaka; access and conditions vary by location.',icon:'≈'},
  {id:37,name:'Bangladesh National Parliament Viewpoint',bn:'জাতীয় সংসদ ভবন এলাকা',area:'Sher-e-Bangla Nagar',kind:'Architecture',lat:23.7628,lng:90.3787,desc:'A public-facing viewpoint around the landmark parliament complex; restricted areas remain off-limits.',icon:'▦'},
  {id:38,name:'Gulshan Society Jame Mosque',bn:'গুলশান সোসাইটি জামে মসজিদ',area:'Gulshan',kind:'Culture',lat:23.7931,lng:90.4141,desc:'A prominent neighbourhood mosque in Gulshan; visitors should respect prayer times and access rules.',icon:'✧'},
  {id:39,name:'Baitul Aman Jame Mosque',bn:'বায়তুল আমান জামে মসজিদ',area:'Satarkul',kind:'Architecture',lat:23.7958,lng:90.4554,desc:'A notable mosque in the eastern Dhaka area; verify the exact destination before travelling.',icon:'⌂'}
];
const kinds = ['All places','Heritage','Culture','Architecture','Parks','Outdoors','Riverside','Shopping'];
const areas = ['All Greater Dhaka','Old Dhaka','Shahbagh','Ramna','Central Dhaka','Dhanmondi','Gulshan','Mirpur','Uttara','Narayanganj','University Area','Segunbagicha','Agargaon','Sher-e-Bangla Nagar','Baridhara','Banani','Wari','Savar','Ashulia','Tongi','Satarkul'];
const starters = [
  {id:'old-dhaka',title:'Old Dhaka essentials',tag:'HERITAGE + RIVER',desc:'Historic landmarks and the Buriganga riverfront.',stops:[1,4,2,3]},
  {id:'green-dhaka',title:'Green breaks',tag:'PARKS + LAKES',desc:'A slower day around parks and waterside spaces.',stops:[6,9,7,10]},
  {id:'city-forms',title:'Architecture trail',tag:'DESIGN + CULTURE',desc:'Explore landmark architecture across central Dhaka.',stops:[12,5,8,13]}
];
type LandmarkFeature = {type:'Feature';properties:{name:string;height:number;base:number;color:string;part:string};geometry:{type:'Polygon';coordinates:number[][][]}};
function landmarkBox(lng:number,lat:number,width:number,depth:number,height:number,name:string,color:string,angle=0,base=0,part='structure'):LandmarkFeature {
  const dx=width/2,dy=depth/2,a=angle*Math.PI/180;
  const corners=[[-dx,-dy],[dx,-dy],[dx,dy],[-dx,dy],[-dx,-dy]].map(([x,y])=>{
    const east=x*Math.cos(a)-y*Math.sin(a),north=x*Math.sin(a)+y*Math.cos(a);
    return [lng+east/(111320*Math.cos(lat*Math.PI/180)),lat+north/110540];
  });
  return {type:'Feature',properties:{name,height,base,color,part},geometry:{type:'Polygon',coordinates:[corners]}};
}
function landmarkOctagon(lng:number,lat:number,radius:number,height:number,name:string,color:string,base=0,part='structure'):LandmarkFeature {
  const ring:number[][]=[];
  for(let i=0;i<=8;i++){const a=(Math.PI/8)+(i%8)*Math.PI/4;ring.push([lng+Math.cos(a)*radius/(111320*Math.cos(lat*Math.PI/180)),lat+Math.sin(a)*radius/110540]);}
  return {type:'Feature',properties:{name,height,base,color,part},geometry:{type:'Polygon',coordinates:[ring]}};
}
const landmarkModels:LandmarkFeature[] = (() => {
  const out:LandmarkFeature[]=[];
  const mlng=90.3967,mlat=23.7276,m='Central Shaheed Minar';
  out.push(landmarkBox(mlng,mlat,22,17,0.8,m,'#d8c8b2',0,0,'plaza'));
  out.push(landmarkBox(mlng,mlat,9,2.2,11,m,'#eee5d5',-8,0.8,'central pillar'));
  out.push(landmarkBox(mlng-0.000045,mlat+0.000035,2.1,2.1,14,m,'#f4eee1',-7,0.8,'tall pillar'));
  out.push(landmarkBox(mlng+0.000045,mlat+0.000035,2.1,2.1,14,m,'#f4eee1',7,0.8,'tall pillar'));
  out.push(landmarkBox(mlng-0.000105,mlat+0.000005,2,2,8.5,m,'#e6d8c5',-10,0.8,'side pillar'));
  out.push(landmarkBox(mlng+0.000105,mlat+0.000005,2,2,8.5,m,'#e6d8c5',10,0.8,'side pillar'));
  out.push(landmarkBox(mlng,mlat-0.000035,2,2,6,m,'#e6d8c5',0,0.8,'front pillar'));
  const slng=90.37844,slat=23.76247,n='Jatiya Sangsad Bhaban';
  out.push(landmarkOctagon(slng,slat,78,2.5,n,'#8caaa4',0,'complex platform'));
  out.push(landmarkOctagon(slng,slat,53,13,n,'#c4c8b7',2.5,'outer assembly mass'));
  out.push(landmarkOctagon(slng,slat,38,20,n,'#e1dfcf',13,'central mass'));
  out.push(landmarkOctagon(slng,slat,24,27,n,'#b7c8c1',20,'assembly core'));
  out.push(landmarkBox(slng,slat,35,12,10,n,'#d6d3c3',0,2.5,'south wing'));
  out.push(landmarkBox(slng-0.00017,slat+0.00007,12,24,9,n,'#b8c8bd',15,2.5,'east wing'));
  out.push(landmarkBox(slng+0.00017,slat+0.00007,12,24,9,n,'#b8c8bd',-15,2.5,'west wing'));
  return out;
})();
function distanceKm(a:{lat:number;lng:number},b:{lat:number;lng:number}) {
  const rad=(v:number)=>v*Math.PI/180, dLat=rad(b.lat-a.lat), dLng=rad(b.lng-a.lng);
  const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<MapLibreMap|null>(null);
  const routeRef = useRef<number[]>([]);
  const [mapReady,setMapReady] = useState(false);
  const [query,setQuery] = useState('');
  const [kind,setKind] = useState('All places');
  const [area,setArea] = useState('All Greater Dhaka');
  const [selected,setSelected] = useState<Place|null>(null);
  const [route,setRoute] = useState<number[]>([]);
  const [routeLine,setRouteLine] = useState<[number,number][]>([]);
  const [routeInfo,setRouteInfo] = useState<{km:number;minutes:number}|null>(null);
  const [routeLoading,setRouteLoading] = useState(false);
  const [panel,setPanel] = useState<'explore'|'journey'|'saved'>('explore');
  const [bn,setBn] = useState(false);
  const [mobilePanel,setMobilePanel] = useState(false);
  const [favorites,setFavorites] = useState<number[]>([]);
  const [nearby,setNearby] = useState<{lat:number;lng:number}|null>(null);
  const [locating,setLocating] = useState(false);
  const [notice,setNotice] = useState('');
  const [styleReady,setStyleReady] = useState(false);
  const [placePhoto,setPlacePhoto] = useState<{id:number;url:string;title:string;source:string}|null>(null);
  const [photoLoading,setPhotoLoading] = useState(false);
  const filtered = useMemo(()=>places.filter(p=>(panel==='saved'||kind==='All places'||p.kind===kind)&&(panel==='saved'||area==='All Greater Dhaka'||p.area===area)&&(panel!=='saved'||favorites.includes(p.id))&&(p.name+' '+p.bn+' '+p.area+' '+p.kind).toLowerCase().includes(query.toLowerCase())),[query,kind,area,panel,favorites]);
  const choose = useCallback((p:Place,fly=true)=>{
    setSelected(p);
    if(fly&&mapRef.current) mapRef.current.flyTo({center:[p.lng,p.lat],zoom:16,pitch:65,bearing:-15,duration:1100});
    setMobilePanel(false);
  },[]);
  useEffect(()=>{
    const onKeyDown=(event:KeyboardEvent)=>{
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
        event.preventDefault();searchInputRef.current?.focus();
      }
      if(event.key==='Escape'){setSelected(null);setNotice('');setMobilePanel(false);}
    };
    window.addEventListener('keydown',onKeyDown);
    return ()=>window.removeEventListener('keydown',onKeyDown);
  },[]);
  useEffect(()=>{
    try { const v=localStorage.getItem('unfold-dhaka-favorites'); if(v) setFavorites(JSON.parse(v) as number[]); } catch {}
  },[]);
  useEffect(()=>{
    try { localStorage.setItem('unfold-dhaka-favorites',JSON.stringify(favorites)); } catch {}
  },[favorites]);
  useEffect(()=>{
    let cancelled=false;
    void import('maplibre-gl').then(mod=>{
      if(cancelled||!mapContainer.current||mapRef.current)return;
      const map=new mod.Map({
        container:mapContainer.current,
        style:'https://tiles.openfreemap.org/styles/liberty',
        center:[90.405,23.752],zoom:13,pitch:62,bearing:-18,
        canvasContextAttributes:{antialias:true}, maxPitch:78, minZoom:9, maxZoom:20,
      });
      mapRef.current=map;
      map.addControl(new mod.NavigationControl({showCompass:true,visualizePitch:true}), 'bottom-right');
      map.addControl(new mod.ScaleControl({maxWidth:100,unit:'metric'}),'bottom-left');
      map.on('load',()=>{
        if(cancelled)return;
        const style=map.getStyle();
        const labelLayer=style.layers?.find(l=>l.type==='symbol');
        if(!map.getLayer('unfold-3d-buildings')){
          map.addLayer({
            id:'unfold-3d-buildings',type:'fill-extrusion',source:'openmaptiles','source-layer':'building',
            minzoom:13,
            filter:['!=',['get','hide_3d'],'true'],
            paint:{
              'fill-extrusion-color':['interpolate',['linear'],['coalesce',['get','render_height'],['get','height'],8],0,'#c9d5c7',20,'#9db8a8',60,'#d8c8ad',120,'#b4c6c1'],
              'fill-extrusion-height':['interpolate',['linear'],['zoom'],13,0,15,['coalesce',['get','render_height'],['get','height'],8]],
              'fill-extrusion-base':['coalesce',['get','render_min_height'],['get','min_height'],0],
              'fill-extrusion-opacity':0.9
            }
          },labelLayer?.id);
        }
        if(!map.getLayer('unfold-famous-buildings')){
          const famousNames=['Lalbagh Fort','Lalbagh Kella','Ahsan Manzil','Pink Palace','Jatiya Sangsad Bhaban','National Parliament House','Bangladesh National Parliament','Curzon Hall','Baitul Mukarram','Baitul Mukarram National Mosque','Bashundhara City','Jamuna Future Park','National Martyrs Memorial','Suhrawardy Udyan'];
          map.addLayer({
            id:'unfold-famous-buildings',type:'fill-extrusion',source:'openmaptiles','source-layer':'building',minzoom:12.5,
            filter:['any',['in',['get','name'],['literal',famousNames]],['in',['get','name:en'],['literal',famousNames]]],
            paint:{
              'fill-extrusion-color':['match',['coalesce',['get','name'],['get','name:en']],'Lalbagh Fort','#c98b53','Ahsan Manzil','#e7a0a0','Pink Palace','#e7a0a0','Jatiya Sangsad Bhaban','#b6c6bb','National Parliament House','#b6c6bb','Bangladesh National Parliament','#b6c6bb','Curzon Hall','#caa978','Baitul Mukarram','#d9d2b9','Baitul Mukarram National Mosque','#d9d2b9','Bashundhara City','#91b9b0','Jamuna Future Park','#91b9b0','#d6b77e'],
              'fill-extrusion-height':['interpolate',['linear'],['zoom'],12.5,['coalesce',['get','render_height'],['get','height'],16],15,['coalesce',['get','render_height'],['get','height'],16]],
              'fill-extrusion-base':['coalesce',['get','render_min_height'],['get','min_height'],0],
              'fill-extrusion-opacity':1
            }
          },labelLayer?.id);
        }
        if(!map.getSource('unfold-landmark-models')){
          map.addSource('unfold-landmark-models',{type:'geojson',data:{type:'FeatureCollection',features:landmarkModels}});
          map.addLayer({id:'unfold-landmark-3d',type:'fill-extrusion',source:'unfold-landmark-models',minzoom:14,
            paint:{
              'fill-extrusion-color':['get','color'],
              'fill-extrusion-height':['get','height'],
              'fill-extrusion-base':['get','base'],
              'fill-extrusion-opacity':1,
              'fill-extrusion-vertical-gradient':true
            }},labelLayer?.id);
        }
        if(!map.getSource('unfold-places')){
          map.addSource('unfold-places',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
          map.addLayer({id:'unfold-place-halo',type:'circle',source:'unfold-places',paint:{'circle-radius':15,'circle-color':'#f7f4e8','circle-opacity':0.96,'circle-stroke-color':'#164b3b','circle-stroke-width':2}});
          map.addLayer({id:'unfold-place-dots',type:'circle',source:'unfold-places',paint:{'circle-radius':8,'circle-color':'#164b3b','circle-stroke-color':'#fffef7','circle-stroke-width':1.5}});
          map.addLayer({id:'unfold-place-labels',type:'symbol',source:'unfold-places',layout:{'text-field':['get','icon'],'text-font':['Open Sans Regular'],'text-size':12,'text-allow-overlap':true,'text-ignore-placement':true},paint:{'text-color':'#fffef7','text-halo-color':'#164b3b','text-halo-width':0.5}});
          map.addLayer({id:'unfold-place-hover-name',type:'symbol',source:'unfold-places',layout:{'text-field':['case',['boolean',['feature-state','hover'],false],['get','name'],''],'text-font':['Open Sans Semibold'],'text-size':13,'text-offset':[0,1.8],'text-anchor':'top','text-max-width':22,'text-allow-overlap':true,'text-ignore-placement':true},paint:{'text-color':'#173e31','text-halo-color':'#fffef7','text-halo-width':2.5}});
        }
        const openPlace=(event: {features?: Array<{properties?:Record<string,unknown>}>})=>{
          const id=Number(event.features?.[0]?.properties?.id);
          const place=places.find(p=>p.id===id);if(place)choose(place);
        };
        map.on('click','unfold-place-dots',openPlace);
        map.on('click','unfold-place-labels',openPlace);
        const setHover=(event:{features?:Array<{id?:string|number}>},hover:boolean)=>{
          const id=event.features?.[0]?.id;
          if(id!==undefined)map.setFeatureState({source:'unfold-places',id}, {hover});
        };
        for(const layer of ['unfold-place-dots','unfold-place-labels','unfold-place-halo']){
          map.on('mouseenter',layer,(event)=>{map.getCanvas().style.cursor='pointer';setHover(event as {features?:Array<{id?:string|number}>},true);});
          map.on('mousemove',layer,(event)=>setHover(event as {features?:Array<{id?:string|number}>},true));
          map.on('mouseleave',layer,(event)=>{map.getCanvas().style.cursor='';setHover(event as {features?:Array<{id?:string|number}>},false);});
        }
        setStyleReady(true);setMapReady(true);
      });
      map.on('error',e=>{if(e.error) console.warn('Map tile/style issue',e.error.message);});
      return;
    }).catch(()=>setNotice('The 3D map could not load. Check your connection and reload.'));
    return ()=>{cancelled=true;mapRef.current?.remove();mapRef.current=null;};
  },[]);
  useEffect(()=>{
    if(!selected){setPlacePhoto(null);setPhotoLoading(false);return;}
    const controller=new AbortController();
    setPlacePhoto(null);setPhotoLoading(true);
    const searchTerms=[selected.name+' Dhaka Bangladesh',selected.name+' Bangladesh'];
    void (async()=>{
      try{
        for(const term of searchTerms){
          const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:'filetype:bitmap '+term,gsrnamespace:'6',gsrlimit:'8',prop:'imageinfo',iiprop:'url',iiurlwidth:'1000',format:'json',origin:'*'});
          const response=await fetch('https://commons.wikimedia.org/w/api.php?'+params.toString(),{signal:controller.signal});
          if(!response.ok)continue;
          const data=await response.json();
          const pages=Object.values(data.query?.pages||[]) as Array<{title?:string;imageinfo?:Array<{thumburl?:string;url?:string;descriptionurl?:string}>}>;
          const match=pages.find(page=>page.imageinfo?.[0]?.thumburl||page.imageinfo?.[0]?.url);
          const info=match?.imageinfo?.[0];
          if(info){setPlacePhoto({id:selected.id,url:info.thumburl||info.url||'',title:(match?.title||'').replace(/^File:/,''),source:info.descriptionurl||'https://commons.wikimedia.org/'});return;}
        }
      }catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))console.warn('Could not load landmark photo',error);}
      finally{if(!controller.signal.aborted)setPhotoLoading(false);}
    })();
    return ()=>controller.abort();
  },[selected]);
  useEffect(()=>{
    const map=mapRef.current;if(!map||!mapReady)return;
    const source=map.getSource('unfold-places') as GeoJSONSource|undefined;
    if(!source)return;
    source.setData({type:'FeatureCollection',features:filtered.map(p=>({type:'Feature' as const,id:p.id,properties:{id:p.id,name:p.name,icon:p.icon},geometry:{type:'Point' as const,coordinates:[p.lng,p.lat]}}))});
  },[filtered,mapReady]);
  useEffect(()=>{
    const map=mapRef.current;if(!map||!mapReady)return;
    const existing=map.getSource('journey-route') as GeoJSONSource|undefined;
    if(existing){existing.setData({type:'Feature',properties:{},geometry:{type:'LineString',coordinates:routeLine}});return;}
    map.addSource('journey-route',{type:'geojson',data:{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:routeLine}}});
    map.addLayer({id:'journey-route-glow',type:'line',source:'journey-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#f1b75f','line-width':9,'line-opacity':0.22}});
    map.addLayer({id:'journey-route-line',type:'line',source:'journey-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#f1b75f','line-width':4,'line-opacity':0.98}});
  },[routeLine,mapReady]);
  const addStop = (p:Place)=>{
    setRoute(prev=>{const next=prev.includes(p.id)?prev:[...prev,p.id];routeRef.current=next;return next;});
    setRouteLine([]);setRouteInfo(null);setPanel('journey');setNotice(p.name+' added to your journey');
  };
  const removeStop=(id:number)=>{setRoute(prev=>prev.filter(x=>x!==id));setRouteLine([]);setRouteInfo(null);};
  const planRoute=async()=>{
    const ordered=route.map(id=>places.find(p=>p.id===id)).filter((p):p is Place=>Boolean(p));
    if(ordered.length<2){setNotice('Add at least two places to map a route.');return;}
    setRouteLoading(true);setNotice('');
    try{
      const coords=ordered.map(p=>p.lng+','+p.lat).join(';');
      const response=await fetch('https://routing.openstreetmap.de/routed-foot/route/v1/driving/'+coords+'?overview=full&geometries=geojson&steps=false');
      if(!response.ok)throw new Error('Routing service unavailable');
      const data=await response.json();
      if(data.code!=='Ok'||!data.routes?.[0])throw new Error('No walkable route found for these stops');
      const r=data.routes[0];setRouteLine(r.geometry.coordinates as [number,number][]);setRouteInfo({km:r.distance/1000,minutes:Math.max(1,Math.round(r.duration/60))});
      const map=mapRef.current;if(map){const maplibre=await import('maplibre-gl');const coords=r.geometry.coordinates as [number,number][];const bounds=coords.reduce((b,c)=>b.extend(c),new maplibre.LngLatBounds(coords[0],coords[0]));map.fitBounds(bounds,{padding:{top:100,bottom:100,left:window.innerWidth>650?390:36,right:36},duration:900,maxZoom:16,pitch:58});}
      setNotice('Walking route drawn on the 3D map. Times are estimates.');
    }catch(e){setNotice(e instanceof Error?e.message:'Could not create route. Try again.');}
    finally{setRouteLoading(false);}
  };
  const useMyLocation=()=>{
    if(!navigator.geolocation){setNotice('Location is not supported by this browser.');return;}
    setLocating(true);navigator.geolocation.getCurrentPosition(pos=>{
      const loc={lat:pos.coords.latitude,lng:pos.coords.longitude};setNearby(loc);setLocating(false);
      mapRef.current?.flyTo({center:[loc.lng,loc.lat],zoom:16,pitch:65,duration:1000});
      setNotice('Your location stays in this browser.');},()=>{setLocating(false);setNotice('Location permission was not granted.');},{enableHighAccuracy:true,timeout:10000});
  };
  const nearest=useMemo(()=>nearby?[...filtered].sort((a,b)=>distanceKm(nearby,a)-distanceKm(nearby,b)):filtered,[nearby,filtered]);
  const toggleFavorite=(p:Place)=>setFavorites(prev=>prev.includes(p.id)?prev.filter(id=>id!==p.id):[...prev,p.id]);
  const flyToArea=(a:string)=>{setArea(a);const bounds:Record<string,[[number,number],[number,number]]>={'Old Dhaka':[[90.37,23.69],[90.42,23.73]],'Shahbagh':[[90.38,23.72],[90.41,23.75]],'Ramna':[[90.38,23.72],[90.42,23.75]],'Central Dhaka':[[90.38,23.72],[90.43,23.78]],'Dhanmondi':[[90.36,23.72],[90.40,23.77]],'Gulshan':[[90.39,23.77],[90.44,23.82]],'Mirpur':[[90.32,23.78],[90.38,23.84]],'Uttara':[[90.36,23.84],[90.43,23.90]],'Narayanganj':[[90.46,23.59],[90.55,23.64]],'University Area':[[90.385,23.725],[90.405,23.74]],'Segunbagicha':[[90.395,23.725],[90.415,23.745]],'Agargaon':[[90.365,23.765],[90.395,23.79]],'Sher-e-Bangla Nagar':[[90.36,23.745],[90.395,23.78]],'Baridhara':[[90.405,23.795],[90.44,23.825]],'Banani':[[90.39,23.78],[90.42,23.81]],'Wari':[[90.405,23.705],[90.43,23.73]],'Savar':[[90.24,23.88],[90.29,23.94]],'Ashulia':[[90.29,23.86],[90.36,23.92]],'Tongi':[[90.385,23.88],[90.43,23.92]],'Satarkul':[[90.43,23.77],[90.48,23.82]]};const b=bounds[a];if(b)mapRef.current?.fitBounds(b,{padding:100,duration:850,pitch:60});else mapRef.current?.flyTo({center:[90.405,23.752],zoom:11,pitch:58,duration:850});};
  return <main className="map-app">
    <div className="map-canvas" ref={mapContainer} aria-label="Interactive 3D map of Greater Dhaka"/>
    {!mapReady&&<div className="map-loading" role="status"><span className="loading-mark">u<span>↗</span></span><b>Unfold Dhaka</b><span>Preparing your 3D city…</span><div className="loading-track"><i/></div></div>}
    <header className="map-top">
      <a className="brand" href="/" aria-label="Unfold Dhaka home"><span className="brand-mark">u<span>↗</span></span><span><b>unfold<span>dhaka</span></b><small>GREATER DHAKA, IN 3D</small></span></a>
      <label className="map-search"><span>⌕</span><input ref={searchInputRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder={bn?'জায়গা খুঁজুন…':'Search places, neighbourhoods…'} aria-label="Search places"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search">×</button>}<kbd>⌘ K</kbd></label>
      <div className="top-actions"><button className="language" onClick={()=>setBn(!bn)}>{bn?'EN':'বাংলা'}</button><button className="location-button" onClick={useMyLocation}>{locating?'Locating…':'◎ Near me'}</button></div>
    </header>
    {mobilePanel&&<button className="panel-backdrop" aria-label="Close places panel" onClick={()=>setMobilePanel(false)}/>}
    <aside className={'map-panel '+(mobilePanel?'panel-open':'')}>
      <div className="panel-tabs"><button className={panel==='explore'?'active':''} onClick={()=>setPanel('explore')}>Explore</button><button className={panel==='journey'?'active':''} onClick={()=>setPanel('journey')}>My journey <span>{route.length}</span></button><button className={panel==='saved'?'active':''} onClick={()=>setPanel('saved')}>Saved <span>{favorites.length}</span></button><button className="panel-close" onClick={()=>setMobilePanel(false)}>×</button></div>
      {panel==='explore'?<><div className="panel-intro"><div className="kicker">THE CITY, YOURS TO DISCOVER</div><h1>{bn?'ঢাকা, নতুন চোখে।':<>Find your<br/><em>own Dhaka.</em></>}</h1><p>{bn?'পুরান ঢাকার অলিগলি থেকে উত্তরের নতুন শহর—৩ডি মানচিত্রে ঘুরে দেখুন।':'Orbit the real city, discover landmarks and build a day that feels like yours.'}</p></div>
        <div className="filter-row"><select value={area} onChange={e=>flyToArea(e.target.value)} aria-label="Neighbourhood">{areas.map(a=><option key={a}>{a}</option>)}</select><button onClick={()=>{setKind('All places');setArea('All Greater Dhaka');setQuery('');flyToArea('All Greater Dhaka');}}>Reset</button></div>
        <div className="kind-scroll">{kinds.map(k=><button key={k} className={kind===k?'chosen':''} onClick={()=>setKind(k)}>{k}</button>)}</div>
        <div className="list-heading"><span>{nearby?'NEAREST PLACES':'PLACES TO EXPLORE'}</span><span>{filtered.length} results</span></div>
        <div className="places-list">{nearest.map(p=><article key={p.id} className={'place-row '+(selected?.id===p.id?'selected':'')}><button className="place-main" onClick={()=>choose(p)}><span className="place-symbol">{p.icon}</span><span className="place-text"><b>{bn?p.bn:p.name}</b><small>{p.area} <i>·</i> {p.kind}{nearby?' · '+distanceKm(nearby,p).toFixed(1)+' km away':''}</small></span><span className="row-arrow">↗</span></button><button className={'save-mini '+(favorites.includes(p.id)?'is-saved':'')} onClick={()=>toggleFavorite(p)} aria-label={favorites.includes(p.id)?'Remove saved place':'Save place'}>{favorites.includes(p.id)?'★':'☆'}</button></article>)}{!filtered.length&&<div className="no-results">Nothing here yet. Try a different search.</div>}</div>
        <div className="panel-bottom"><span className="live-dot"/><span>{styleReady?'3D map active':'Loading 3D city map'} <small>· Open map data</small></span><button onClick={()=>setPanel('journey')}>Plan a day ↗</button></div>
      </>:panel==='journey'?<><div className="panel-intro compact"><div className="kicker">MAKE A DAY OF IT</div><h2>Your journey<span className="count-pill">{route.length} stops</span></h2><p>Choose places, put them in your preferred order, then draw a route across the city.</p></div>
        <div className="journey-tools"><button onClick={()=>{setRoute([]);setRouteLine([]);setRouteInfo(null);setNotice('Journey cleared.');if(mapRef.current&&mapRef.current.getSource('journey-route'))(mapRef.current.getSource('journey-route') as GeoJSONSource).setData({type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[]}});}}>Clear all</button><button className="primary-small" disabled={routeLoading||route.length<2} onClick={planRoute}>{routeLoading?'Drawing route…':'Draw walking route ↗'}</button></div>
        <div className="journey-list">{route.map((id,i)=>{const p=places.find(x=>x.id===id);if(!p)return null;return <article className="stop-row" key={id}><span className="stop-number">{i+1}</span><button className="stop-name" onClick={()=>choose(p)}><b>{p.name}</b><small>{p.area}</small></button><button className="remove-stop" onClick={()=>removeStop(id)} aria-label="Remove stop">×</button></article>})}{route.length===0&&<div className="empty-journey"><span>↗</span><b>Your map, your route.</b><p>Add places from Explore or start with a ready-made itinerary below.</p></div>}</div>
        {routeInfo&&<div className="route-summary"><div><b>{routeInfo.km.toFixed(1)} km</b><small>route distance</small></div><div><b>~{routeInfo.minutes} min</b><small>walking estimate</small></div></div>}
        <div className="suggested-routes"><div className="list-heading">START WITH A ROUTE</div>{starters.map(s=><button className="starter-route" key={s.id} onClick={()=>{setRoute(s.stops);routeRef.current=s.stops;setRouteLine([]);setRouteInfo(null);setNotice(s.title+' loaded. Draw the route to see it on the map.')}}><span className="starter-icon">↗</span><span><b>{s.title}</b><small>{s.tag} · {s.stops.length} stops</small><em>{s.desc}</em></span><span>›</span></button>)}</div>
      </>:<><div className="panel-intro compact"><div className="kicker">YOUR PERSONAL SHORTLIST</div><h2>Saved places</h2><p>Favourites stay on this device. No account needed.</p></div><div className="places-list saved-list">{filtered.map(p=><article key={p.id} className={'place-row '+(selected?.id===p.id?'selected':'')}><button className="place-main" onClick={()=>choose(p)}><span className="place-symbol">{p.icon}</span><span className="place-text"><b>{p.name}</b><small>{p.area} · {p.kind}</small></span><span className="row-arrow">↗</span></button><button className="save-mini is-saved" onClick={()=>toggleFavorite(p)} aria-label="Remove saved place">★</button></article>)}{!filtered.length&&<div className="no-results">Save a place with the ☆ button and it will appear here.</div>}</div></>}
    </aside>
    <div className="map-caption"><span className={styleReady?"caption-dot":"caption-dot caption-dot-loading"}/><b>{styleReady?'GREATER DHAKA · 3D':'PREPARING 3D MAP'}</b><span>Buildings are extruded from available map data</span></div>
    {selected&&<section className="place-card" aria-label="Selected place"><button className="card-close" onClick={()=>setSelected(null)} aria-label="Close place details">×</button><div className="card-kicker">{selected.kind.toUpperCase()} <span>·</span> {selected.area.toUpperCase()}</div><h2>{bn?selected.bn:selected.name}</h2>{placePhoto?.id===selected.id&&<figure className="place-photo"><img src={placePhoto.url} alt={selected.name+' — photo from Wikimedia Commons'} loading="lazy"/><figcaption><span>{placePhoto.title}</span><a href={placePhoto.source} target="_blank" rel="noreferrer">Photo source ↗</a></figcaption></figure>}{photoLoading&&<div className="photo-loading" aria-live="polite">Finding a photo of this place…</div>}<p>{selected.desc}</p><div className="place-meta"><span>⌖ {selected.lat.toFixed(4)}° N, {selected.lng.toFixed(4)}° E</span><span>Hours not verified</span></div><div className="card-actions"><button className="add-stop" onClick={()=>addStop(selected)}>{route.includes(selected.id)?'✓ In your journey':'＋ Add stop'}</button><button className={'favorite-action '+(favorites.includes(selected.id)?'is-saved':'')} onClick={()=>toggleFavorite(selected)}>{favorites.includes(selected.id)?'★ Saved':'☆ Save'}</button><button className="fly-action" onClick={()=>choose(selected)}>Fly to ↗</button></div></section>}
    {notice&&<div className="notice" role="status"><span>{notice}</span><button onClick={()=>setNotice('')}>×</button></div>}
    <button className="mobile-map-menu" onClick={()=>setMobilePanel(true)}>☰ Places & routes</button>
    <div className="map-credit">Map data © OpenStreetMap contributors · 3D tiles © OpenFreeMap</div>
  </main>;
}

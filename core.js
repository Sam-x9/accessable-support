(function(root){
'use strict';
const services=[{id:'technical',name:'IT & Technical Support',minutes:30,icon:'01',subtitle:'Troubleshoot technology.',description:'Devices, accounts, software and connectivity.'},{id:'academic',name:'Learning & Academic Guidance',minutes:45,icon:'02',subtitle:'Move forward in your studies.',description:'Coursework, certifications and study planning.'},{id:'career',name:'Career & Mentorship',minutes:30,icon:'03',subtitle:'Prepare for your next step.',description:'Resumes, interviews and career direction.'},{id:'wellbeing',name:'Wellbeing & Accessibility',minutes:45,icon:'04',subtitle:'Support that fits your needs.',description:'Wellbeing resources and accessible online participation.'}];
const needs=['Live captions','ASL interpretation request','Screen-reader friendly materials','Extra session time','Text-based communication','Low-sensory meeting'];
const localDay=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const date=r=>new Date(r.date+'T'+r.time);
const duration=r=>(services.find(s=>s.name===r.service)?.minutes||30)+(r.needs.includes('Extra appointment time')?15:0);
const active=r=>!['cancelled','completed'].includes(r.status);
function slots(day,service,accommodations,records,exclude='',now=new Date()){
 const d=new Date(day+'T12:00');if(Number.isNaN(+d)||[0,6].includes(d.getDay()))return [];
 const n=duration({service,needs:accommodations}),result=[];
 for(let m=540;m<960;m+=30){const time=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),s=new Date(day+'T'+time),end=+s+n*60000;
 if(s<=now||m+n>960)continue;
 if(records.some(r=>r.id!==exclude&&active(r)&&+s<+date(r)+duration(r)*60000&&end>+date(r)))continue;
 result.push(time);
 }return result;
}
function validate(r,records,exclude='',now=new Date()){
 if(!r.name.trim())return 'Please enter your name.';
 if(!services.some(s=>s.name===r.service))return 'Please choose a support service.';
 if(!['Video call'].includes(r.mode))return 'Please choose a meeting format.';
 if(!slots(r.date,r.service,r.needs,records,exclude,now).includes(r.time))return 'That time is no longer available. Please choose another slot.';
 return '';
}
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icalEscape=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function ics(r){return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AccessAble//Appointment Requests//EN','BEGIN:VEVENT','UID:'+r.id+'@accessable.local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(date(r)),'DTEND:'+stamp(new Date(+date(r)+duration(r)*60000)),'SUMMARY:'+icalEscape('Appointment request: '+r.service),'DESCRIPTION:Support request saved locally. No staff confirmation or video link has been issued.','STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR',''].join('\r\n');}
function csv(records){const safe=v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return [['Service','Date','Time','Name','Format','Status','Accommodation requests'],...records.map(r=>[r.service,r.date,r.time,r.name,r.mode,r.status,r.needs.join('; ')])].map(row=>row.map(safe).join(',')).join('\r\n');}
const api={services,needs,localDay,date,duration,active,slots,validate,escape,ics,csv};if(typeof module!=='undefined')module.exports=api;else root.AccessCore=api;
})(globalThis);

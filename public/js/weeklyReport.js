document.addEventListener("DOMContentLoaded",()=>{

const labels=[];
const values=[];

window.weeklyData.forEach(day=>{

const d=new Date(day.date);

labels.push(

d.toLocaleDateString("en-US",{

weekday:"short"

})

);

values.push((day.minutes/60).toFixed(1));

});

new Chart(document.getElementById("weeklyChart"),{

type:"bar",

data:{

labels,

datasets:[{

label:"Hours",

data:values,

backgroundColor:"#2563eb",

borderRadius:8

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:false

}

}

}

});

});
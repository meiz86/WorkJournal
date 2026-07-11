document.addEventListener("DOMContentLoaded", () => {

    const hoursCanvas = document.getElementById("hoursChart");

    if(hoursCanvas){

        new Chart(hoursCanvas,{

            type:"bar",

            data:{

                labels:[
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],

                datasets:[{

                    label:"Hours",

                    data:[7,8,6,7.5,8,4,0]

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        });

    }

});